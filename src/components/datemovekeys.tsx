import { getRange } from "../dateutils";
import { useHotkeys } from "react-hotkeys-hook";
import { debounce } from "lodash";
import type { dateRange } from "../interface";
import { parseJSON } from "date-fns";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to handle hotkeys for date range navigation.
 * This version separates the immediate UI update from the debounced filter
 * application by managing a local state within the hook itself.
 *
 * @param {function} applyFilterFn - The function to apply the filter to the Power BI host.
 * @param {string} stepValue - The current step value (day, week, month, etc.).
 * @param {dateRange} externalDates - The current date range from the parent component's props.
 * @param {any} current - The current period details.
 * @param {number} debounceTime - The debounce time in milliseconds.
 */
export function useDateMoveKeys(
  applyFilterFn: (result: Date[]) => void,
  stepValue: string,
  externalDates: dateRange,
  current: any,
  debounceTime = 500
) {
  // Use local state to manage the dates for the UI during a rapid key press.
  const [internalDates, setInternalDates] = useState(externalDates);

  // Synchronize the internal state with the external dates. This ensures that
  // when the debounced filter is finally applied and new props are received,
  // the internal state updates to reflect the latest values.
  useEffect(() => {
    setInternalDates(externalDates);
  }, [externalDates]);

  // Debounced function that actually applies the filter.
  // Use useRef to create a stable reference to avoid recreating the debounced function.
  const debouncedApplyFilterRef = useRef(
    debounce((newDates: dateRange) => {
      applyFilterFn([newDates.start, newDates.end]);
    }, debounceTime, { leading: false, trailing: true })
  );

  // Clean up the debounced function on unmount
  useEffect(() => {
    return () => {
      if (debouncedApplyFilterRef.current) {
        debouncedApplyFilterRef.current.cancel();
      }
    };
  }, []);

  // Memoize updateDates to prevent unnecessary re-renders
  const updateDates = useCallback((direction: string) => {
    // Calculate the new date range based on the direction.
    const newDatesArr = getRange(direction, stepValue, internalDates);
    const start = parseJSON(newDatesArr[0].toString()).toString() !== "Invalid Date"
      ? parseJSON(newDatesArr[0].toString())
      : newDatesArr[0];
    const end = parseJSON(newDatesArr[1].toString()).toString() !== "Invalid Date"
      ? parseJSON(newDatesArr[1].toString())
      : newDatesArr[1];

    // Update the local state for a snappy UI experience.
    const newDates = { start, end };
    setInternalDates(newDates);

    // Call the debounced function with the new dates.
    debouncedApplyFilterRef.current(newDates);
  }, [stepValue, internalDates]);

  useHotkeys(["n", "right"], () => updateDates("f"), { enabled: true });
  useHotkeys(["left", "l"], () => updateDates("b"), { enabled: true });
  useHotkeys("ctrl+right", () => updateDates("ef"), { enabled: true });
  useHotkeys("ctrl+left", () => updateDates("eb"), { enabled: true });
  useHotkeys("shift+right", () => updateDates("rf"), { enabled: true });
  useHotkeys("shift+left", () => updateDates("rb"), { enabled: true });

  useHotkeys("t", () => {
    const thisRange = current
      .filter((item: any) => item.step === stepValue)
      .map((item: any) => item.thisRange)[0];

    // Update the local state immediately.
    setInternalDates(thisRange);

    // Immediately apply the filter, as this is a single, non-repeated action.
    applyFilterFn([thisRange.start, thisRange.end]);
  }, { enabled: true });
}
