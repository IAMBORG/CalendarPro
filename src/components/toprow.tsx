import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import DateInput from "./dateinput";
import UseCurrent from "./usecurrent";
import ToggleSliderButton from "./togglesliderbutton";
import { dateCardProps } from "../interface";

const TopRow: React.FC<dateCardProps> = ({
  enableSlider,
  openSlider = false,
  toggleSlider = () => undefined,
  dates,
  setStepValue = () => undefined,
  setStepOpen = () => undefined,
  stepOpen = false,
  localization,
  showExpand,
  contentAlignment,
  ...props
}) => {
  const justify =
    contentAlignment === "center"
      ? "center"
      : contentAlignment === "right"
        ? "flex-end"
        : "flex-start";
  const showFiller = contentAlignment === undefined || contentAlignment === "left";
  return (
    <Grid
      container
      direction="row"
      rowSpacing={0.3}
      // Removed the size={12} prop from the container, as it's not a valid prop for the Grid container.
      sx={{
        paddingLeft: 0.3,
        justifyContent: justify,
      }}
    >
      {/* Use a fragment for conditionally rendering the slider button */}
      {enableSlider && (
        <Grid size="auto">
          <ToggleSliderButton
            openSlider={openSlider}
            toggleSlider={toggleSlider}
            localization={localization}
          />
        </Grid>
      )}

      {/* Optimized DateInput prop passing */}
      <DateInput
        {...props}
        dates={dates}
        openSlider={openSlider}
        handleStep={setStepValue}
        handleViz={setStepOpen}
        stepOpen={stepOpen}
        localization={localization}
        showExpand={showExpand}
      />

      {/* Use Grid item for the UseCurrent component */}
      <Grid size="auto">
        {/* Simplified conditional rendering with a single boolean check */}
        {!stepOpen && (
          <Grow
            in={!stepOpen}
            style={{ transformOrigin: "0 0 0" }}
            timeout={stepOpen ? 1000 : 0} // Optimized timeout prop for the Grow component
          >
            <Box>
              <UseCurrent
                {...props}
                handleStep={setStepValue}
                localization={localization}
              />
            </Box>
          </Grow>
        )}
      </Grid>
      {/* Filler Grid item: only render when left-aligned, so it pushes content left.
          When centering or right-aligning, omitting the filler lets justifyContent work. */}
      {showFiller && (
        <Grid size="grow">
          <Box />
        </Grid>
      )}
    </Grid>
  );
};

export default TopRow;
