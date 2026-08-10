import { useState, useEffect, useCallback } from "react";
import { MessageSquare, RefreshCw, AlertCircle, CheckCircle2, Clock, XCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { feedbackApi } from "../../api/feedbackApi";

const STATUS_CONFIG = {
  'Moi': { label: 'Mới', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Dang xu ly': { label: 'Đang xử lý', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: RefreshCw },
  'Da xu ly': { label: 'Đã xử lý', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Tu choi': { label: 'Từ chối', cls: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200', icon: AlertCircle };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await feedbackApi.list();
      setComplaints(res.data || []);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách khiếu nại");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await feedbackApi.updateStatus(id, { status: newStatus });
      toast.success("Cập nhật trạng thái khiếu nại thành công!");
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter(c => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-orange-500" size={26} /> Quản lý và Xử lý Khiếu nại
          </h1>
          <p className="text-sm text-gray-500 mt-1">Xem xét, tiếp nhận và cập nhật trạng thái khiếu nại từ khách hàng.</p>
        </div>
        <button
          onClick={loadComplaints}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Làm mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'Moi', label: 'Mới' },
          { key: 'Dang xu ly', label: 'Đang xử lý' },
          { key: 'Da xu ly', label: 'Đã xử lý' },
          { key: 'Tu choi', label: 'Từ chối' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === tab.key
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 text-sm">Đang tải danh sách khiếu nại...</div>
      ) : error ? (
        <div className="text-center py-24 text-red-500 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          <ShieldAlert size={40} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-medium">Không có khiếu nại nào phù hợp.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Mã khiếu nại</th>
                  <th className="p-4">Nội dung</th>
                  <th className="p-4">Mã lần mua voucher</th>
                  <th className="p-4">Ngày gửi</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Người xử lý (Admin ID)</th>
                  <th className="p-4 text-right">Hành động xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filtered.map(c => {
                  const isLocked = c.status === 'Da xu ly' || c.status === 'Tu choi';
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-gray-800">{c.id.substring(0, 8)}...</td>
                      <td className="p-4 text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{c.content}</p>
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">{c.voucherPurchaseId?.substring(0, 8)}...</td>
                      <td className="p-4 text-xs text-gray-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : '—'}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">
                        {c.handlerId ? c.handlerId.substring(0, 8) + '...' : <span className="text-gray-400 italic">Chưa phân công</span>}
                      </td>
                      <td className="p-4 text-right">
                        {isLocked ? (
                          <span className="text-xs font-medium text-gray-400 italic">Đã khóa (Hoàn tất)</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              disabled={updatingId === c.id || c.status === 'Dang xu ly'}
                              onClick={() => handleUpdateStatus(c.id, 'Dang xu ly')}
                              className="px-2.5 py-1.5 text-xs bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-colors"
                            >
                              Đang xử lý
                            </button>
                            <button
                              disabled={updatingId === c.id}
                              onClick={() => handleUpdateStatus(c.id, 'Da xu ly')}
                              className="px-2.5 py-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 disabled:opacity-40 transition-colors"
                            >
                              Đã xử lý
                            </button>
                            <button
                              disabled={updatingId === c.id}
                              onClick={() => handleUpdateStatus(c.id, 'Tu choi')}
                              className="px-2.5 py-1.5 text-xs bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 disabled:opacity-40 transition-colors"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
