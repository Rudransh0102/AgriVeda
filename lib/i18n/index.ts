import { getPreferredLanguage } from "@/lib/preferences";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Load expo-localization defensively to avoid native crashes if unavailable
let Localization: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Localization = require("expo-localization");
} catch (e) {
  Localization = {};
}

// Load resources via require to avoid TS JSON config changes
// @ts-expect-error JSON require supported by Metro
const en = require("@/lib/locales/en/common.json");
// @ts-expect-error JSON require supported by Metro
const hi = require("@/lib/locales/hi/common.json");
// @ts-expect-error JSON require supported by Metro
const ma = require("@/lib/locales/ma/common.json");

const resources = {
  en: { common: en },
  hi: { common: hi },
  ma: { common: ma },
};

let initialized = false;

async function ensureInit() {
  if (initialized) return i18n;
  const saved = await getPreferredLanguage();
  const device = (
    Localization.getLocales?.()[0]?.languageCode || "en"
  ).toLowerCase();
  const initial =
    saved ||
    (device === "hi" ? "hi" : device === "mr" || device === "ma" ? "ma" : "en");

  i18n.use(initReactI18next).init({
    resources,
    lng: initial,
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
  initialized = true;
  return i18n;
}

// Kick off init immediately (fire and forget)
ensureInit();

export default i18n;
export { ensureInit };
