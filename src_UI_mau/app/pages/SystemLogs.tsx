import { useState } from "react";
import { Search, X, ScrollText, ChevronRight } from "lucide-react";
import { mockLogs, moduleLabels, type LogModule, type LogResult } from "../data/mockData";
import { StatusBadge, getLogResultBadge } from "../components/ui/StatusBadge";

interface SystemLogsProps {
  initialFilters?: Record<string, unknown>;
}

export default function SystemLogs({ initialFilters: _initialFilters }: SystemLogsProps) {
  const [filterExecutor, setFilterExecutor] = useState('');
  const [filterModule, setFilterModule] = useState<string>('');
  const [filterAction, setFilterAction] = useState('');
  const [filterResult, setFilterResult] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<typeof mockLogs[0] | null>(null);

  const filtered = mockLogs.filter(l => {
    const matchExec = !filterExecutor || l.executor.toLowerCase().includes(filterExecutor.toLowerCase());
    const matchMod = !filterModule || l.module === filterModule;
    const matchAction = !filterAction || l.action.toLowerCase().includes(filterAction.toLowerCase());
    const matchResult = !filterResult || l.result === filterResult;
    return matchExec && matchMod && matchAction && matchResult;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Nhật ký hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Truy vết toàn bộ thao tác quản trị. Không thể sửa hoặc xóa nhật ký.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filterExecutor} onChange={e => setFilterExecutor(e.target.value)} placeholder="Người thực hiện..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả mô-đun</option>
            {Object.entries(moduleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filterAction} onChange={e => setFilterAction(e.target.value)} placeholder="Loại thao tác..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterResult} onChange={e => setFilterResult(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả kết quả</option>
            <option value="success">Thành công</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filtered.length} bản ghi</p>
          <button onClick={() => { setFilterExecutor(''); setFilterModule(''); setFilterAction(''); setFilterResult(''); }} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ScrollText size={40} className="mb-2" />
            <p className="text-sm">Không có nhật ký phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Thời gian', 'Người thực hiện', 'Mô-đun', 'Thao tác', 'Đối tượng', 'Trước', 'Sau', 'Kết quả', ''].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(log => {
                  const rb = getLogResultBadge(log.result);
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`hover:bg-gray-50 cursor-pointer ${log.result === 'failed' ? 'bg-red-50/40' : ''}`}
                    >
                      <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{log.executor}</td>
                      <td className="px-3 py-3">
                        <StatusBadge
                          label={moduleLabels[log.module as LogModule]}
                          variant={log.module === 'users' ? 'blue' : log.module === 'partners' ? 'green' : log.module === 'vouchers' ? 'amber' : log.module === 'orders' ? 'orange' : 'gray'}
                        />
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-800 max-w-[160px] truncate">{log.action}</td>
                      <td className="px-3 py-3 text-sm text-gray-600 max-w-[140px] truncate">{log.target}</td>
                      <td className="px-3 py-3 text-xs text-gray-400 max-w-[120px] truncate">{log.beforeStatus || '—'}</td>
                      <td className="px-3 py-3 text-xs text-gray-600 max-w-[120px] truncate">{log.afterStatus || '—'}</td>
                      <td className="px-3 py-3"><StatusBadge {...rb} /></td>
                      <td className="px-3 py-3">
                        <button className="flex items-center gap-0.5 text-sm text-blue-600 hover:text-blue-800">
                          <ChevronRight size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log detail drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedLog(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chi tiết nhật ký</h3>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge {...getLogResultBadge(selectedLog.result)} size="md" />
                <StatusBadge label={moduleLabels[selectedLog.module as LogModule]} variant={selectedLog.module === 'users' ? 'blue' : 'gray'} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'ID Log', value: selectedLog.id },
                  { label: 'Thời gian', value: selectedLog.timestamp },
                  { label: 'Người thực hiện', value: selectedLog.executor },
                  { label: 'Mô-đun', value: moduleLabels[selectedLog.module as LogModule] },
                  { label: 'Thao tác', value: selectedLog.action },
                  { label: 'Đối tượng', value: `${selectedLog.target} (${selectedLog.targetId})` },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                    <p className="text-gray-900 font-medium break-all">{f.value}</p>
                  </div>
                ))}
              </div>

              {(selectedLog.beforeStatus || selectedLog.afterStatus) && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {selectedLog.beforeStatus && (
                    <div className="text-sm">
                      <span className="text-gray-500">Trạng thái trước: </span>
                      <span className="text-gray-800">{selectedLog.beforeStatus}</span>
                    </div>
                  )}
                  {selectedLog.afterStatus && (
                    <div className="text-sm">
                      <span className="text-gray-500">Trạng thái sau: </span>
                      <span className="text-blue-700 font-medium">{selectedLog.afterStatus}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedLog.reason && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Lý do</p>
                  <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{selectedLog.reason}</p>
                </div>
              )}

              {selectedLog.result === 'failed' && selectedLog.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium mb-1">Thông báo lỗi</p>
                  <p className="text-sm text-red-700">{selectedLog.errorMessage}</p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Nhật ký chỉ đọc — không thể sửa hoặc xóa từ giao diện quản trị.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
