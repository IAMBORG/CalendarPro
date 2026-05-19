import * as React from "react";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import DateMove from "./datemove";
import DateRange from "./daterange";
import StepsMenu from "./stepsmenu";
import StepToggle from "./steptoggle";
import { dateCardProps } from "../interface";

function DateInput(props: dateCardProps) {
  // Destructure props for a clear overview and to avoid prop-drilling
  const {
    showMove,
    stepOpen,
    openSlider,
    handleClick,
    handleVal,
    dates,
    stepValue,
    localization,
    showExpand,
    ...otherProps
  } = props;

  return (
    <>
      <Grid  sx={{ paddingRight: 1 }}>
        {/* Pass the dates prop explicitly to the DateRange component */}
        <DateRange dates={dates} localization={localization} handleVal={handleVal} {...otherProps} />
      </Grid>

      {/* Conditionally render the entire movement section */}
      {showMove && (
        <Grid container>
          {/* Backwards movement button */}
          <Grow in={showMove}>
            <Grid >
              <DateMove
                dates={dates}
                stepValue={stepValue}
                handleVal={handleVal}
                bf="b"
                vertical={false}
                reverse={true}
                showExpand={showExpand}
                localization={localization} // Pass localization prop
              />
            </Grid>
          </Grow>

          {/* Toggle for the steps menu */}
          <Grid  sx={{ paddingRight: 1 }}>
            <StepToggle
              stepValue={stepValue}
              handleClick={handleClick}
              localization={localization}
              {...otherProps}
            />
          </Grid>

          {/* Steps menu */}
          <Grow in={stepOpen}>
            <Grid >
              <StepsMenu
                stepValue={stepValue}
                localization={localization}
                viz={stepOpen}
                {...otherProps}
              />
            </Grid>
          </Grow>

          {/* Forward movement button, controlled by the openSlider prop */}
          {/* <Grow in={openSlider}> */}
            <Grid >
              <DateMove
                dates={dates}
                stepValue={stepValue}
                handleVal={handleVal}
                bf="f"
                vertical={false}
                reverse={false}
                showExpand={showExpand}
                localization={localization} // Pass localization prop
              />
            </Grid>
          {/* </Grow> */}
        </Grid>
      )}
    </>
  );
}

export default DateInput;
