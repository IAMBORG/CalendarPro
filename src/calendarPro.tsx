"use strict";

import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import IColorPalette = powerbi.extensibility.IColorPalette;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import DataView = powerbi.DataView;
import { IFilterColumnTarget, AdvancedFilter } from "powerbi-models";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualSettingsModel } from "./vsettings";
import { ColorHelper } from "powerbi-visuals-utils-colorutils";
import { VisualState, dateRange, dateCardProps } from "./interface";
import { mapOptionsToState, restoreRangeFilter } from "./optionsMapper";
import tinycolor from "tinycolor2";
import DateRangeCard from "./components/daterangecard";
import { isEqual } from "lodash";
import { LocalizationContext, DateFnsLocaleProvider } from "./localeutils";
import { ReactVisual } from "./reactUtils";
import { HotkeysProvider } from "react-hotkeys-hook";
import { toDateRange } from "./dateutils";
/**
 * The CalendarPro class is the main entry point for the visual. It manages the
 * lifecycle of the visual and handles communication between Power BI and the React component.
 * It now inherits from ReactVisual to abstract away the React rendering logic.
 */
export class CalendarPro extends ReactVisual implements IVisual {
  private visualHost!: IVisualHost;
  private events!: IVisualEventService;
  private localizationManager!: ILocalizationManager;
  private formattingSettings!: VisualSettingsModel;
  private formattingSettingsService!: FormattingSettingsService;
  private dataView: DataView | null = null;
  private colorPalette!: IColorPalette;
  private colorHelper!: ColorHelper;
  private selectionManager!: ISelectionManager;
  private state: VisualState = { settings: {} as dateCardProps };
  private locale = "en-US";
  private currentFilter: dateRange | null = null;
  private initialLoadComplete: boolean = false;

  private static readonly BOOKMARK_OBJECT = "general";
  private static readonly BOOKMARK_PROPERTY = "filter";
  private static readonly filterObjectProperty = {
    objectName: "general",
    propertyName: "filter",
  };
  private lastKnownFilterSignature: string | null = null;
  private bookmarkDetectionWindow = 1000; // 1 second grace period after load
  private lastUpdateTime = 0;
  private maybeBookmarkActive = false;

  // simplified signature generator
  private getFilterSignature(options: VisualUpdateOptions): string {
    const filters =
      options.jsonFilters?.map((f) => JSON.stringify(f)).join("|") ?? "";
    return filters;
  }

  /**
   * The constructor initializes visual properties and the React root.
   * @param options The visual constructor options from Power BI.
   */
  constructor(
    options: VisualConstructorOptions = {} as VisualConstructorOptions,
  ) {
    // Call the parent constructor from ReactVisual to initialize the React component and root
    super(options);
    this.initializeVisualProperties(options);
    this.initializeReact();
    this.localizationManager = options.host.createLocalizationManager();
    this.formattingSettingsService = new FormattingSettingsService(
      this.localizationManager,
    );
  }

  /**
   * Initializes visual-specific properties and services.
   * @param options The visual constructor options.
   */
  protected initializeVisualProperties(
    options: VisualConstructorOptions,
  ): void {
    this.visualHost = options.host;
    this.locale = options.host.locale;
    this.events = options.host.eventService;
    this.colorPalette = this.visualHost.colorPalette;
    this.colorHelper = new ColorHelper(this.colorPalette);

    // Right-click context menu — Power BI policy 1180.2.5 requires the
    // visual to surface the host's native context menu on empty space
    // within a data-bound visual. Attaching to hostElement catches
    // events bubbling up from React-rendered children. The listener is
    // cleaned up automatically when Power BI removes hostElement from
    // the DOM, so no destroy() method is required.
    this.selectionManager = this.visualHost.createSelectionManager();
    this.hostElement.addEventListener("contextmenu", (event: MouseEvent) => {
      event.preventDefault();
      this.selectionManager.showContextMenu({}, {
        x: event.clientX,
        y: event.clientY,
      });
    });
  }

