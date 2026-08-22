import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("app_lang") || "vi";

const localeLoaders = {
  vi: () => import("./locales/vi.json"),
  en: () => import("./locales/en.json"),
};
const localeRequests = new Map();

async function loadLocale(lang) {
  const normalizedLang = localeLoaders[lang] ? lang : "vi";
  if (!localeRequests.has(normalizedLang)) {
    localeRequests.set(
      normalizedLang,
      localeLoaders[normalizedLang]().then((module) => module.default || module),
    );
  }
  return localeRequests.get(normalizedLang);
}

export const i18nReady = loadLocale(savedLang).then((translation) =>
  i18n.use(initReactI18next).init({
    resources: {
      [savedLang]: { translation },
    },
    lng: savedLang,
    fallbackLng: savedLang,
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
  }),
);

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
  const enTranslation = await loadLocale("en");
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
