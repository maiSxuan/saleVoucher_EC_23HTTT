import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import viTranslation from "./locales/vi.json";
import enTranslation from "./locales/en.json";

const savedLang = localStorage.getItem("app_lang") || "vi";

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: viTranslation },
    en: { translation: enTranslation },
  },
  lng: savedLang,
  fallbackLng: "vi",
  keySeparator: false,
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("app_lang", lng);
  window.dispatchEvent(new CustomEvent("app_language_changed", { detail: lng }));
});

/**
 * Universal auto-translator function for any dynamic text in frontend
 */
export async function translateOnTheFly(text, targetLang = i18n.language) {
  if (!text || targetLang === "vi") return text;
  // First check if text is already in en.json
  if (enTranslation[text]) return enTranslation[text];

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn("[i18n] translateOnTheFly error:", e.message);
  }
  return text;
}

export default i18n;
