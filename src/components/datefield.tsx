import * as React from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import {
  textMeasurementService as tms,
  interfaces,
} from "powerbi-visuals-utils-formattingutils";
import { pixelConverter } from "powerbi-visuals-utils-typeutils";
import TextProperties = interfaces.TextProperties;

interface DateFieldProps {
  id: "start" | "end";
  value: string;
  max?: string;
  min?: string;
  error?: boolean;
  underline?: boolean;
  type?: string;
  width?: number;
  fontBold?: boolean;
  fontFamily?: string;
  fontColor?: string;
  fontItalic?: boolean;
  fontUnderline?: boolean;
  fontWeight?: string;
  InputFontSize?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  doUpdate: (id: "start" | "end", value: string) => void;
}

export const DateField: React.FC<DateFieldProps> = (props) => {
  const {
    id,
    value,
    doUpdate,
    underline,
    max,
    min = "date",
    error,
    type,
    width,
    fontBold,
    fontFamily,
    fontColor,
    fontItalic,
    fontUnderline,
    fontWeight,
    InputFontSize,
    onChange,
    onBlur,
    onFocus,
  } = props;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputElement = e.target as HTMLInputElement;
      if (inputElement && inputElement.value) {
        doUpdate(id, inputElement.value);
      }
    }
  };

  const theme = useTheme();
  const textProperties: TextProperties = {
    text: value,
    fontFamily: theme.typography.fontFamily ?? "Segoe UI",
    fontSize: pixelConverter.toString(theme.typography.fontSize),
  };

  return (
    <TextField
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      error={error}
      sx={{
        "& input[type='date']::-webkit-calendar-picker-indicator": {
          display: "initial !important",
        },
        input: {
          color: fontColor,
          fontWeight: fontBold
            ? theme.typography.fontWeightBold
            : theme.typography.fontWeightRegular,
          fontStyle: fontItalic ? "italic" : "normal",
        },
        paddingTop: "2px",
        width:
          tms.measureSvgTextWidth(textProperties) +
          theme.typography.fontSize * 3.25,
      }}
      type="date"
      variant="standard"
      size="small"
      placeholder={"yyyy-MM-dd"}
      onKeyDown={handleKeyPress}
      slotProps={{
        input: {
          disableUnderline: underline,
        },
        htmlInput: {
          max,
          min,
        },
      }}
    />
  );
};
