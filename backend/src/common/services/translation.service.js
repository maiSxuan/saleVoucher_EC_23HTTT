const translationCache = require("../cache/translation-cache");

const ALLOWED_VOUCHER_FIELDS = new Set([
  "ten_voucher",
  "mo_ta",
  "dieu_kien_ap_dung",
  "chinh_sach_hoan_huy",
  "ten_danh_muc",
]);

function normalizeTargetLang(lang) {
  return (lang || "").toLowerCase().startsWith("en") ? "en" : "vi";
}

class TranslationService {
  /**
   * Translate a single text string from Vietnamese to targetLang ('en')
   * Fallback to original text if API fails (RB-17)
   */
  async translateText(text, targetLang = "en") {
    if (!text || typeof text !== "string" || !text.trim()) {
      return text;
    }
    const lang = normalizeTargetLang(targetLang);
    if (lang === "vi") {
      return text;
    }

    // 1. Check in-memory cache
    const cached = translationCache.get(text, lang);
    if (cached) {
      return cached;
    }

    let translatedText = null;

    // 2. Try official Google Cloud Translation REST API if key is present
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (apiKey) {
      try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            target: targetLang,
            source: "vi",
            format: "text",
          }),
        });

        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.translations && json.data.translations[0]) {
            translatedText = json.data.translations[0].translatedText;
          }
        } else {
          const errText = await response.text();
          console.warn(
            `[TranslationService] Google API responded with status ${response.status}: ${errText}`
          );
        }
      } catch (err) {
        console.warn(
          "[TranslationService] Google API call failed:",
          err.message
        );
      }
    }

    // 3. Fallback to public endpoint if official API not configured or failed
    if (!translatedText) {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=${targetLang}&dt=t&q=${encodeURIComponent(
          text
        )}`;
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json) && Array.isArray(json[0])) {
            translatedText = json[0].map((item) => item[0]).join("");
          }
        }
      } catch (err) {
        console.warn(
          "[TranslationService] Fallback translation API failed:",
          err.message
        );
      }
    }

    // 4. If translation succeeded, cache and return
    if (translatedText) {
      translationCache.set(text, targetLang, translatedText);
      return translatedText;
    }

    // 5. Fallback to original text on failure (RB-17: log warning, do not throw)
    console.warn(
      `[TranslationService] Warning: Could not translate text "${text.substring(
        0,
        30
      )}...", falling back to original (VI).`
    );
    return text;
  }

  /**
   * Translate allowed voucher fields on-the-fly
   */
  async translateVoucherFields(voucher, fields = Array.from(ALLOWED_VOUCHER_FIELDS), targetLang = "en") {
    const lang = normalizeTargetLang(targetLang);
    if (!voucher || lang === "vi") return voucher;

    if (Array.isArray(voucher)) {
      return Promise.all(
        voucher.map((v) => this.translateVoucherFields(v, fields, lang))
      );
    }

    const fieldsToTranslate = fields.filter((f) => ALLOWED_VOUCHER_FIELDS.has(f));

    for (const field of fieldsToTranslate) {
      if (voucher[field] && typeof voucher[field] === "string") {
        const translated = await this.translateText(voucher[field], lang);
        voucher[field] = translated;

        // Keep alias fields synchronized
        if (field === "ten_voucher") {
          voucher.name = translated;
        } else if (field === "mo_ta") {
          voucher.description = translated;
        } else if (field === "dieu_kien_ap_dung") {
          voucher.conditions = translated;
        } else if (field === "chinh_sach_hoan_huy") {
          voucher.cancellationPolicy = translated;
        } else if (field === "ten_danh_muc") {
          voucher.category = translated;
          if (voucher.danh_muc && typeof voucher.danh_muc === "object") {
            voucher.danh_muc.ten_danh_muc = translated;
          }
        }
      }
    }

    // Translate danh_muc sub-object if present and field ten_danh_muc is in fields
    if (
      fieldsToTranslate.includes("ten_danh_muc") &&
      voucher.danh_muc &&
      voucher.danh_muc.ten_danh_muc
    ) {
      const translatedCat = await this.translateText(
        voucher.danh_muc.ten_danh_muc,
        lang
      );
      voucher.danh_muc.ten_danh_muc = translatedCat;
      voucher.category = translatedCat;
      voucher.ten_danh_muc = translatedCat;
    }

    return voucher;
  }

  /**
   * Translate category items on-the-fly
   */
  async translateCategoryFields(category, targetLang = "en") {
    const lang = normalizeTargetLang(targetLang);
    if (!category || lang === "vi") return category;

    if (Array.isArray(category)) {
      return Promise.all(
        category.map((c) => this.translateCategoryFields(c, lang))
      );
    }

    if (category.ten_danh_muc) {
      const translated = await this.translateText(category.ten_danh_muc, targetLang);
      category.ten_danh_muc = translated;
      category.name = translated;
    } else if (category.name) {
      const translated = await this.translateText(category.name, targetLang);
      category.name = translated;
      category.ten_danh_muc = translated;
    }

    return category;
  }
}

module.exports = new TranslationService();
