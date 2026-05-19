import { Settings, dateCardProps } from "./interface";
import { startOfToday, format } from "date-fns";

export const defaultSettings = {
  general: {
    landingOff: false,
    rangeScope: { start: null, end: null },
  },
  styleSettings: {
    fmtDate: "d-MM-yyyy",
    themeColor: "#607d8b",
    themeMode: "light",
    themeFont: "Segoe UI",
    fontFamily: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif',
    fontSize: 10,
    fontBold: false,
    fontUnderline: false,
    fontItalic: false,
    fontColor: "#000000",
  },
  calendarSettings: {
    singleDay: false,
    startRange: "sync",
    stepInit: "day",
    payLength: 14,
    fmtDate: "EEE, d MMM yy",
    limitToScope: false,
    forceStartRange: false,
  },
  layoutSettings: {
    timelineSettings: {
      enableSlider: true,
      showSlider: false,
      show2ndSlider: true,
    },
    currentSettings: {
      showCurrent: true,
      showIconText: false,
      showMore: false,
    },
    moveSettings: {
      showMove: true,
      showExpand: true,
    },
    displaySettings: {
      contentAlignment: "left",
    },
    helpSettings: {
      showHelpIcon: false,
      showTooltip: true,
      showExtendedTooltip: false,
    },
  },
  period: {
    daySettings: {
      showDay: true,
      fmtDay: "d-MMM",
      daySkip: 0,
    },
    weekSettings: {
      showWeek: true,
      weekStartDay: 1,
      weekSkip: 4,
      fmtWeek: "w",
    },
    paySettings: {
      payCustomLabel: "Pay Period", // ← Added text input here: "Pay Period",
      showPay: false,
      paySkip: 4,
      payLength: 14,
      fmtPay: "d-MMM",
      payRefDay: new Date().getDate(),
      payRefYear: new Date().getFullYear(),
      payRefMonth: new Date().getMonth(),
      payRefDate: format(startOfToday(), "yyyy-MM-dd"),
    },
    monthSettings: {
      showMonth: true,
      monthSkip: 1,
      fmtMonth: "MMMMM",
    },
    quarterSettings: {
      showQuarter: false,
      fmtQuarter: "QQQ",
      quarterSkip: 1,
    },
    yearSettings: {
      showYear: true,
      fmtYear: "yyyy",
      yearStartMonth: 0,
      yearSkip: 1,
    },
  },
} satisfies Settings;

const { general, period, calendarSettings, styleSettings, layoutSettings } =
  defaultSettings;

const {
  daySettings,
  weekSettings,
  paySettings,
  monthSettings,
  quarterSettings,
  yearSettings,
} = period;

export const initialState: dateCardProps = {
  landingOff: general.landingOff,
  rangeScope: general.rangeScope as unknown as dateCardProps["rangeScope"],
  weekStartDay: weekSettings.weekStartDay, // 0 = Sun
  yearStartMonth: yearSettings.yearStartMonth, // 0 = Jan
  stepInit: calendarSettings.stepInit,
  stepSkip: {
    day: daySettings.daySkip,
    week: weekSettings.weekSkip,
    pay: paySettings.paySkip,
    month: monthSettings.monthSkip,
    quarter: quarterSettings.quarterSkip,
    year: yearSettings.yearSkip,
  },
  stepViz: {
    day: daySettings.showDay,
    week: weekSettings.showWeek,
    pay: paySettings.showPay,
    month: monthSettings.showMonth,
    quarter: quarterSettings.showQuarter,
    year: yearSettings.showYear,
  },
  stepFmt: {
    day: daySettings.fmtDay,
    week: weekSettings.fmtWeek,
    pay: paySettings.fmtPay,
    month: monthSettings.fmtMonth,
    quarter: quarterSettings.fmtQuarter,
    year: yearSettings.fmtYear,
  },
  payProps: {
    desc: paySettings.payCustomLabel,
    ref: new Date(
      paySettings.payRefYear,
      paySettings.payRefMonth,
      paySettings.payRefDay,
    ),
    len: paySettings.payLength,
  },
  themeColor: styleSettings.themeColor,
  themeFont: styleSettings.themeFont,
  themeMode: styleSettings.themeMode,
  fontSize: styleSettings.fontSize,
  showCurrent: layoutSettings.currentSettings.showCurrent,
  showHelpIcon: layoutSettings.helpSettings.showHelpIcon,
  showMore: layoutSettings.currentSettings.showMore,
  showIconText: layoutSettings.currentSettings.showIconText,
  singleDay: calendarSettings.singleDay,
  enableSlider: layoutSettings.timelineSettings.enableSlider,
  showSlider: layoutSettings.timelineSettings.showSlider,
  show2ndSlider: layoutSettings.timelineSettings.show2ndSlider,
  showMove: layoutSettings.moveSettings.showMove,
  showExpand: layoutSettings.moveSettings.showExpand,
};
