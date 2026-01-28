import { storage } from "@/lib/storage";

export const LANGUAGE_KEY = "prefs.language";
export const supportedLanguages = ["en", "hi", "ma"] as const;
export type LanguageCode = (typeof supportedLanguages)[number];

export async function getPreferredLanguage(): Promise<LanguageCode> {
  const v = await storage.getItem(LANGUAGE_KEY);
  if (v && (supportedLanguages as readonly string[]).includes(v)) {
    return v as LanguageCode;
  }
  return "en";
}

export async function setPreferredLanguage(lang: LanguageCode): Promise<void> {
  await storage.setItem(LANGUAGE_KEY, lang);
}
