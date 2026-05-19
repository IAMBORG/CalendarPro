import { createTheme } from "@mui/material/styles";

export function SetTheme({
  themeMode,
  themeColor,
  themeFont,
  fontSize,
  fontColor,
}: {
  themeMode: "light" | "dark";
  themeColor: string;
  themeFont: string;
  fontSize: string;
  fontColor?: string;
}) {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeColor,
      },
      text: { primary: fontColor },
    },
    typography: {
      fontFamily: themeFont,
      fontSize: parseInt(fontSize, 10),
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.paper,
            maxWidth: 250,
            fontSize: theme.typography.pxToRem(11),
            padding: theme.spacing(0.75, 1),
          }),
          arrow: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
        defaultProps: {
          arrow: true,
          enterTouchDelay: 0,
        },
      },
      MuiBadge: {
        styleOverrides: {
          // Name of the slot
          badge: {
            // Some CSS
            // fontSize: ".5rem",
            textTransform: "uppercase",
          },
        },
      },
      // Add more component overrides here as needed
    },
  });
}
