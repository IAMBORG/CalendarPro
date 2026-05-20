import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/RemoveCircle";
import RngeTooltip from "./rngetooltip";
import { getIntervalFunction } from "../dateutils";
import { Interval, subDays, format, startOfDay, endOfDay } from "date-fns";
import { useLocalization } from "../localeutils";
import { dateRange } from "../interface";

type EditableInterval = {
  start: Date | null;
  end: Date | null;
};

interface IntervalParmsProps {
  intervalValue: number;
  item: any;
  interval: EditableInterval;
  setIntervalValue: React.Dispatch<React.SetStateAction<number>>;
  handleClose: () => void;
  localization?: any; // Optional localization prop
}

const IntervalParms: React.FC<IntervalParmsProps> = ({
  intervalValue,
  item,
  setIntervalValue,
  handleClose,
  interval,
  localization = useLocalization(), // Default to useLocalization if not provided
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setIntervalValue(isNaN(value) ? 0 : value);
  };

  return (
    <Grid container spacing={1} direction="row">
      <Grid>
        <IconButton
          size="small"
          onClick={() => setIntervalValue((prev) => (prev || 0) - 1)}
        >
          <RemoveIcon style={{ fontSize: "0.6rem" }} color="primary" />
        </IconButton>
      </Grid>
      <Grid>
        <RngeTooltip
          placement="left-start"
          detailRow={useLocalization().getDisplayName("dateIntervalExtend")}
          // title={`Add ${stepValue}s from today`}
          infoRow={`${useLocalization().getDisplayName("dateIntervalToday")} ${item.plural}.`}
        >
          <TextField
            helperText={
              interval.start && interval.end
                ? `${format(interval.start, "yy-MM-dd")} | ${format(
                    interval.end,
                    "yy-MM-dd",
                  )}`
                : `${useLocalization().getDisplayName("dateIntervalToday")} ${item.plural}.`
            }
            slotProps={{
              formHelperText: {
                sx: {
                  margin: "1px",
                  fontSize: "0.4rem",
                  lineHeight: 1.0,
                  padding: "0px 0px",
                  color: "text.secondary",
                  display: "flex",
                  justifyContent: "center",
                },
              },
            }}
            variant="standard"
            size="small"
            sx={{
              // Target the internal input element to remove the spinner arrows.
              // This uses a CSS selector within the sx prop.
              "& input[type=number]": {
                MozAppearance: "textfield",
                textAlign: "center",
              },
              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              fontSize: "0.4rem",
              width: "3.8rem",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              "& .MuiInputBase-input": {
                textAlign: "center",
                padding: "2px 2px",
              },
            }}
            type="number"
            onChange={handleInputChange}
            value={intervalValue}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleClose();
                ev.preventDefault();
              }
            }}
          />
        </RngeTooltip>
      </Grid>
      <Grid>
        <IconButton
          size="small"
          onClick={() => setIntervalValue((prev) => (prev || 0) + 1)}
        >
          <AddIcon style={{ fontSize: "0.6rem" }} color="primary" />
        </IconButton>
      </Grid>
      <Grid>
        <RngeTooltip title="Save & Close" placement="right">
          <IconButton size="small" onClick={handleClose}>
            <CheckIcon fontSize="small" color="primary" />
          </IconButton>
        </RngeTooltip>
      </Grid>
    </Grid>
  );
};

type ClickType = "left" | "right";

interface DateIntervalPickerProps {
  children: React.ReactNode;
  baseDate?: Date;
  item: any;
  handleVal?: (interval: dateRange) => void;
  clickType?: ClickType;
  localization?: any; // Optional localization prop
}

const DateIntervalPicker: React.FC<DateIntervalPickerProps> = ({
  children,
  baseDate,
  item,
  handleVal,
  clickType = "right",
  localization = useLocalization(), // Default to useLocalization if not provided
}) => {
  // FIX: Use useState to ensure baseDate is stable and only created once
  const [currentBaseDate] = useState(baseDate || new Date());
  const [intervalValue, setIntervalValue] = useState<number>(0);
  const [interval, setInterval] = useState<EditableInterval>({
    start: currentBaseDate,
    end: null,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const isCorrectClick =
      (clickType === "right" && event.button === 2) ||
      (clickType === "left" && event.button === 0);

    if (!isCorrectClick) return;
    if (clickType === "right") event.preventDefault();

    setAnchorEl(event.currentTarget);
    setIsEditing(true);
  };

  useEffect(() => {
    if (!isEditing || intervalValue === 0) {
      setInterval({ start: null, end: null });
      return;
    }
    const intervalFn = getIntervalFunction(item.step);
    if (!intervalFn) {
      setInterval({ start: null, end: null });
      return;
    }
    const newDate = subDays(
      intervalFn(currentBaseDate, intervalValue),
      item.step === "day" ? 0 : intervalValue < 0 ? -1 : 1,
    );

    setInterval({
      start: startOfDay(intervalValue >= 0 ? currentBaseDate : newDate),
      end: endOfDay(intervalValue < 0 ? currentBaseDate : newDate),
    });
  }, [intervalValue, item.step, isEditing, currentBaseDate]);

  const handleClose = () => {
    setIsEditing(false);
    setAnchorEl(null);

    // The state "leak" is fixed here. intervalValue is reset on close.
    // Also, added the check to prevent an infinite loop in the parent.
    if (intervalValue === 0) {
      setIntervalValue(0); // Resetting the value to 0
      return;
    }

    if (handleVal) {
      if (interval.start && interval.end) {
        handleVal({ start: interval.start, end: interval.end });
      }
    }

    // Reset value after passing to parent to avoid state "leak"
    setIntervalValue(0);
  };

  return (
    <>
      <Popover
        open={isEditing}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 1000 }}
        slotProps={{
          paper: {
            sx: {
              p: 0.1,
              display: "flex",
              alignItems: "center",
              overflowY: "hidden",
              maxHeight: "100px",
            },
          },
          ...{
            name: "offset",
            options: { offset: [0, -30] },
          },
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            <IntervalParms
              intervalValue={intervalValue}
              item={item}
              setIntervalValue={setIntervalValue}
              handleClose={handleClose}
              interval={interval}
              localization={localization}
            />
          </div>
        </ClickAwayListener>
      </Popover>
      <div onClick={handleClick}>
        {children}
      </div>
    </>
  );
};

export default DateIntervalPicker;
