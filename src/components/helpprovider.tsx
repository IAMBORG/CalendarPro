import React, { useState, useContext, useMemo, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Chat from "@mui/icons-material/Chat";
import ChatBubbleOutlineOutlined from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "@mui/material/styles";
import RngeTooltip from "./rngetooltip";

type HelpContextState = {
  showHelpIcon: boolean;
  showTooltip: boolean;
  showExtendedTooltip: boolean;
  toggleHelp: () => void;
  setShowHelpIcon: (val: boolean) => void;
  setShowTooltip: (val: boolean) => void;
  setShowExtendedTooltip: (val: boolean) => void;
  setTooltipEnabled: (enabled: boolean) => void;
};

type HelpProviderProps = {
  children: React.ReactNode;
  showHelpIcon?: boolean;
  showTooltip?: boolean;
  showExtendedTooltip?: boolean;
  localization: { getDisplayName: (key: string) => string };
  themeMode?: "light" | "dark" | string;
};

// A single context to provide help-related state and functions.
const HelpContext = React.createContext<HelpContextState>({
  showHelpIcon: false,
  showTooltip: true,
  showExtendedTooltip: false,
  toggleHelp: () => {},
  setShowHelpIcon: (_: boolean) => {},
  setShowTooltip: (_: boolean) => {},
  setShowExtendedTooltip: (_: boolean) => {},
  setTooltipEnabled: (enabled: boolean) => {},
});

export const useHelpContext = () => useContext(HelpContext);

export const HelpProvider = ({
  children,
  showHelpIcon,
  showTooltip,
  showExtendedTooltip,
  localization,
  themeMode, // Added themeMode prop
}: HelpProviderProps) => {
  const theme = useTheme();

  // Consolidate state management into a single useState hook.
  const [helpState, setHelpState] = useState({
    helpIcon: showHelpIcon ?? false,
    tooltip: showTooltip ?? true,
    extendedTooltip: showExtendedTooltip ?? false,
  });

  // Use a single useEffect hook to synchronize with props.
  useEffect(() => {
    setHelpState({
      helpIcon: showHelpIcon ?? false,
      tooltip: showTooltip ?? true,
      extendedTooltip: showExtendedTooltip ?? false,
    });
  }, [showHelpIcon, showTooltip, showExtendedTooltip]);

  // Memoize localization strings to prevent re-creation on every render.
  const { TopRowInfo, DetailRowInfo, TopRowHelp, DetailRowHelp } = useMemo(
    () => ({
      TopRowInfo: localization.getDisplayName("helpProviderTopRowInfo"),
      DetailRowInfo: localization.getDisplayName("helpProviderDetailRowInfo"),
      TopRowHelp: localization.getDisplayName("helpProviderTopRowHelp"),
      DetailRowHelp: localization.getDisplayName("helpProviderDetailRowHelp"),
    }),
    [localization],
  );

  // Use a useCallback hook to memoize the toggle function.
  const toggleHelp = () =>
    setHelpState((prev) => ({
      ...prev,
      extendedTooltip: !prev.extendedTooltip,
    }));

  // Attach hotkey listeners.
  useHotkeys("escape", () =>
    setHelpState((prev) => ({ ...prev, helpIcon: false })),
  );
  useHotkeys("h", toggleHelp, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  const value = useMemo(
    () => ({
      showHelpIcon: helpState.helpIcon,
      showTooltip: helpState.tooltip,
      showExtendedTooltip: helpState.extendedTooltip,
      toggleHelp,
      setShowHelpIcon: (val: boolean) =>
        setHelpState((prev) => ({ ...prev, helpIcon: val })),
      setShowTooltip: (val: boolean) =>
        setHelpState((prev) => ({ ...prev, tooltip: val })),
      setShowExtendedTooltip: (val: boolean) =>
        setHelpState((prev) => ({ ...prev, extendedTooltip: val })),
      setTooltipEnabled: (enabled: boolean) =>
        setHelpState((prev) => ({ ...prev, tooltip: enabled })),
    }),
    [helpState, toggleHelp],
  );

  const tooltipBackgroundColor = helpState.extendedTooltip
    ? theme.palette.secondary[themeMode === "dark" ? "light" : "dark"]
    : theme.palette.primary[themeMode === "dark" ? "light" : "dark"];

  return (
    <HelpContext.Provider value={value}>
      {helpState.helpIcon && helpState.tooltip && (
        <RngeTooltip
          title={helpState.extendedTooltip ? TopRowInfo : DetailRowHelp}
          detailRow={helpState.extendedTooltip ? DetailRowInfo : DetailRowHelp}
          disableTooltip={!helpState.tooltip}
        >
          <IconButton
            size="small"
            sx={{ position: "absolute", right: 0, top: 0, margin: 0.2 }}
            color={helpState.extendedTooltip ? "secondary" : "primary"}
            onClick={toggleHelp}
          >
            {helpState.extendedTooltip ? (
              <Chat style={{ fontSize: 8 }} />
            ) : (
              <ChatBubbleOutlineOutlined style={{ fontSize: 8 }} />
            )}
          </IconButton>
        </RngeTooltip>
      )}
      {children}
    </HelpContext.Provider>
  );
};
