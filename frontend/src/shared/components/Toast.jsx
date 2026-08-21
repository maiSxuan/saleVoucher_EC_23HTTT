import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function Toast({ message, type = "success", onClose, duration = 1500 }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: "bg-emerald-800 text-white border-emerald-700",
    error: "bg-rose-800 text-white border-rose-700",
    warning: "bg-amber-800 text-white border-amber-700",
    info: "bg-sky-800 text-white border-sky-700",
  };

  return (
    <div className="fixed top-6 right-6 z-50 transition-all duration-300 ease-in-out">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${
          typeStyles[type] || typeStyles.success
        }`}
      >
        <span>{t(message)}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-75">
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
