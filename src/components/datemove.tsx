import * as React from "react";
import { useMemo, useEffect, useState, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { debounce } from "lodash";
import { useHotkeys } from "react-hotkeys-hook";
import { getRange } from "../dateutils";
import { dateMoveProps } from "../interface";
import RngeTooltip from "./rngetooltip";
import { getMoveParms } from "../dateutils"; // Assuming arrowIcons is from a utility file

export default function DateMove(props: dateMoveProps) {
  // Destructure props with safe defaults for optional props
  const {
    dates,
    stepValue = "day",
    bf = "f",
    vertical = false,
    reverse,
    handleVal,
    showExpand,
    localization,
  } = props;

  // State to track if the shift key is held down
  const [ctrl, setCtrl] = useState(false);

  // Use useMemo to ensure moveParms is only re-calculated when its dependencies change
  const mve = useMemo(
    () => getMoveParms(bf, vertical, ctrl, stepValue, localization),
    [bf, vertical, ctrl, stepValue, localization],
  );

  // Use useRef to create a stable reference to the debounced function.
  // This prevents the debounce timer from resetting on every re-render.
  const debouncedHandleValRef = useRef(
    debounce((dt) => handleVal?.(dt), 500, { leading: false, trailing: true }),
  );

  // Clean up the debounced function on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (debouncedHandleValRef.current) {
        debouncedHandleValRef.current.cancel();
      }
    };
  }, []);

  const handleClick = (fn: string) => {
    if (!handleVal || !dates) return;
    const newDates = getRange(fn, stepValue, dates);
    // Call the debounced function through the stable ref
    debouncedHandleValRef.current(newDates);
  };

  const handleExt = () => {
    // The `e` parameter isn't needed here as we use hotkeys to manage `ctrl`
    const _ctl = ctrl; // Use the state variable directly
    const _bf = _ctl ? (mve.isBack ? "f" : "b") : bf;
    const fn = _ctl ? "r" + _bf : "e" + _bf;
    handleClick(fn);
  };

  // Attach hotkey listeners. The empty dependency array ensures these listeners are
  // only set up once, preventing the "repeating" issue.
  useHotkeys("shift", () => setCtrl(true), { keydown: true }, []);
  useHotkeys("shift", () => setCtrl(false), { keyup: true }, []);

  const gridDirection = (reverse
    ? "row-reverse"
    : vertical
      ? "column"
      : "row") as "row";
  // Cast widens MUI's strict ResponsiveStyleValue<GridDirection> requirement.

  return (
    <Grid container direction={gridDirection}>
      <Box>
        <RngeTooltip
          title={undefined}
          topRow={mve.topRow1}
          detailRow={mve.detailRow1}
          placement={mve.placement}
        >
          <IconButton
            key={mve.iconLabel + reverse + vertical + stepValue}
            aria-label={mve.iconLabel + " a " + stepValue}
            size="small"
            onClick={() => handleClick(bf)}
          >
            {mve.iconT}
          </IconButton>
        </RngeTooltip>
      </Box>
      {showExpand && (
        <Box>
          <RngeTooltip
            title={undefined}
            topRow={mve.topRow2}
            detailRow={mve.detailRow2}
            placement={mve.placement}
          >
            <IconButton
              key={mve.placement + reverse + vertical + stepValue}
              id="eb"
              aria-label={mve.placement + " a " + stepValue}
              size="small"
              onClick={handleExt}
            >
              {mve.iconB}
            </IconButton>
          </RngeTooltip>
        </Box>
      )}
    </Grid>
  );
}
