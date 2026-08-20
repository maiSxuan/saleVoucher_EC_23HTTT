const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getCurrentLang() {
  return localStorage.getItem("app_lang") || "vi";
}

/**
 * Call Universal Translation API on Backend
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language ('en' | 'vi')
 */
export async function translateTextApi(text, targetLang = null) {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  const lang = targetLang || getCurrentLang();
  if (lang === "vi") return text;

  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: lang }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn("[translationApi] Failed to translate text via API:", e.message);
  }
  return text;
}

/**
 * Call Universal Translation API for array of texts
 * @param {Array<string>} texts - List of texts to translate
 * @param {string} targetLang - Target language ('en' | 'vi')
 */
export async function translateTextsApi(texts, targetLang = null) {
  if (!Array.isArray(texts) || texts.length === 0) return texts;
  const lang = targetLang || getCurrentLang();
  if (lang === "vi") return texts;

  try {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: lang }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (e) {
    console.warn("[translationApi] Failed to translate texts via API:", e.message);
  }
  return texts;
}
