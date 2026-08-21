import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = i18n.language || "vi";

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  const handleSelect = (code) => {
    if (code === currentLang) {
      setIsOpen(false);
      return;
    }
    i18n.changeLanguage(code);
    localStorage.setItem("app_lang", code);
    setIsOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all border border-white/20 shadow-sm"
        title="Chuyển đổi ngôn ngữ / Change Language"
      >
        <Globe size={14} className="opacity-90" />
        <span>{activeLang.flag}</span>
        <span className="uppercase tracking-wider">{activeLang.code}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden py-1 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                currentLang === lang.code
                  ? "bg-orange-50 font-bold text-orange-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