  /**
   * Initializes the React component by passing the main component and the data handler to the base class.
   */
  protected initializeReact(): void {
    const VisualComponent = (props: any) => (
      <LocalizationContext.Provider value={this.localizationManager}>
        <DateFnsLocaleProvider languageCode={this.locale}>
          <HotkeysProvider>
            <DateRangeCard {...props} />
          </HotkeysProvider>
        </DateFnsLocaleProvider>
      </LocalizationContext.Provider>
    );
    super.initializeReact(VisualComponent, (interval) =>
      this.applyDateFilter(interval),
    );
  }

  /**
   * The update method is called whenever the visual's data or settings change.
   * It handles the core logic of the visual.
   * @param options The visual update options from Power BI.
   */

  public update(options: VisualUpdateOptions) {
    try {
      this.events.renderingStarted(options);

      // Bail on no-data or non-date columns. Tear down React so Power BI's
      // default landing page renders. If a field IS dropped but isn't a date
      // column, surface a warning icon so the user knows why nothing's showing.
      if (!this.isValidDataView(options)) {
        this.initialiseVisualState();
        this.reactUnmount();

        const columns = options?.dataViews?.[0]?.metadata?.columns;
        const hasColumn = !!(columns && columns.length > 0);
        const isDateColumn =
          options?.dataViews?.[0]?.categorical?.categories?.[0]?.source?.type
            ?.dateTime === true;
        if (hasColumn && !isDateColumn) {
          this.visualHost.displayWarningIcon(
            "Date field required",
            "Calendar Pro needs a date or date-time column. Replace the current field with a date column to use this visual.",
          );
        }

        this.events.renderingFinished(options);
        return;
      }

      const shouldGetSettings = !isEqual(options.dataViews[0], this.dataView);
      this.dataView = options.dataViews[0];

      if (shouldGetSettings || !this.dataView) {
        this.loadVisualSettings(options);
      }

      // LANDING PAGE OFF — flip the flag; full render happens once at the end.
      if (!this.state.landingOff) {
        this.state.landingOff = true;
      }

      const now = Date.now();
      const filterSignature = this.getFilterSignature(options);
      const isFilterChange = filterSignature !== this.lastKnownFilterSignature;
      const elapsed = now - this.lastUpdateTime;
      this.lastUpdateTime = now;

      // 👇 detect bookmark-like condition
      if (
        isFilterChange &&
        elapsed < this.bookmarkDetectionWindow &&
        this.initialLoadComplete
      ) {
        this.maybeBookmarkActive = true;
      } else {
        this.maybeBookmarkActive = false;
      }
      // store signature for next pass
      this.lastKnownFilterSignature = filterSignature;

      // normalise host filter from options (may be null)
      const hostFilter = restoreRangeFilter(options);

      let resolvedFilter: dateRange | null = null;
      let shouldApplyFilter = false;

      if (this.maybeBookmarkActive && hostFilter) {
        // ✅ inferred bookmark: always wins
        resolvedFilter = hostFilter;
      } else if (
        this.state.settings.forceStartRange &&
        !this.initialLoadComplete
      ) {
        // ✅ forced startup range overrides persisted
        resolvedFilter = this.state.settings.startupFilter ?? null;
        shouldApplyFilter = true;
      } else if (hostFilter) {
        // ✅ persisted filter (normal restore)
        resolvedFilter = hostFilter;
      } else if (this.state.settings.startupFilter) {
        resolvedFilter = this.state.settings.startupFilter;
        shouldApplyFilter = !this.initialLoadComplete;
      }

      // ---------------------------------------------------------
      // Apply filter if this logic decided we should push one to host
      // (e.g. forced startup or startup default on first load/settings-changed)
      // ---------------------------------------------------------
      if (shouldApplyFilter && resolvedFilter) {
        this.applyDateFilter(resolvedFilter);
        // treat it as pending until host echoes back
        this.currentFilter = resolvedFilter;

        // 🔥 Update the UI with the *new* filter state BEFORE returning
        this.updateReactContainers({
          ...this.state.settings,
          dates: this.currentFilter,
          landingOff: this.state.landingOff, // Pass the correct landing state
        });

        this.initialLoadComplete = true;
        this.events.renderingFinished(options);
        return;
      }

      // update React UI
      this.currentFilter = resolvedFilter ?? this.currentFilter;
      this.updateReactContainers({
        ...this.state.settings,
        dates: this.currentFilter,
        landingOff: this.state.landingOff,
      });

      this.initialLoadComplete = true;
      this.events.renderingFinished(options);
    } catch (e) {
      this.events.renderingFailed(options);
    }
  }

