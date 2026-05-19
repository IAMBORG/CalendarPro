import * as React from "react";
import Slider, { SliderValueLabelProps } from "@mui/material/Slider";
import Zoom from "@mui/material/Zoom";
import Grid from "@mui/material/Grid";

// The style objects are assumed to be imported from a separate file.
import { getBottomSliderStyles, getTopSliderStyles } from "./sliderstyles";
import RngeTooltip from "./rngetooltip";

/**
 * Custom value label component for the slider thumbs.
 * This component provides a tooltip with the value of the thumb.
 *
 * @param {SliderValueLabelProps & { granularity?: string; sliderId?: string }} props - The props from the Slider component, extended with granularity and sliderId.
 * @returns {React.ReactElement} A Tooltip-wrapped component.
 */
const ValueLabelComponent = React.memo(
  ({ children, value, index }: SliderValueLabelProps) => {
    // Determine the placement of the tooltip based on the thumb index.
    const loc = index === 0 ? "top-end" : "top-start";
    return (
      <RngeTooltip
        enterTouchDelay={10}
        placement={loc}
        topRow={String(value)}
        detailRow={index === 0 ? "▶▶▶▶▶" : "◀◀◀◀◀"}
        enterDelay={1000}
        arrow
      >
        {children}
      </RngeTooltip>
    );
  },
);

ValueLabelComponent.displayName = "ValueLabelComponent";

interface DualSliderProps {
  value: number[];
  step: number | null;
  showBottomSlider: boolean;
  mainMarks: Array<{ value: number; label: string }>;
  superMarks: Array<{ value: number; label: string }>;
  max: number;
  valueLabelFormat: (value: number) => string;
  handleTopCommit: (
    event: Event | React.SyntheticEvent,
    val: number | number[],
  ) => void;
  handleBottomCommit: (
    event: Event | React.SyntheticEvent,
    val: number | number[],
  ) => void;
  onChange: (
    event: Event | React.SyntheticEvent,
    value: number | number[],
    activeThumb?: number,
  ) => void;
  localization?: {
    getDisplayName: (key: string) => string;
  };
}

function DualSlider(props: DualSliderProps): React.ReactElement {
  const {
    showBottomSlider,
    handleTopCommit,
    handleBottomCommit,
    mainMarks,
    superMarks,
    valueLabelFormat,
    localization, // Extract localization to prevent it from spreading to DOM
    // Extracting props meant for the top slider.
    value,
    step,
    max,
    onChange,
  } = props;

  // Use a common set of props for both sliders to reduce duplication.
  const commonSliderProps = {
    value,
    min: 0,
    max,
    onChange,
    valueLabelFormat,
    slots: { valueLabel: ValueLabelComponent },
  };

  return (
    <Grid container size={12}>
      {/* Top Slider (always visible) */}
      <Grid sx={{ height: "52px" }} size={12}>
        <Slider
          name="top"
          key="slider1"
          size="medium"
          step={step}
          color="primary"
          onChangeCommitted={handleTopCommit}
          valueLabelDisplay="auto"
          marks={mainMarks}
          sx={getTopSliderStyles}
          aria-labelledby="range-slider11"
          {...commonSliderProps}
        />
      </Grid>
      {/* Bottom Slider (conditionally rendered) */}
      <Zoom in={showBottomSlider}>
        <Grid sx={{ height: "55px" }} size={12}>
          <Slider
            name="bottom"
            key="slider2"
            size="small"
            color="primary"
            onChangeCommitted={handleBottomCommit}
            step={null}
            marks={superMarks}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider2"
            getAriaValueText={valueLabelFormat}
            sx={getBottomSliderStyles}
            {...commonSliderProps}
          />
        </Grid>
      </Zoom>
    </Grid>
  );
}

export default DualSlider;
