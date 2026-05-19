import * as React from "react";
import { useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RngeTooltip from "./rngetooltip";
import { ToggleSliderButtonProps } from "../interface";
import { useLocalization } from "../localeutils";

function ToggleSliderButton(props: ToggleSliderButtonProps) {
  const fallbackLocalization = useLocalization();

  const { openSlider, toggleSlider } = props;
  const localization = props.localization ?? fallbackLocalization;

  const {
    TopRowOpen,
    TopRowClosed,
    TopRowEnd,
    DetailRowOpen,
    DetailRowClosed,
  } = useMemo(
    () => ({
      TopRowOpen: localization.getDisplayName("toggleSliderButtonTopRowOpen"),
      TopRowClosed: localization.getDisplayName(
        "toggleSliderButtonTopRowClosed",
      ),
      TopRowEnd: localization.getDisplayName("toggleSliderButtonTopRowEnd"),
      DetailRowOpen: localization.getDisplayName(
        "toggleSliderButtonDetailRowOpen",
      ),
      DetailRowClosed: localization.getDisplayName(
        "toggleSliderButtonDetailRowClosed",
      ),
    }),
    [localization],
  );

  const topRow = (openSlider ? TopRowOpen : TopRowClosed) + TopRowEnd;
  const detailRow = openSlider ? DetailRowOpen : DetailRowClosed;

  return (
    <IconButton
      aria-label="Toggle Slider"
      onClick={toggleSlider}
      id="menuToggle"
      size="small"
    >
      <RngeTooltip
        title={undefined}
        topRow={topRow}
        detailRow={detailRow}
        placement="bottom"
      >
        <MoreVertIcon style={{ fontSize: "inherit" }} />
      </RngeTooltip>
    </IconButton>
  );
}

export default React.memo(ToggleSliderButton);
