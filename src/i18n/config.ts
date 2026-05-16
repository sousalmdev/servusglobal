export const i18n = {
  defaultLocale: "en",
  locales: ["en", "pt", "es", "ja"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
