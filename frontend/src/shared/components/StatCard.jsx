import React from "react";

export function StatCard({ title, value, change, changeType = "neutral", icon, subtitle }) {
  const getChangeColor = () => {
    if (changeType === "increase") return "text-emerald-600 bg-emerald-50";
    if (changeType === "decrease") return "text-rose-600 bg-rose-50";
    return "text-slate-600 bg-slate-50";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">{icon}</div>}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {change && (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${getChangeColor()}`}>
            {change}
          </span>
        )}
      </div>
      {subtitle && <span className="text-xs text-slate-400 mt-2">{subtitle}</span>}
    </div>
  );
}

export default StatCard;
