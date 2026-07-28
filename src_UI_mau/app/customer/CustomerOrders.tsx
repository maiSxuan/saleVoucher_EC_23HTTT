import { useState } from "react";
import { Package, ChevronRight, QrCode, Copy, Star, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  mockCustomerOrders, mockCustomerVouchers, orderStatusLabels, paymentStatusLabels, codeStatusLabels,
  type CustomerOrder,
} from "./customerMockData";

interface Props {
  onNavigate: (page: string, ctx?: Record<string, unknown>) => void;
}

const orderStatusColor: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const payStatusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  success: 'bg-green-50 text-green-600',
  failed: 'bg-red-50 text-red-600',
  refunded_sim: 'bg-blue-50 text-blue-600',
};

const codeStatusColor: Record<string, string> = {
  pending_issue: 'bg-amber-50 text-amber-600',
  issued_unused: 'bg-green-50 text-green-700',
  used: 'bg-gray-100 text-gray-500',
  expired: 'bg-gray-100 text-gray-400',
  cancelled: 'bg-gray-100 text-gray-400',
  disabled: 'bg-red-50 text-red-500',
  error: 'bg-red-100 text-red-600',
};

export default function CustomerOrders({ onNavigate }: Props) {
  const [orders] = useState<CustomerOrder[]>(mockCustomerOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = orders.filter(o => filterStatus === 'all' || o.orderStatus === filterStatus);

  const getVoucher = (id: string) => mockCustomerVouchers.find(v => v.id === id);

  const handleSubmitReview = () => {
    if (!reviewText.trim()) { toast.error('Vui lòng nhập nội dung đánh giá.'); return; }
    toast.success('Đánh giá đã được ghi nhận (mô phỏng).');
    setShowReviewModal(false);
    setReviewText('');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) { toast.error('Vui lòng nhập nội dung phản ánh.'); return; }
    toast.success('Phản ánh/khiếu nại đã được gửi (mô phỏng).');
    setShowFeedbackModal(false);
    setFeedbackText('');
  };

  if (selectedOrder) {
    const order = selectedOrder;
    return (
      <div>
        <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500 mb-4 hover:text-gray-700 flex items-center gap-1">
          ← Danh sách đơn hàng
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-mono">{order.id}</h1>
            <p className="text-xs text-gray-400">{order.createdAt}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${orderStatusColor[order.orderStatus]}`}>{orderStatusLabels[order.orderStatus]}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${payStatusColor[order.paymentStatus]}`}>{paymentStatusLabels[order.paymentStatus]}</span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Voucher đã mua</h3>
          {order.items.map((item, idx) => {
            const v = getVoucher(item.voucherId);
            return (
              <div key={idx} className="flex gap-3 items-center mb-3 last:mb-0">
                {v && <img src={v.image} alt={v.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{v?.name || item.voucherId}</p>
                  <p className="text-xs text-gray-400">{v?.partner} · ×{item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ</p>
              </div>
            );
          })}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
            <span>Tổng cộng</span>
            <span className="text-orange-600">{order.total.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        {/* Codes */}
        {order.codes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <QrCode size={14} /> Mã voucher
            </h3>
            <div className="space-y-2">
              {order.codes.map((codeObj, idx) => {
                const v = getVoucher(codeObj.voucherId);
                return (
                  <div key={idx} className={`border rounded-xl p-3 ${codeObj.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">{v?.name || codeObj.voucherName}</p>
                        {codeObj.code ? (
                          <p className="font-mono text-sm font-bold text-gray-900 tracking-wider">{codeObj.code}</p>
                        ) : (
                          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />Lỗi cấp mã</p>
                        )}
                        {codeObj.validUntil && <p className="text-xs text-gray-400 mt-0.5">Hết hạn {codeObj.validUntil}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${codeStatusColor[codeObj.status]}`}>{codeStatusLabels[codeObj.status]}</span>
                        {codeObj.code && (
                          <button onClick={() => { navigator.clipboard.writeText(codeObj.code!); toast.success('Đã sao chép!'); }} className="text-gray-400 hover:text-orange-500">
                            <Copy size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {codeObj.usedBranch && <p className="text-xs text-gray-400 mt-1">Đã dùng tại: {codeObj.usedBranch}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        {order.orderStatus === 'paid' && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-2">
            <button onClick={() => setShowReviewModal(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-orange-300 text-orange-600 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-50">
              <Star size={14} /> Viết đánh giá
            </button>
            <button onClick={() => setShowFeedbackModal(true)}
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
              <MessageSquare size={14} /> Gửi phản ánh/khiếu nại
            </button>
          </div>
        )}

        {/* Review modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowReviewModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">Viết đánh giá (UC-CUS-12)</h3>
              <p className="text-xs text-gray-400 mb-3">Đánh giá chất lượng dịch vụ / sản phẩm</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setReviewRating(i + 1)}>
                    <Star size={20} className={i < reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
              <textarea rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)}
                placeholder="Nhận xét về trải nghiệm sử dụng..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3" />
              <div className="flex gap-2">
                <button onClick={() => setShowReviewModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Hủy</button>
                <button onClick={handleSubmitReview} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Gửi đánh giá</button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFeedbackModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">Phản ánh / Khiếu nại (UC-CUS-12)</h3>
              <p className="text-xs text-gray-400 mb-3">Mô tả vấn đề gặp phải để được hỗ trợ</p>
              <textarea rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)}
                placeholder="Mô tả vấn đề bạn gặp phải..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 mb-3" />
              <p className="text-xs text-gray-400 mb-3">Phản ánh sẽ được chuyển đến Admin để xử lý. Không thể hủy/hoàn tiền trực tiếp.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowFeedbackModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm">Hủy</button>
                <button onClick={handleSubmitFeedback} className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold">Gửi phản ánh</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Package size={20} /> Đơn hàng của tôi
      </h1>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'paid', label: 'Đã thanh toán' },
          { key: 'pending_payment', label: 'Chờ thanh toán' },
          { key: 'cancelled', label: 'Đã hủy' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${filterStatus === f.key ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-gray-400">
          <Package size={40} className="mb-2" />
          <p className="text-sm">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <button key={order.id} onClick={() => setSelectedOrder(order)}
              className="w-full bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-orange-200 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.createdAt}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${orderStatusColor[order.orderStatus]}`}>{orderStatusLabels[order.orderStatus]}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${payStatusColor[order.paymentStatus]}`}>{paymentStatusLabels[order.paymentStatus]}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{order.items.length} voucher · {order.codes.length} mã</p>
                <div className="flex items-center gap-1">
                  <p className="text-sm font-bold text-orange-600">{order.total.toLocaleString('vi-VN')}đ</p>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
