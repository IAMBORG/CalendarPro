import React from "react";
import { Locale as DateFnsLocale } from "date-fns";
import { enUS, fr, es, nl, enGB } from "date-fns/locale"; // import only the locales you actually need
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;

/**
 * -------------------------
 * Localization for Power BI
 * -------------------------
 */
export const LocalizationContext = React.createContext<
  ILocalizationManager | undefined
>(undefined);

export const useLocalization = () => {
  const context = React.useContext(LocalizationContext);
  if (!context)
    throw new Error(
      "useLocalization must be used within a LocalizationProvider",
    );
  return context;
};

/**
 * -------------------------
 * Date-fns Locale Mapping
 * -------------------------
 */
const dateFnsLocaleMap: Record<string, DateFnsLocale> = {
  "en-US": enUS,
  "en-AU": enGB,
  "fr-FR": fr,
  "es-ES": es,
  "nl-NL": nl,
};

export const DateFnsLocaleContext = React.createContext<
  DateFnsLocale | undefined
>(undefined);

interface DateFnsLocaleProviderProps {
  children: React.ReactNode;
  languageCode: string; // e.g., from Power BI ILocalizationManager.getDisplayName("Language")
}

export const DateFnsLocaleProvider: React.FC<DateFnsLocaleProviderProps> = ({
  children,
  languageCode,
}) => {
  // Fallback: use languageCode directly, or strip region if not found
  let locale: DateFnsLocale = dateFnsLocaleMap[languageCode] ?? enUS;
  if (!locale) {
    const shortCode = languageCode.split("-")[0]; // e.g., "en"
    locale =
      Object.entries(dateFnsLocaleMap).find(([key]) =>
        key.startsWith(shortCode),
      )?.[1] ?? enUS;
  }

  if (!locale) {
    locale = enUS;
  }

  return (
    <DateFnsLocaleContext.Provider value={locale}>
      {children}
    </DateFnsLocaleContext.Provider>
  );
};

export const useDateFnsLocale = () => {
  const context = React.useContext(DateFnsLocaleContext);
  if (!context)
    throw new Error(
      "useDateFnsLocale must be used within a DateFnsLocaleProvider",
    );
  return context;
};
