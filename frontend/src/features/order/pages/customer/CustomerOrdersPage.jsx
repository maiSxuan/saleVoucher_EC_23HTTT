import { useState, useEffect } from "react";
import { Package, ChevronRight, QrCode, Copy, Star, MessageSquare, AlertCircle, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  fetchCustomerOrders,
  fetchCustomerOrderDetail,
  submitOrderComplaint,
  submitOrderReview,
  customerCancelOrder,
} from "../../api/orderApi";

const ORDER_STATUS_CONFIG = {
  'Cho thanh toan': { label: 'Chờ thanh toán', variant: 'amber', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  'Da thanh toan': { label: 'Đã thanh toán', variant: 'green', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  'Da huy': { label: 'Đã hủy', variant: 'gray', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: XCircle },
  'Cho hoan tien': { label: 'Chờ hoàn tiền', variant: 'purple', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Clock },
  'Da hoan tien': { label: 'Đã hoàn tiền', variant: 'blue', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2 },
  'Huy yeu cau hoan tien': { label: 'Từ chối hoàn tiền', variant: 'red', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

const codeStatusLabels = {
  pending_issue: 'Chờ phát hành',
  issued: 'Đã phát hành',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
  generation_error: 'Lỗi sinh mã',
  disabled: 'Vô hiệu hóa',
};

const codeStatusColor = {
  pending_issue: 'bg-amber-50 text-amber-600',
  issued: 'bg-green-50 text-green-700',
  used: 'bg-gray-100 text-gray-500',
  expired: 'bg-gray-100 text-gray-400',
  generation_error: 'bg-red-100 text-red-600',
  disabled: 'bg-red-50 text-red-500',
};

function StatusBadge({ status }) {
  const cfg = ORDER_STATUS_CONFIG[status] || { label: status || 'Không rõ', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: AlertCircle };
  const Icon = cfg.icon || AlertCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon size={13} />
      {cfg.label}
    </span>
  );
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedVoucherMuaId, setSelectedVoucherMuaId] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) { toast.error('Vui lòng nhập lý do hủy đơn/hoàn tiền.'); return; }
    try {
      await customerCancelOrder(selectedOrderId, { reason: cancelReason });
      toast.success('Đã gửi yêu cầu hủy đơn, chuyển sang chờ hoàn tiền.');
      setShowCancelModal(false);
      setCancelReason('');
      handleSelectOrder(selectedOrderId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Không thể gửi yêu cầu hủy đơn');
    }
  };

  const loadOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetchCustomerOrders(filterStatus, pageNum, 10);
      setOrders(res.orders || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (e) {
      toast.error(e.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [filterStatus]);

  const handleSelectOrder = async (orderId) => {
    try {
      setSelectedOrderId(orderId);
      setLoadingDetail(true);
      const data = await fetchCustomerOrderDetail(orderId);
      setSelectedOrder(data);
    } catch (e) {
      toast.error(e.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedVoucherMuaId) { toast.error('Vui lòng chọn mã voucher để đánh giá.'); return; }
    if (!reviewText.trim()) { toast.error('Vui lòng nhập nội dung đánh giá.'); return; }
    try {
      await submitOrderReview(selectedOrderId, {
        maVoucherMua: selectedVoucherMuaId,
        diem: reviewRating,
        noiDung: reviewText,
      });
      toast.success('Đánh giá đã được ghi nhận thành công.');
      setShowReviewModal(false);
      setReviewText('');
    } catch (e) {
      toast.error(e.message || 'Không thể gửi đánh giá');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVoucherMuaId) { toast.error('Vui lòng chọn mã voucher liên quan.'); return; }
    if (!feedbackText.trim()) { toast.error('Vui lòng nhập nội dung phản ánh.'); return; }
    try {
      await submitOrderComplaint(selectedOrderId, {
        maVoucherMua: selectedVoucherMuaId,
        noiDung: feedbackText,
      });
      toast.success('Phản ánh/khiếu nại đã được gửi đến Admin.');
      setShowFeedbackModal(false);
      setFeedbackText('');
    } catch (e) {
      toast.error(e.message || 'Không thể gửi phản ánh');
    }
  };

  if (selectedOrderId) {
    if (loadingDetail) {
      return (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      );
    }
    const order = selectedOrder;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <button onClick={() => setSelectedOrderId(null)} className="text-sm text-gray-500 mb-4 hover:text-gray-700 flex items-center gap-1 font-medium">
          ← Danh sách đơn hàng
        </button>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-base font-bold text-gray-900 font-mono">Mã đơn: {order.id}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          </div>
          <div>
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Voucher đã mua</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center mb-3 last:mb-0 pb-3 border-b border-gray-50 last:border-0">
              {item.image ? (
                <img src={item.image} alt={item.voucherName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">V</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.voucherName}</p>
                <p className="text-xs text-gray-400">Đối tác: {item.partnerName} · Số lượng: ×{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
            <span>Tổng cộng</span>
            <span className="text-orange-600">{order.total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Codes / QR */}
        {order.codes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <QrCode size={16} /> Mã voucher điện tử (QR / Code)
            </h3>
            <div className="space-y-3">
              {order.codes.map((codeObj, idx) => (
                <div key={idx} className={`border rounded-xl p-3.5 ${codeObj.status === 'generation_error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Mã số voucher #{idx + 1}</p>
                      {codeObj.code ? (
                        <p className="font-mono text-base font-bold text-gray-900 tracking-wider">{codeObj.code}</p>
                      ) : (
                        <p className="text-xs text-red-500 flex items-center gap-1 font-semibold"><AlertCircle size={13} />Lỗi sinh mã hệ thống</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${codeStatusColor[codeObj.status] || 'bg-gray-100 text-gray-700'}`}>
                        {codeStatusLabels[codeObj.status] || codeObj.status}
                      </span>
                      {codeObj.code && (
                        <button onClick={() => { navigator.clipboard.writeText(codeObj.code); toast.success('Đã sao chép mã voucher!'); }} className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium">
                          <Copy size={13} /> Sao chép
                        </button>
                      )}
                    </div>
                  </div>
                  {codeObj.usedBranch && <p className="text-xs text-gray-500 mt-2 font-medium">Đã sử dụng tại chi nhánh: <span className="text-gray-900">{codeObj.usedBranch}</span></p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin/System Cancel/Refund Reason */}
        {order.cancelReason && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-xs text-blue-900 space-y-1">
            <p className="font-semibold text-blue-950">Ghi chú / Lý do hủy / Phản hồi từ Admin:</p>
            <p className="text-blue-800">{order.cancelReason}</p>
          </div>
        )}

        {/* Request Cancel / Refund for 'Da thanh toan' orders */}
        {order.orderStatus === 'Da thanh toan' && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
            <button onClick={() => setShowCancelModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
              <XCircle size={16} /> Yêu cầu hủy đơn & Hoàn tiền
            </button>
          </div>
        )}

        {/* Actions */}
        {order.orderStatus === 'Da thanh toan' && order.codes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
            <button onClick={() => { setSelectedVoucherMuaId(order.codes[0]?.voucherMuaId || ''); setShowReviewModal(true); }}
              className="flex-1 flex items-center justify-center gap-2 border border-orange-300 text-orange-600 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-50 transition-colors">
              <Star size={15} /> Viết đánh giá
            </button>
            <button onClick={() => { setSelectedVoucherMuaId(order.codes[0]?.voucherMuaId || ''); setShowFeedbackModal(true); }}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <MessageSquare size={15} /> Gửi phản ánh / khiếu nại
            </button>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">Viết đánh giá sản phẩm</h3>
              <p className="text-xs text-gray-400 mb-3">Đánh giá chất lượng dịch vụ / voucher đã mua</p>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Chọn mã voucher đánh giá</label>
                <select value={selectedVoucherMuaId} onChange={e => setSelectedVoucherMuaId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-xs">
                  {order.codes.map(c => <option key={c.voucherMuaId} value={c.voucherMuaId}>{c.code} ({c.status})</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setReviewRating(i + 1)} type="button">
                    <Star size={22} className={i < reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
              <textarea rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)}
                placeholder="Nhận xét chi tiết về trải nghiệm sử dụng..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-4" />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600">Hủy</button>
                <button onClick={handleSubmitReview} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">Gửi đánh giá</button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">Gửi phản ánh / khiếu nại</h3>
              <p className="text-xs text-gray-400 mb-3">Mô tả vấn đề gặp phải để quản trị viên hỗ trợ</p>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Chọn mã voucher liên quan</label>
                <select value={selectedVoucherMuaId} onChange={e => setSelectedVoucherMuaId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-xs">
                  {order.codes.map(c => <option key={c.voucherMuaId} value={c.voucherMuaId}>{c.code} ({c.status})</option>)}
                </select>
              </div>

              <textarea rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                placeholder="Mô tả sự cố hoặc vấn đề bạn gặp phải..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3" />
              <div className="flex gap-2">
                <button onClick={() => setShowFeedbackModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600">Hủy</button>
                <button onClick={handleSubmitFeedback} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">Gửi khiếu nại</button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">Yêu cầu hủy đơn & Hoàn tiền</h3>
              <p className="text-xs text-gray-400 mb-3">Nhập lý do bạn muốn hủy đơn hàng đã thanh toán này.</p>
              <textarea rows={4} value={cancelReason} onChange={e => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hoàn tiền..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3" />
              <div className="flex gap-2">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600">Đóng</button>
                <button onClick={handleCancelOrder} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700">Xác nhận gửi</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="text-orange-500" size={24} /> Đơn hàng của tôi
        </h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý và tra cứu trạng thái đơn hàng cùng mã voucher đã mua.</p>
      </div>

      {/* Filter Tabs matching DB status values */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'Cho thanh toan', label: 'Chờ thanh toán' },
          { key: 'Da thanh toan', label: 'Đã thanh toán' },
          { key: 'Cho hoan tien', label: 'Chờ hoàn tiền' },
          { key: 'Da hoan tien', label: 'Đã hoàn tiền' },
          { key: 'Da huy', label: 'Đã hủy' },
          { key: 'Huy yeu cau hoan tien', label: 'Từ chối hoàn tiền' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${filterStatus === f.key ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <Package size={48} className="mb-2 text-gray-300" />
          <p className="text-base font-medium text-gray-600">Chưa có đơn hàng nào</p>
          <p className="text-xs text-gray-400 mt-1">Các đơn hàng bạn mua sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} onClick={() => handleSelectOrder(order.id)}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 text-left hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-mono text-sm font-bold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <StatusBadge status={order.orderStatus} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">{order.items.length}</span> sản phẩm · <span className="font-semibold text-gray-900">{order.codes.length}</span> mã voucher
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-orange-600">{order.total.toLocaleString('vi-VN')}đ</p>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 mt-4">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.totalPages} ({pagination.total} đơn hàng)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadOrders(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              Trước
            </button>
            <button
              onClick={() => loadOrders(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
