const crypto = require("crypto");

class TranslationCache {
  constructor(ttlMs = 24 * 60 * 60 * 1000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
  }

  _hash(text, targetLang) {
    return crypto
      .createHash("md5")
      .update(`${text}|${targetLang}`)
      .digest("hex");
  }

  get(text, targetLang) {
    if (!text || typeof text !== "string") return null;
    const key = this._hash(text, targetLang);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.cachedAt > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return item.translatedText;
  }

  set(text, targetLang, translatedText) {
    if (!text || typeof text !== "string" || !translatedText) return;
    const key = this._hash(text, targetLang);
    this.cache.set(key, {
      translatedText,
      cachedAt: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new TranslationCache();
