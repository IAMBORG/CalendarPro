import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { flushSync } from "react-dom";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import { Interval } from "date-fns";

/**
 * A wrapper component to bridge the Power BI visual and the React component.
 * It passes all props directly to the main visual component.
 */
interface ReactContainerProps {
  component: React.ComponentType<any>;
  data: any;
  onFilterChanged?: (data: Interval) => void;
}

const ReactContainer: React.FC<ReactContainerProps> = ({
  component: Component,
  data,
  onFilterChanged,
}) => {
  // Ensure handler is instance-scoped and stable
  const handleFilterChanged = React.useCallback(
    (interval: Interval) => {
      onFilterChanged?.(interval);
    },
    [onFilterChanged],
  );

  return <Component {...data} onFilterChanged={handleFilterChanged} />;
};

/**
 * An abstract class to provide common functionality for Power BI visuals
 * that use React.
 */
export abstract class ReactVisual {
  protected hostElement: HTMLElement;
  protected reactTarget: HTMLElement;
  protected root: Root | null = null;
  private mainComponent!: React.ComponentType<any>;
  private filterCallback!: (data: Interval) => void;

  constructor(options: VisualConstructorOptions) {
    // Power BI's container — leave this alone so the host can render its
    // own landing page and own selection chrome over it.
    this.hostElement = options.element;
    // Create a child div for React. Mounting React on options.element
    // directly would let React's reconciler take over the host's container.
    this.reactTarget = document.createElement("div");
    this.reactTarget.style.width = "100%";
    this.reactTarget.style.height = "100%";
    this.reactTarget.style.boxSizing = "border-box";
  }

  /**
   * Initializes the React component tree by creating the root and
   * performing the initial render.
   * @param component The main React component to render.
   * @param onFilterChanged The callback function for filter changes.
   */
  protected initializeReact(
    component: React.ComponentType<any>,
    onFilterChanged: (data: Interval) => void,
  ): void {
    // Don't create the root yet — wait for the first real render call.
    // This keeps the visual's container empty so Power BI can render
    // its default landing page in no-data state.
    this.mainComponent = component;
    this.filterCallback = onFilterChanged;
  }

  /**
   * Updates the component with new data. Lazy-attaches the React child
   * to the host element on first real render. Has no effect without a
   * main component.
   */
  protected updateReactContainers = (data: any): void => {
    if (!this.mainComponent) return;
    if (!this.reactTarget.parentElement) {
      this.hostElement.appendChild(this.reactTarget);
    }
    if (!this.root) {
      this.root = createRoot(this.reactTarget);
    }
    flushSync(() => {
      this.root!.render(
        React.createElement(ReactContainer, {
          component: this.mainComponent,
          data,
          onFilterChanged: this.filterCallback,
        }),
      );
    });
  };

  /**
   * Tears down the React root AND detaches our child element from the
   * host, so Power BI can render its default landing page into the
   * cleared container.
   */
  protected reactUnmount(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.reactTarget.parentElement) {
      this.reactTarget.parentElement.removeChild(this.reactTarget);
    }
  }
}