  /**
   * A helper method to validate the data view.
   * @param options The visual update options.
   * @returns True if the data view is valid, false otherwise.
   */
  private isValidDataView(options: VisualUpdateOptions): boolean {
    const dataView = options?.dataViews?.[0];
    return !!(
      dataView?.metadata?.columns?.length &&
      options.viewport &&
      dataView.categorical?.categories?.[0]?.source?.type?.dateTime
    );
  }

  /**
   * A helper method to initialize the visual state.
   */
  private initialiseVisualState(): void {
    this.dataView = null;
    this.currentFilter = null;
    this.initialLoadComplete = false;
  }

  /**
   * Loads the visual settings from the data view.
   * @param options The visual update options.
   */
  private loadVisualSettings(options: VisualUpdateOptions): void {
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualSettingsModel,
        options.dataViews[0],
      );

    // Correcting the mapOptionsToState call to match the provided signature.
    const newVisualState = mapOptionsToState(
      options,
      this.formattingSettings,
      this.initialLoadComplete,
    );

    this.state = {
      ...this.state,
      ...newVisualState,
    };

    if (this.colorHelper.isHighContrast) {
      const foregroundColor =
        this.colorHelper.getHighContrastColor("foreground");
      const backgroundColor =
        this.colorHelper.getHighContrastColor("background");
      const themeMode = tinycolor(backgroundColor).isDark() ? "dark" : "light";
      Object.assign(this.state.settings, {
        fontColor: foregroundColor,
        themeColor: foregroundColor,
        themeMode,
      });
    }
  }

  /**
   * Returns the visual's properties for the formatting pane.
   * @param options The enumeration options.
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions,
  ): VisualObjectInstanceEnumeration {
    let objectEnumeration: VisualObjectInstance[] = [];

    if (options.objectName === CalendarPro.BOOKMARK_OBJECT) {
      const bookmarkState = {
        filter: this.currentFilter || { start: null, end: null },
      };
      const instance: VisualObjectInstance = {
        objectName: CalendarPro.BOOKMARK_OBJECT,
        displayName: "Bookmark Filter",
        selector: {} as any,
        properties: {
          [CalendarPro.BOOKMARK_PROPERTY]: JSON.stringify(bookmarkState),
        },
      };

      objectEnumeration.push(instance);
    }
    return objectEnumeration;
  }

  /**
   * Applies a new filter to the date column.
   * This method is a public arrow function to ensure `this` context is preserved.
   * @param dates The date range to filter by.
   */
  public applyDateFilter = (dates: {
    start: Date | string | number;
    end: Date | string | number;
  }): void => {
    if (!this.state?.category) return;

    const dtes = toDateRange(dates);

    this.visualHost.applyJsonFilter(
      this.createFilter(dtes.start, dtes.end, this.state.category.filterTarget),
      CalendarPro.filterObjectProperty.objectName,
      CalendarPro.filterObjectProperty.propertyName,
      dates.start && dates.end
        ? powerbi.FilterAction.merge
        : powerbi.FilterAction.remove,
    );
  };

  /**
   * Creates an advanced filter object for Power BI.
   * @param startDate The start date for the filter.
   * @param endDate The end date for the filter.
   * @param filterTarget The filter target object.
   * @returns An `AdvancedFilter` instance.
   */
  public createFilter(
    startDate: Date,
    endDate: Date,
    filterTarget: IFilterColumnTarget,
  ): AdvancedFilter {
    // The dates are already Date objects, so we can directly use toJSON().
    return new AdvancedFilter(
      filterTarget,
      "And",
      {
        operator: "GreaterThanOrEqual",
        value: startDate.toJSON(),
      },
      {
        operator: "LessThanOrEqual",
        value: endDate.toJSON(),
      },
    );
  }

  /**
   * Returns the formatting model for the properties pane.
   */
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings,
    );
  }
}
