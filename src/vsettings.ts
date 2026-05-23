/*
 *  Power BI Visualization Settings
 *  Calendar Pro
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsCompositeCard = formattingSettings.CompositeCard;
import FormattingSettingsGroup = formattingSettings.Group;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

import { defaultSettings } from "./initstate";

export class VisualSettingsModel extends FormattingSettingsModel {
  // Building visual formatting settings card
  styleSettings = new styleSettings();
  calendarSettings = new calendarSettings();
  layoutSettings = new layoutSettings();
  periodSettings = new PeriodSettings();

  // Add formatting settings card to cards list in model
  cards: Array<FormattingSettingsCard> = [
    this.styleSettings,
    this.calendarSettings,
    this.layoutSettings,
    this.periodSettings,
  ];
}

class styleSettings extends FormattingSettingsCard {
  name: string = "style";
  displayNameKey = "style_displayName";
  descriptionKey = "style_description";
  analyticsPane: boolean = false;
  uid: string = "styleUid";

  // Slices
  themeFont = new formattingSettings.FontPicker({
    name: "themeFont",
    descriptionKey: "style_themeFont_description",
    displayNameKey: "style_themeFont_displayName",
    value: defaultSettings.styleSettings.themeFont,
  });
  fontFamily = new formattingSettings.FontPicker({
    name: "fontFamily",
    descriptionKey: "style_fontFamily_description",
    displayNameKey: "style_fontFamily_displayName",
    value: defaultSettings.styleSettings.fontFamily,
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    descriptionKey: "style_fontSize_description",
    displayNameKey: "style_fontSize_displayName",
    value: defaultSettings.styleSettings.fontSize,
  });
  fontItalic = new formattingSettings.ToggleSwitch({
    name: "fontItalic",
    descriptionKey: "style_fontItalic_description",
    displayNameKey: "style_fontItalic_displayName",
    value: defaultSettings.styleSettings.fontItalic,
  });
  fontBold = new formattingSettings.ToggleSwitch({
    name: "fontBold",
    descriptionKey: "style_fontBold_description",
    displayNameKey: "style_fontBold_displayName",
    value: defaultSettings.styleSettings.fontBold,
  });
  fontUnderline = new formattingSettings.ToggleSwitch({
    name: "fontUnderline",
    descriptionKey: "style_fontUnderline_description",
    displayNameKey: "style_fontUnderline_displayName",
    value: defaultSettings.styleSettings.fontUnderline,
  });
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    value: { value: defaultSettings.styleSettings.fontColor },
  });
  themeMode = new formattingSettings.AutoDropdown({
    name: "themeMode",
    descriptionKey: "style_themeMode_description",
    displayNameKey: "style_themeMode_displayName",
    value: defaultSettings.styleSettings.themeMode,
  });
  themeColor = new formattingSettings.ColorPicker({
    name: "themeColor",
    displayNameKey: "style_themeColor_displayName",
    descriptionKey: "style_themeColor_description",
    value: { value: defaultSettings.styleSettings.themeColor },
  });

  // not implemented
  fmtDate = new formattingSettings.AutoDropdown({
    name: "fmtDate",
    descriptionKey: "style_fmtDate_description",
    displayNameKey: "style_fmtDate_displayName",
    value: defaultSettings.styleSettings.fmtDate,
  });

  public font: formattingSettings.FontControl =
    new formattingSettings.FontControl({
      name: "font", // must be unique within the same object
      displayNameKey: "style_font_displayName",
      descriptionKey: "style_font_description",
      fontFamily: this.themeFont,
      fontSize: this.fontSize,
      bold: this.fontBold, //optional
      italic: this.fontItalic, //optional
    });

  slices: Array<FormattingSettingsSlice> = [
    this.font,
    this.fontColor,
    this.themeColor,
    this.themeMode,
  ];
}

class calendarSettings extends FormattingSettingsCard {
  name: string = "calendar";
  descriptionKey = "calendar_description";
  displayNameKey = "calendar_displayName";
  analyticsPane: boolean = false;
  uid: string = "calendarUid";

  startRange = new formattingSettings.AutoDropdown({
    name: "startRange",
    descriptionKey: "calendar_startRange_description",
    displayNameKey: "calendar_startRange_displayName",
    value: defaultSettings.calendarSettings.startRange,
  });
  // Slices
  stepInit = new formattingSettings.AutoDropdown({
    name: "stepInit",
    descriptionKey: "calendar_stepInit_description",
    displayNameKey: "calendar_stepInit_displayName",
    value: defaultSettings.calendarSettings.stepInit,
  });

  singleDay = new formattingSettings.ToggleSwitch({
    name: "singleDay",
    descriptionKey: "calendar_singleDay_description",
    displayNameKey: "calendar_singleDay_displayName",
    value: defaultSettings.calendarSettings.singleDay,
  });

  limitToScope = new formattingSettings.ToggleSwitch({
    name: "limitToScope",
    descriptionKey: "calendar_limitToScope_description",
    displayNameKey: "calendar_limitToScope_displayName",
    value: defaultSettings.calendarSettings.limitToScope,
  });

  forceStartRange = new formattingSettings.ToggleSwitch({
    name: "forceStartRange",
    descriptionKey: "calendar_forceStartRange_description",
    displayNameKey: "calendar_forceStartRange_displayName",
    value: defaultSettings.calendarSettings.forceStartRange,
  });

  slices: Array<FormattingSettingsSlice> = [
    this.singleDay,
    this.limitToScope,
    this.startRange,
    this.forceStartRange,
    this.stepInit,
  ];
}

class timelineSettings extends FormattingSettingsGroup {
  enableSlider = new formattingSettings.ToggleSwitch({
    name: "enableSlider",
    descriptionKey: "timeline_enableSlider_description",
    displayNameKey: "timeline_enableSlider_displayName",
    value: defaultSettings.layoutSettings.timelineSettings.enableSlider,
  });

  showSlider = new formattingSettings.ToggleSwitch({
    name: "showSlider",
    descriptionKey: "timeline_showSlider_description",
    displayNameKey: "timeline_showSlider_displayName",
    value: defaultSettings.layoutSettings.timelineSettings.showSlider,
  });

  show2ndSlider = new formattingSettings.ToggleSwitch({
    name: "show2ndSlider",
    descriptionKey: "timeline_show2ndSlider_description",
    displayNameKey: "timeline_show2ndSlider_displayName",
    value: defaultSettings.layoutSettings.timelineSettings.show2ndSlider,
  });

  name: string = "timeline";
  description: string = "Timeline controls to show or hide";
  displayNameKey = "timeline_displayName";
  descriptionKey = "timeline_description";
  analyticsPane: boolean = false;
  uid: string = "timelineUid";

  slices: Array<FormattingSettingsSlice> = [
    this.enableSlider,
    this.showSlider,
    this.show2ndSlider,
  ];
}
class currentSettings extends FormattingSettingsGroup {
  showCurrent = new formattingSettings.ToggleSwitch({
    name: "showCurrent",
    descriptionKey: "showCurrent_description",
    displayNameKey: "showCurrent_displayName",
    value: defaultSettings.layoutSettings.currentSettings.showCurrent,
  });

  showIconText = new formattingSettings.ToggleSwitch({
    name: "showIconText",
    descriptionKey: "current_showIconText_description",
    displayNameKey: "current_showIconText_displayName",
    displayName: "current_showIconText_displayName",
    value: defaultSettings.layoutSettings.currentSettings.showIconText,
  });

  showMore = new formattingSettings.ToggleSwitch({
    name: "showMore",
    descriptionKey: "current_showMore_description",
    displayNameKey: "current_showMore_displayName",
    value: defaultSettings.layoutSettings.currentSettings.showMore,
  });

  name: string = "current";
  descriptionKey = "current_description";
  displayNameKey = "current_displayName";
  analyticsPane: boolean = false;
  uid: string = "currentUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showCurrent;

  slices: Array<FormattingSettingsSlice> = [this.showIconText, this.showMore];
}
class moveSettings extends FormattingSettingsGroup {
  showMove = new formattingSettings.ToggleSwitch({
    name: "showMove",
    descriptionKey: "move_showMove_description",
    displayNameKey: "move_showMove_displayName",
    value: defaultSettings.layoutSettings.moveSettings.showMove,
  });
  showExpand = new formattingSettings.ToggleSwitch({
    name: "showExpand",
    descriptionKey: "move_showExpand_description",
    displayNameKey: "move_showExpand_displayName",
    value: defaultSettings.layoutSettings.moveSettings.showExpand,
  });

  name: string = "move";
  descriptionKey = "move_description";
  displayNameKey = "move_displayName";
  analyticsPane: boolean = true;
  uid: string = "moveUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showMove;
  slices: Array<FormattingSettingsSlice> = [this.showExpand];
}

class helpSettings extends FormattingSettingsGroup {
  showHelpIcon = new formattingSettings.ToggleSwitch({
    name: "showHelpIcon",
    descriptionKey: "assist_showHelpIcon_description",
    displayNameKey: "assist_showHelpIcon_displayName",
    value: defaultSettings.layoutSettings.helpSettings.showHelpIcon,
  });
  showTooltip = new formattingSettings.ToggleSwitch({
    name: "showTooltip",
    displayNameKey: "assist_showToolTip_displayName",
    descriptionKey: "assist_showToolTip_description",
    value: defaultSettings.layoutSettings.helpSettings.showTooltip,
  });
  showExtendedTooltip = new formattingSettings.ToggleSwitch({
    name: "showExtendedTooltip",
    displayNameKey: "assist_showExtendedToolTip_displayName",
    descriptionKey: "assist_showExtendedToolTip_description",
    value: defaultSettings.layoutSettings.helpSettings.showExtendedTooltip,
  });

  name: string = "tooltip";
  descriptionKey = "assist_description";
  displayNameKey = "assist_displayName";
  uid: string = "tooltipUid";
  analyticsPane: boolean = true;
  visible: boolean = true;
  topLevelSlice: formattingSettings.SimpleSlice = this.showTooltip;
  slices: Array<FormattingSettingsSlice> = [
    this.showExtendedTooltip,
    this.showHelpIcon,
  ];
}

class displaySettings extends FormattingSettingsGroup {
  contentAlignment = new formattingSettings.AutoDropdown({
    name: "contentAlignment",
    displayNameKey: "display_contentAlignment_displayName",
    descriptionKey: "display_contentAlignment_description",
    value: defaultSettings.layoutSettings.displaySettings.contentAlignment,
  });

  name: string = "display";
  displayNameKey = "display_displayName";
  descriptionKey = "display_description";
  uid: string = "displayUid";
  analyticsPane: boolean = true;
  slices: Array<FormattingSettingsSlice> = [this.contentAlignment];
}

class layoutSettings extends FormattingSettingsCompositeCard {
  name: string = "layout";
  displayNameKey = "layout_displayName";
  descriptionKey = "layout_description";
  // Formatting settings slice
  analyticsPane: boolean = false;
  visible: boolean = true;

  layoutTimeline = new timelineSettings(Object());
  layoutMove = new moveSettings(Object());
  layoutCurrent = new currentSettings(Object());
  layoutHelp = new helpSettings(Object());
  layoutDisplay = new displaySettings(Object());
  groups: Array<FormattingSettingsGroup> = [
    this.layoutCurrent,
    this.layoutMove,
    this.layoutTimeline,
    this.layoutHelp,
    this.layoutDisplay,
  ];
}

class daySettings extends FormattingSettingsGroup {
  showDay = new formattingSettings.ToggleSwitch({
    name: "showDay",
    displayNameKey: undefined,
    value: defaultSettings.period.daySettings.showDay,
  });

  fmtDay = new formattingSettings.AutoDropdown({
    name: "fmtDay",
    displayNameKey: "fmtDay_displayName",
    descriptionKey: "fmtDay_description",
    value: defaultSettings.period.daySettings.fmtDay,
  });

  daySkip = new formattingSettings.NumUpDown({
    name: "daySkip",
    displayNameKey: "daySkip_displayName",
    descriptionKey: "daySkip_description",
    value: defaultSettings.period.daySettings.daySkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 365,
      },
    },
  });

  name: string = "day";
  descriptionKey = "day_description";
  displayNameKey = "day_displayName";
  analyticsPane: boolean = false;
  uid: string = "dayUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showDay;

  slices: Array<FormattingSettingsSlice> = [this.daySkip, this.fmtDay];
}

class weekSettings extends FormattingSettingsGroup {
  showWeek = new formattingSettings.ToggleSwitch({
    name: "showWeek",
    displayName: undefined,
    value: defaultSettings.period.weekSettings.showWeek,
  });

  fmtWeek = new formattingSettings.AutoDropdown({
    name: "fmtWeek",
    displayNameKey: "fmtWeek_displayName",
    descriptionKey: "fmtWeek_description",
    value: defaultSettings.period.weekSettings.fmtWeek,
  });

  weekSkip = new formattingSettings.NumUpDown({
    name: "weekSkip",
    displayNameKey: "weekSkip_displayName",
    descriptionKey: "weekSkip_description",
    value: defaultSettings.period.weekSettings.weekSkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 50,
      },
    },
  });

  weekStartDay = new formattingSettings.AutoDropdown({
    name: "weekStartDay",
    descriptionKey: "weekStartDay_description",
    displayNameKey: "weekStartDay_displayName",
    value: defaultSettings.period.weekSettings.weekStartDay,
  });

  name: string = "week";
  descriptionKey = "week_description";
  displayNameKey = "week_displayName";
  analyticsPane: boolean = false;
  uid: string = "weekUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showWeek;

  slices: Array<FormattingSettingsSlice> = [
    this.weekStartDay,
    this.weekSkip,
    this.fmtWeek,
  ];
}

class paySettings extends FormattingSettingsGroup {
  showPay = new formattingSettings.ToggleSwitch({
    name: "showPay",
    displayName: undefined,
    value: defaultSettings.period.paySettings.showPay,
  });

  fmtPay = new formattingSettings.AutoDropdown({
    name: "fmtPay",
    displayNameKey: "fmtPay_displayName",
    descriptionKey: "fmtPay_description",
    value: defaultSettings.period.paySettings.fmtPay,
  });

  paySkip = new formattingSettings.NumUpDown({
    name: "paySkip",
    descriptionKey: "paySkip_description",
    displayNameKey: "paySkip_displayName",
    value: defaultSettings.period.paySettings.paySkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 100,
      },
    },
  });

  payLength = new formattingSettings.NumUpDown({
    name: "payLength",
    descriptionKey: "payLength_description",
    displayNameKey: "payLength_displayName",
    value: defaultSettings.period.paySettings.payLength,
  });

  payRefDay = new formattingSettings.NumUpDown({
    name: "payRefDay",
    displayNameKey: "payRefDay_displayName",
    descriptionKey: "payRefDay_description",
    value: defaultSettings.period.paySettings.payRefDay,
  });

  payRefMonth = new formattingSettings.AutoDropdown({
    name: "payRefMonth",
    displayNameKey: "payRefMonth_displayName",
    descriptionKey: "payRefMonth_description",
    value: defaultSettings.period.paySettings.payRefMonth,
  });

  payRefYear = new formattingSettings.NumUpDown({
    name: "payRefYear",
    displayNameKey: "payRefYear_displayName",
    descriptionKey: "payRefYear_description",
    value: defaultSettings.period.paySettings.payRefYear,
  });

  // feature doesn't work
  payRefDate = new formattingSettings.DatePicker({
    placeholder: "Pay Period Reference Date",
    name: "payRefDate",
    displayNameKey: "payRefDate_displayName",
    descriptionKey: "payRefDate_description",
    value: new Date(),
  });

  payCustomLabel = new formattingSettings.TextInput({
    name: "payCustomLabel",
    displayNameKey: "payCustomLabel_displayName",
    descriptionKey: "payCustomLabel_description",
    placeholder: "Enter custom pay label",
    value: defaultSettings.period.paySettings.payCustomLabel,
  });

  name: string = "pay";
  description: string =
    "Show the Pay buttons on the Step Bar & Current Period Bar";
  displayNameKey = "pay_displayName";
  descriptionKey = "pay_description";
  analyticsPane: boolean = false;
  uid: string = "payUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showPay;

  slices: Array<FormattingSettingsSlice> = [
    this.payCustomLabel, // ← Added text input here
    this.paySkip,
    this.fmtPay,
    this.payLength,
    this.payRefDate,
  ];
}

class monthSettings extends FormattingSettingsGroup {
  showMonth = new formattingSettings.ToggleSwitch({
    name: "showMonth",
    displayNameKey: undefined,
    value: defaultSettings.period.monthSettings.showMonth,
  });

  fmtMonth = new formattingSettings.AutoDropdown({
    name: "fmtMonth",
    displayNameKey: "fmtMonth_displayName",
    descriptionKey: "fmtMonth_description",
    value: defaultSettings.period.monthSettings.fmtMonth,
  });

  monthSkip = new formattingSettings.NumUpDown({
    name: "monthSkip",
    displayNameKey: "monthSkip_displayName",
    descriptionKey: "monthSkip_description",
    value: defaultSettings.period.monthSettings.monthSkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 24,
      },
    },
  });

  name: string = "month";
  descriptionKey = "month_description";
  displayNameKey = "month_displayName";
  analyticsPane: boolean = false;
  uid: string = "monthUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showMonth;

  slices: Array<FormattingSettingsSlice> = [this.monthSkip, this.fmtMonth];
}

class quarterSettings extends FormattingSettingsGroup {
  showQuarter = new formattingSettings.ToggleSwitch({
    name: "showQuarter",
    displayNameKey: undefined,
    value: defaultSettings.period.quarterSettings.showQuarter,
  });

  fmtQuarter = new formattingSettings.AutoDropdown({
    name: "fmtQuarter",
    displayNameKey: "fmtQuarter_displayName",
    descriptionKey: "fmtQuarter_description",
    value: defaultSettings.period.quarterSettings.fmtQuarter,
  });

  quarterSkip = new formattingSettings.NumUpDown({
    name: "quarterSkip",
    displayNameKey: "quarterSkip_displayName",
    descriptionKey: "quarterSkip_description",
    value: defaultSettings.period.quarterSettings.quarterSkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 12,
      },
    },
  });

  name: string = "quarter";
  descriptionKey = "quarter_description";
  displayNameKey = "quarter_displayName";
  analyticsPane: boolean = false;
  uid: string = "quarterUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showQuarter;

  slices: Array<FormattingSettingsSlice> = [this.quarterSkip, this.fmtQuarter];
}

class yearSettings extends FormattingSettingsGroup {
  showYear = new formattingSettings.ToggleSwitch({
    name: "showYear",
    displayNameKey: undefined,
    value: defaultSettings.period.yearSettings.showYear,
  });

  fmtYear = new formattingSettings.AutoDropdown({
    name: "fmtYear",
    displayNameKey: "fmtYear_displayName",
    descriptionKey: "fmtYear_description",
    value: defaultSettings.period.yearSettings.fmtYear,
  });

  yearSkip = new formattingSettings.NumUpDown({
    name: "yearSkip",
    displayNameKey: "yearSkip_displayName",
    descriptionKey: "yearSkip_description",
    value: defaultSettings.period.yearSettings.yearSkip,
    options: {
      minValue: {
        type: powerbi.visuals.ValidatorType.Min,
        value: 0,
      },
      maxValue: {
        type: powerbi.visuals.ValidatorType.Max,
        value: 10,
      },
    },
  });

  yearStartMonth = new formattingSettings.AutoDropdown({
    name: "yearStartMonth",
    descriptionKey: "yearStartMonth_description",
    displayNameKey: "yearStartMonth_displayName",
    value: defaultSettings.period.yearSettings.yearStartMonth,
  });

  name: string = "year";
  description: string =
    "Show the Year buttons on the Step Bar & Current Period Bar";
  displayNameKey = "year_displayName";
  descriptionKey = "year_description";
  analyticsPane: boolean = false;
  uid: string = "yearUid";
  topLevelSlice: formattingSettings.SimpleSlice = this.showYear;

  slices: Array<FormattingSettingsSlice> = [
    this.yearStartMonth,
    this.yearSkip,
    this.fmtYear,
  ];
}

class PeriodSettings extends FormattingSettingsCompositeCard {
  name: string = "period";
  displayNameKey = "period_displayName";
  descriptionKey = "period_description";
  // Formatting settings slice
  analyticsPane: boolean = false;
  visible: boolean = true;

  periodDay = new daySettings(Object());
  periodWeek = new weekSettings(Object());
  periodPay = new paySettings(Object());
  periodMonth = new monthSettings(Object());
  periodQuarter = new quarterSettings(Object());
  periodYear = new yearSettings(Object());
  groups: Array<FormattingSettingsGroup> = [
    this.periodDay,
    this.periodWeek,
    this.periodPay,
    this.periodMonth,
    this.periodQuarter,
    this.periodYear,
  ];
}
