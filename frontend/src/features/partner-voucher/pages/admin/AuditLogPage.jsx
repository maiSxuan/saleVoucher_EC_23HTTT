import React, { useState, useEffect } from "react";
import { fetchAuditLogsApi } from "../../../../shared/api/auditLogApi";
import { Search, Filter, RefreshCw, ScrollText, CheckCircle2, XCircle } from "lucide-react";

export function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetchAuditLogsApi({
        page,
        limit: 15,
        hanhDong: filterAction,
        ketQua: filterResult,
      });
      setLogs(res.logs || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) {
      console.error("Lỗi lấy nhật ký:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, filterResult]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ScrollText className="text-blue-600 w-7 h-7" />
            Nhật Ký Hệ Thống (Audit Logs)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Ghi nhận toàn bộ thao tác thay đổi trạng thái, phê duyệt, từ chối, khóa tài khoản và voucher (BR-ADM-07).
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            placeholder="Tìm theo tên hành động (VD: LOGIN, UPDATE, LOCK)..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterResult}
            onChange={(e) => {
              setFilterResult(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-44"
          >
            <option value="">Tất cả kết quả</option>
            <option value="Thanh cong">Thành công</option>
            <option value="That bai">Thất bại</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Thời Gian</th>
                <th className="py-3 px-4">Hành Động</th>
                <th className="py-3 px-4">Đối Tượng</th>
                <th className="py-3 px-4">Thực Hiện Bởi</th>
                <th className="py-3 px-4">Lý Do / Chi Tiết</th>
                <th className="py-3 px-4 text-center">Kết Quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                    Đang tải nhật ký hệ thống...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Không tìm thấy bản ghi nhật ký nào phù hợp.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSuccess = log.ket_qua === "Thanh cong";
                  const dateStr = log.thoi_diem || log.thoi_diem_thuc_hien;
                  return (
                    <tr key={log.log_id || log.id || Math.random()} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-600 whitespace-nowrap">
                        {dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "—"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded font-mono text-xs">
                          {log.hanh_dong}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-700">
                        {log.doi_tuong ? (
                          <span>
                            {log.doi_tuong}{" "}
                            {log.ma_doi_tuong && (
                              <span className="text-gray-400 font-mono text-[11px]">
                                ({String(log.ma_doi_tuong).slice(0, 8)}...)
                              </span>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-gray-800">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200/50">
                          {log.vai_tro_thuc_hien || "SYSTEM"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600 max-w-xs truncate" title={log.ly_do_thuc_hien || ""}>
                        {log.ly_do_thuc_hien || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Thành công
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Thất bại
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
            <span className="text-gray-600 text-xs">
              Trang {pagination.page} / {pagination.totalPages} (Tổng {pagination.total} bản ghi)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogPage;
