import React from "react";

export function SimpleChart({ title, data, type = "bar" }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      {title && <h3 className="text-sm font-semibold text-slate-800 mb-4">{title}</h3>}
      {type === "bar" ? (
        <div className="space-y-3">
          {data.map((item, idx) => {
            const percentage = Math.round((item.value / maxValue) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.displayValue || item.value}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-end justify-between h-44 gap-2 pt-6 border-b border-slate-100">
          {data.map((item, idx) => {
            const height = Math.round((item.value / maxValue) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-slate-500 font-semibold">{item.value}</span>
                <div
                  className="w-full bg-sky-500 hover:bg-sky-600 rounded-t transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-slate-400 truncate max-w-full">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SimpleChart;
