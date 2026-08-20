import { useState, useEffect, useCallback } from "react";
import { MessageSquare, RefreshCw, AlertCircle, CheckCircle2, Clock, XCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { feedbackApi } from "../../api/feedbackApi";
import {
  openComplaint,
  resendComplaintCode,
  reissueComplaintCode,
  approveComplaintRefund,
  rejectComplaint
} from "../../../../shared/api/orderApi";

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
  
  const [rejectModal, setRejectModal] = useState(false);
  const [refundModal, setRefundModal] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  // Hành động Mở xử lý (Moi -> Dang xu ly)
  const handleOpenComplaint = async (id) => {
    try {
      setUpdatingId(id);
      await openComplaint(id);
      toast.success("Đã tiếp nhận khiếu nại để xử lý.");
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  // A1: Gửi lại mã
  const handleResendCode = async (id) => {
    if (!window.confirm('Gửi lại chính voucher code hiện tại cho khách hàng?')) return;
    try {
      setUpdatingId(id);
      await resendComplaintCode(id);
      toast.success("Đã gửi lại mã cho khách hàng thành công.");
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  // A2: Cấp lại mã mới
  const handleReissueCode = async (id) => {
    if (!window.confirm('Vô hiệu hóa mã cũ và cấp một voucher code mới?')) return;
    try {
      setUpdatingId(id);
      await reissueComplaintCode(id);
      toast.success("Đã cấp lại mã mới thành công.");
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  // A3: Chấp nhận hoàn tiền
  const handleApproveRefund = async () => {
    if (!reasonInput.trim()) { toast.error("Vui lòng nhập lý do hoàn tiền"); return; }
    try {
      setUpdatingId(activeComplaintId);
      await approveComplaintRefund(activeComplaintId, { reason: reasonInput });
      toast.success("Đã chấp nhận khiếu nại, chuyển sang hoàn tiền.");
      setRefundModal(false);
      setReasonInput('');
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  // A4: Từ chối khiếu nại
  const handleRejectComplaint = async () => {
    if (!reasonInput.trim()) { toast.error("Vui lòng nhập lý do từ chối"); return; }
    try {
      setUpdatingId(activeComplaintId);
      const res = await rejectComplaint(activeComplaintId, { reason: reasonInput });
      if (res.data?.notificationSent === false) {
        toast.warning("Đã từ chối khiếu nại, nhưng chưa gửi được email thông báo cho khách hàng.");
      } else {
        toast.success("Đã từ chối khiếu nại thành công.");
      }
      setRejectModal(false);
      setReasonInput('');
      await loadComplaints();
    } catch (err) {
      toast.error(err.message || "Thao tác thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = complaints.filter(c => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedComplaints = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Danh sách khiếu nại
          </h2>
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
                ? 'bg-sky-500 text-white shadow-sm'
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
                {paginatedComplaints.map(c => {
                  const isLocked = c.status === 'Da xu ly' || c.status === 'Tu choi';
                  const canResendCode = c.voucherCodeStatus === 'Chua su dung';
                  const canReissueCode = ['Loi sinh ma', 'Het han', 'Vo hieu hoa'].includes(c.voucherCodeStatus);
                  const canRequestRefund = c.voucherCodeStatus !== 'Da su dung';
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono text-xs font-bold text-gray-800">{c.id.substring(0, 8)}...</td>
                      <td className="p-4 text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{c.content}</p>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        <span className="font-mono">{c.voucherPurchaseId?.substring(0, 8)}...</span>
                        <span className="mt-1 block text-[11px] text-gray-400">{c.voucherCodeStatus || 'Chưa rõ trạng thái mã'}</span>
                      </td>
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
                          <div className="flex flex-col items-end gap-1.5 flex-wrap">
                            {c.status === 'Moi' && (
                              <button
                                disabled={updatingId === c.id}
                                onClick={() => handleOpenComplaint(c.id)}
                                className="px-2.5 py-1.5 text-xs bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-colors"
                              >
                                Mở & Tiếp nhận
                              </button>
                            )}
                            {c.status === 'Dang xu ly' && (
                              <>
                                {canResendCode && (
                                  <button disabled={updatingId === c.id} onClick={() => handleResendCode(c.id)} className="w-full text-right px-2.5 py-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 disabled:opacity-40 transition-colors">
                                    Gửi lại mã hiện tại
                                  </button>
                                )}
                                {canReissueCode && (
                                  <button disabled={updatingId === c.id} onClick={() => handleReissueCode(c.id)} className="w-full text-right px-2.5 py-1.5 text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 disabled:opacity-40 transition-colors">
                                    Cấp mã mới
                                  </button>
                                )}
                                {canRequestRefund && (
                                  <button disabled={updatingId === c.id} onClick={() => { setReasonInput(''); setActiveComplaintId(c.id); setRefundModal(true); }} className="w-full text-right px-2.5 py-1.5 text-xs bg-sky-50 text-sky-700 font-semibold rounded-lg hover:bg-sky-100 disabled:opacity-40 transition-colors">
                                    Chấp nhận (Hoàn tiền)
                                  </button>
                                )}
                                <button disabled={updatingId === c.id} onClick={() => { setReasonInput(''); setActiveComplaintId(c.id); setRejectModal(true); }} className="w-full text-right px-2.5 py-1.5 text-xs bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 disabled:opacity-40 transition-colors">
                                  Từ chối
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} trên tổng số {filtered.length} kết quả
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                      currentPage === page
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {refundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Chấp nhận & Hoàn tiền</h3>
            <p className="text-sm text-gray-500">Hệ thống tạo bản ghi hoàn tiền Chờ xử lý; khiếu nại vẫn ở trạng thái Đang xử lý cho đến khi Sandbox hoàn tiền thành công.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do (Bắt buộc)</label>
              <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do hoàn tiền..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button disabled={updatingId === activeComplaintId} onClick={() => { setRefundModal(false); setReasonInput(''); }} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button disabled={updatingId === activeComplaintId} onClick={handleApproveRefund} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 disabled:opacity-50">{updatingId === activeComplaintId ? 'Đang xử lý...' : 'Xác nhận'}</button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Từ chối khiếu nại</h3>
            <p className="text-sm text-gray-500">Khách hàng sẽ nhận được lý do từ chối này.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do (Bắt buộc)</label>
              <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do từ chối..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button disabled={updatingId === activeComplaintId} onClick={() => { setRejectModal(false); setReasonInput(''); }} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button disabled={updatingId === activeComplaintId} onClick={handleRejectComplaint} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50">{updatingId === activeComplaintId ? 'Đang xử lý...' : 'Xác nhận từ chối'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
