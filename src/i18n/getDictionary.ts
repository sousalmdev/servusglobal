import type { Locale } from "./config";

// We import the English dictionary statically so we have the type.
import en from "@/dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  pt: () => import("@/dictionaries/pt.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  ja: () => import("@/dictionaries/ja.json").then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale as Locale] ?? dictionaries.en;
  return loadDictionary() as Promise<Dictionary>;
};
