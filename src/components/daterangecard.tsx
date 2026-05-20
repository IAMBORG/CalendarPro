// daterangecard.tsx

/*
This component represents a date range card that displays a timeline of dates.
It receives several props to customize its behavior and appearance.
@param {dateCardProps} props - An object containing the props passed to this component.
@returns {JSX.Element} A JSX element that renders the date range card.
*/
import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import Grid from "@mui/material/Grid";
import Zoom from "@mui/material/Zoom";
import { ThemeProvider } from "@mui/material/styles";
import { SetTheme } from "./settheme";
import { useHotkeys } from "react-hotkeys-hook";
import TopRow from "./toprow";
import RangeSlider from "./rangeslider";
import { dateCardProps, dateRange } from "../interface";
import { useDateMoveKeys } from "./datemovekeys";
import {
  Increment,
  clampRangeToScope,
  equalRanges,
} from "../dateutils";
import { HelpProvider } from "./helpprovider";
import { compareAsc } from "date-fns";
import { useLocalization } from "../localeutils";

export default function DateRangeCard(props: dateCardProps) {
  const fallbackRange: dateRange = React.useMemo(
    () => ({ start: new Date(), end: new Date() }),
    [],
  );
  const safeDates = props.dates ?? props.rangeScope ?? fallbackRange;
  const safeRangeScope = props.rangeScope ?? safeDates;
  const safeStepInit = props.stepInit ?? "day";
  const safeStepViz =
    props.stepViz ??
    ({
      day: true,
      week: true,
      pay: false,
      month: true,
      quarter: false,
      year: true,
    } as const);

  // Use useState to manage the UI's date state, initialized from props.
  const [currentDates, setCurrentDates] = useState<dateRange>(safeDates);

  // keep UI in sync if the Power BI changes dates externally
  useEffect(() => {
    // only replace if it actually changed, to avoid extra renders
    if (props.dates && !equalRanges(props.dates, currentDates)) {
      setCurrentDates(props.dates);
    }
  }, [props.dates, currentDates]);

  // Use the localization hook to get the localization manager.
  const localization = useLocalization();

  // Memoize the theme creation to avoid re-calculating on every render.
  const theme = useMemo(
    () =>
      SetTheme({
        themeMode: props.themeMode,
        themeColor: props.themeColor ?? "#607d8b",
        themeFont: props.themeFont ?? "Segoe UI",
        fontSize: String(props.fontSize ?? 10),
        fontColor: props.fontColor ?? "#000000",
      }),
    [props.themeMode, props.themeColor, props.themeFont, props.fontSize],
  );

  // Use useState to manage component-level state, initialized from props.
  const [openSlider, setOpenSlider] = useState<boolean>(
    props.showSlider ?? false,
  );
  const [stepValue, setStepValue] = useState<string>(safeStepInit);
  const [stepOpen, setStepOpen] = useState<boolean>(false);

  // Memoize the current value to avoid unnecessary recalculations.
  const current = useMemo(
    () =>
      Increment(
        safeStepViz,
        props.weekStartDay ?? 0,
        props.yearStartMonth ?? 0,
        localization,
        props.payProps,
        props.showMore ?? false,
        safeRangeScope,
      ),
    [
      safeStepViz,
      props.weekStartDay,
      props.yearStartMonth,
      localization,
      props.payProps,
      props.showMore,
      safeRangeScope,
    ],
  );

  // Use a single useEffect to handle prop changes for initial state.
  useEffect(() => {
    setOpenSlider(props.showSlider ?? false);
    setStepValue(props.stepInit ?? "day");
  }, [props.showSlider, props.stepInit]);

  // Use useCallback to memoize the toggle functions, preventing them from
  // being recreated on every render. This optimizes child component rendering.
  const toggleSlider = useCallback(() => setOpenSlider((prev) => !prev), []);
  const toggleStepOpen = useCallback(() => setStepOpen((prev) => !prev), []);

  // UI-only updates
  const handlePreviewChange = useCallback(
    (range: [Date, Date]) => {
      const sorted = props.singleDay
        ? [range[0], range[0]]
        : [...range].sort((a, b) => a.getTime() - b.getTime());

      const nextRange = { start: sorted[0], end: sorted[1] };
      const resolvedRange = props.limitToScope
        ? clampRangeToScope(nextRange, safeRangeScope)
        : nextRange;

      setCurrentDates(resolvedRange);
    },
    [props.singleDay, props.limitToScope, safeRangeScope],
  );

  // This is the centralized handler. It updates the local state and then
  // calls the prop function to inform Power BI.
  const handleDateChange = useCallback(
    (filter: [Date, Date]) => {
      // Sort dates to ensure the start is always before the end.
      const sortedDates = props.singleDay
        ? [filter[0], filter[0]]
        : filter.sort(compareAsc);

      const nextRange: dateRange = {
        start: sortedDates[0],
        end: sortedDates[1],
      };

      const resolvedRange = props.limitToScope
        ? clampRangeToScope(nextRange, safeRangeScope)
        : nextRange;

      // Update local state first to trigger UI re-render
      setCurrentDates(resolvedRange);

      // Then inform Power BI
      props.onFilterChanged?.(resolvedRange);
    },
    [
      props.singleDay,
      props.limitToScope,
      props.onFilterChanged,
      safeRangeScope,
    ],
  );

  // This is the onChangeVal method that passes up a simple array of dates
  // to the main handler.
  const onChangeVal = useCallback(
    (filter: Date[]) => {
      if (filter.length < 2) return;
      handleDateChange([filter[0], filter[1]]);
    },
    [handleDateChange],
  );

  // Use the custom hook for keyboard shortcuts.
  useDateMoveKeys(onChangeVal, stepValue, currentDates, current);
  useHotkeys("s", toggleSlider, [openSlider]);

  // Defensive: if we get rendered without landing being flipped off, bail.
  // Required because removing this caused regressions in the landing→data
  // transition. Do NOT remove again.
  if (!props.landingOff) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <HelpProvider
        showHelpIcon={props.showHelpIcon}
        showTooltip={props.showTooltip}
        showExtendedTooltip={props.showExtendedTooltip}
        localization={localization}
        themeMode={props.themeMode}
      >
        <Grid
          container
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <TopRow
            {...props}
            dates={currentDates}
            showMore={props.showMore}
            showMove={props.showMove}
            localization={localization}
            showExpand={props.showExpand}
            showSlider={props.showSlider ?? false}
            openSlider={openSlider}
            toggleSlider={toggleSlider}
            stepOpen={stepOpen}
            stepValue={stepValue}
            handleVal={onChangeVal}
            handleClick={toggleStepOpen}
            setStepValue={setStepValue}
            setStepOpen={setStepOpen}
            current={current}
          />
          <Zoom in={openSlider}>
            <Grid container spacing={0} size={12}>
              <Grid size="grow" sx={{ marginLeft: 1, paddingTop: 0.1 }}>
                <RangeSlider
                  {...props}
                  dates={currentDates}
                  stepValue={stepValue}
                  stepFmt={props.stepFmt}
                  rangeScope={safeRangeScope}
                  localization={localization}
                  // During drag: preview only
                  onPreview={handlePreviewChange}
                  // On release: commit to host
                  onCommit={onChangeVal}
                />
              </Grid>
            </Grid>
          </Zoom>
        </Grid>
      </HelpProvider>
    </ThemeProvider>
  );
}
