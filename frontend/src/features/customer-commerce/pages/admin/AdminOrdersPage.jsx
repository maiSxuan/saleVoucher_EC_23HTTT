import { useState, useEffect } from "react";
import { Search, X, ArrowLeft, ShoppingCart, AlertTriangle, RefreshCw, Eye, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminOrders,
  fetchAdminOrderDetail,
  fetchAdminOrderLogs,
  updateOrderPaymentStatus,
  adminCancelOrder,
  confirmOrderRefund,
  rejectOrderRefund,
  reissueOrderCode,
} from "../../../../shared/api/orderApi";

const ORDER_STATUS_CONFIG = {
  'Cho thanh toan': { label: 'Chờ thanh toán', variant: 'amber', dot: true },
  'Da thanh toan': { label: 'Đã thanh toán', variant: 'green', dot: true },
  'Da huy': { label: 'Đã hủy', variant: 'gray' },
  'Cho hoan tien': { label: 'Chờ hoàn tiền', variant: 'purple', dot: true },
  'Da hoan tien': { label: 'Đã hoàn tiền', variant: 'blue', dot: true },
  'Huy yeu cau hoan tien': { label: 'Từ chối hoàn tiền', variant: 'red', dot: true },
};

const orderStatusLabels = {
  'Cho thanh toan': 'Chờ thanh toán',
  'Da thanh toan': 'Đã thanh toán',
  'Da huy': 'Đã hủy',
  'Cho hoan tien': 'Chờ hoàn tiền',
  'Da hoan tien': 'Đã hoàn tiền',
  'Huy yeu cau hoan tien': 'Từ chối hoàn tiền',
};

const voucherCodeStatusLabels = {
  not_issued: 'Chưa phát hành',
  pending_issue: 'Chờ phát hành',
  issued: 'Đã phát hành',
  used: 'Đã sử dụng',
  expired: 'Hết hạn',
  generation_error: 'Lỗi sinh mã',
  disabled: 'Vô hiệu hóa',
};

function StatusBadge({ label, variant = 'gray', dot = false }) {
  const colors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  const dotColors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
    purple: 'bg-purple-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[variant] || colors.gray}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-gray-400'}`} />}
      {label}
    </span>
  );
}

function getOrderStatusBadge(status) {
  const cfg = ORDER_STATUS_CONFIG[status] || { label: status || 'Không rõ', variant: 'gray' };
  return <StatusBadge label={cfg.label} variant={cfg.variant} dot={cfg.dot} />;
}

function getPaymentStatusBadge(status) {
  switch (status) {
    case 'Thanh cong': return { label: 'Thành công', variant: 'green' };
    case 'That bai': return { label: 'Thất bại', variant: 'red' };
    case 'Dang xu ly': return { label: 'Đang xử lý', variant: 'amber' };
    default: return { label: 'Chờ', variant: 'amber' };
  }
}

function getVoucherCodeStatusBadge(status) {
  switch (status) {
    case 'Chua su dung': return { label: 'Chưa sử dụng', variant: 'blue', dot: true };
    case 'Da su dung': return { label: 'Đã sử dụng', variant: 'green', dot: true };
    case 'Loi sinh ma': return { label: 'Lỗi sinh mã', variant: 'red', dot: true };
    case 'Vo hieu hoa': return { label: 'Vô hiệu hóa', variant: 'gray' };
    case 'Het han': return { label: 'Hết hạn', variant: 'gray' };
    default: return { label: 'Chưa phát hành', variant: 'amber' };
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Selected order detail
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderLogs, setOrderLogs] = useState([]);

  // Modals & reasons
  const [refundModal, setRefundModal] = useState(false);
  const [rejectRefundModal, setRejectRefundModal] = useState(false);
  const [reissueModal, setReissueModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [paymentStatusModal, setPaymentStatusModal] = useState(false);
  const [reasonInput, setReasonInput] = useState('');

  const loadOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetchAdminOrders({ search, orderStatus, page: pageNum, limit: 10 });
      setOrders(res.orders || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      setTotal(res.total || 0);
    } catch (e) {
      toast.error(e.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
  }, [search, orderStatus]);

  const loadDetail = async (id) => {
    try {
      setSelectedId(id);
      setLoadingDetail(true);
      const data = await fetchAdminOrderDetail(id);
      setSelectedOrder(data);
      const logs = await fetchAdminOrderLogs(id);
      setOrderLogs(logs);
    } catch (e) {
      toast.error(e.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmRefund = async () => {
    if (!reasonInput.trim()) { toast.error('Vui lòng nhập lý do hoàn tiền thành công.'); return; }
    try {
      await confirmOrderRefund(selectedId, { reason: reasonInput });
      toast.success('Đã ghi nhận hoàn tiền thành công.');
      setRefundModal(false);
      setReasonInput('');
      loadDetail(selectedId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  const handleRejectRefund = async () => {
    if (!reasonInput.trim()) { toast.error('Vui lòng nhập lý do từ chối hoàn tiền.'); return; }
    try {
      await rejectOrderRefund(selectedId, { reason: reasonInput });
      toast.success('Đã ghi nhận từ chối hoàn tiền (thất bại).');
      setRejectRefundModal(false);
      setReasonInput('');
      loadDetail(selectedId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  const handleReissueCode = async () => {
    if (!selectedOrder?.codes?.[0]?.id) { toast.error('Không tìm thấy mã voucher hợp lệ để cấp lại.'); return; }
    try {
      await reissueOrderCode(selectedId, { maVoucherMua: selectedOrder.codes[0].id });
      toast.success('Đã cấp lại mã voucher mới thành công.');
      setReissueModal(false);
      loadDetail(selectedId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  const handleCancelOrder = async () => {
    if (!reasonInput.trim()) { toast.error('Vui lòng nhập lý do hủy đơn.'); return; }
    try {
      await adminCancelOrder(selectedId, { reason: reasonInput });
      toast.success('Đã chuyển đơn hàng sang trạng thái chờ hoàn tiền / hủy.');
      setCancelModal(false);
      setReasonInput('');
      loadDetail(selectedId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  const handleUpdatePaymentStatus = async (newStatus) => {
    try {
      await updateOrderPaymentStatus(selectedId, { newStatus, reason: reasonInput || 'Admin xác nhận thanh toán thủ công' });
      toast.success('Đã cập nhật trạng thái thanh toán và kích hoạt sinh mã.');
      setPaymentStatusModal(false);
      setReasonInput('');
      loadDetail(selectedId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    }
  };

  if (selectedId) {
    if (loadingDetail) {
      return (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      );
    }
    const order = selectedOrder;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;

    const hasInconsistency = order.paymentStatus === 'Thanh cong' && order.voucherCodeStatus === 'Loi sinh ma';
    const canRefund = order.orderStatus === 'Cho hoan tien';
    const canReissue = order.paymentStatus === 'Thanh cong' && (order.voucherCodeStatus === 'Loi sinh ma' || order.voucherCodeStatus === 'not_issued');

    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 mb-4 transition-colors">
          <ArrowLeft size={16} /> Quay lại danh sách đơn hàng
        </button>

        {/* Header (Removed canRefund buttons here, moved to Refund tab) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-xs">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng {order.id}</h2>
              <p className="text-sm text-gray-500 mt-0.5">Khách hàng: <span className="font-medium text-gray-900">{order.customerName}</span> ({order.customerEmail}) · Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              <div className="flex flex-wrap gap-2 mt-3 items-center">
                <span className="text-xs text-gray-500">Trạng thái đơn:</span>
                {getOrderStatusBadge(order.orderStatus)}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canReissue && (
                <button onClick={() => setReissueModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium shadow-xs">
                  Cấp lại mã mới
                </button>
              )}
              {order.orderStatus === 'Cho thanh toan' && (
                <button onClick={() => setPaymentStatusModal(true)} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-xs">
                  Xác nhận thanh toán thủ công
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inconsistency Alert */}
        {hasInconsistency && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Phát hiện dữ liệu bất thường (Inconsistency)</p>
              <p className="text-sm text-red-700 mt-0.5">Đơn hàng đã thanh toán thành công nhưng phát sinh lỗi sinh mã voucher. Cần cấp lại mã mới hoặc tiến hành hoàn tiền cho khách hàng.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl border border-b-0 px-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'payment', label: 'Lịch sử thanh toán' },
            { id: 'codes', label: 'Lịch sử mã voucher' },
            { id: 'refund', label: 'Yêu cầu hủy/hoàn tiền' },
            { id: 'log', label: 'Nhật ký quản trị' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5 shadow-xs">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Thông tin chung</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                  {[
                    { label: 'Mã đơn hàng', value: order.id },
                    { label: 'Khách hàng', value: `${order.customerName} (${order.customerEmail})` },
                    { label: 'Số điện thoại', value: order.customerPhone || 'Không có' },
                    { label: 'Voucher chính', value: order.voucherName },
                    { label: 'Đối tác cung cấp', value: order.partnerName },
                    { label: 'Tổng tiền thanh toán', value: `${order.total.toLocaleString('vi-VN')}đ` },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between">
                      <span className="text-gray-500">{f.label}:</span>
                      <span className="font-semibold text-gray-900">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Chi tiết sản phẩm & trạng thái mã voucher</h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Danh sách sản phẩm:</p>
                    {order.items.map((i, idx) => (
                      <div key={idx} className="text-xs text-gray-800 flex justify-between py-1 border-b border-gray-200 last:border-0">
                        <span>{i.voucherName} (×{i.quantity})</span>
                        <span className="font-semibold">{(i.unitPrice * i.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Mã voucher & Trạng thái phát hành từng mã:</p>
                    {order.codes.map((c, idx) => {
                      const cb = getVoucherCodeStatusBadge(c.status);
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200 mb-1.5 shadow-2xs">
                          <div>
                            <code className="font-mono text-xs font-bold text-blue-600">{c.code || 'Lỗi sinh mã'}</code>
                            {c.usedBranch && <p className="text-[11px] text-gray-400 mt-0.5">Dùng tại: {c.usedBranch}</p>}
                          </div>
                          <StatusBadge label={cb.label} variant={cb.variant} dot={cb.dot} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-3">
              {order.paymentHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Chưa có lịch sử thanh toán.</p>
              ) : (
                order.paymentHistory.map(p => (
                  <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.method} — {p.id}</p>
                      <p className="text-xs text-gray-500">{new Date(p.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{p.amount.toLocaleString('vi-VN')}đ</p>
                      <StatusBadge label={p.status} variant={p.status === 'success' ? 'green' : 'amber'} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'codes' && (
            <div className="space-y-3">
              {order.codeHistory.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Chưa có lịch sử thay đổi mã.</p>
              ) : (
                order.codeHistory.map(c => (
                  <div key={c.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{c.action}</p>
                      <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleString('vi-VN')}</span>
                    </div>
                    {c.oldCode && <p className="text-xs text-red-600 font-mono">Mã cũ: {c.oldCode}</p>}
                    {c.code && <p className="text-xs text-green-600 font-mono font-bold">Mã mới: {c.code}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-4">
              {!order.refundRequest && !canRefund ? (
                <div className="text-center py-10 text-gray-400">
                  <CheckCircle size={40} className="mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">Không có yêu cầu hủy / hoàn tiền nào.</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-gray-900">Yêu cầu hoàn tiền đơn hàng</h5>
                    <span className="text-xs text-gray-500">{order.refundRequest?.requestedAt ? new Date(order.refundRequest.requestedAt).toLocaleString('vi-VN') : new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="text-sm text-gray-700"><strong>Lý do:</strong> {order.refundRequest?.reason || order.cancelReason || 'Yêu cầu từ hệ thống/khách hàng'}</p>
                  {order.refundRequest?.rejectedReason && (
                    <p className="text-sm text-red-600"><strong>Lý do từ chối:</strong> {order.refundRequest.rejectedReason}</p>
                  )}
                  {canRefund && (
                    <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                      <button onClick={() => setRefundModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-xs">
                        <RefreshCw size={15} /> Ghi nhận hoàn tiền (Thành công - Completed)
                      </button>
                      <button onClick={() => setRejectRefundModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium shadow-xs">
                        <X size={15} /> Từ chối hoàn tiền (Thất bại - Rejected)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div className="space-y-3">
              {orderLogs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Chưa có nhật ký hệ thống cho đơn hàng này.</p>
              ) : (
                orderLogs.map(log => (
                  <div key={log.log_id} className="border border-gray-200 rounded-xl p-3 text-xs bg-gray-50 space-y-1">
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Hành động: {log.hanh_dong}</span>
                      <span className="text-gray-400">{new Date(log.thoi_diem_thuc_hien).toLocaleString('vi-VN')}</span>
                    </div>
                    {log.ly_do_thuc_hien && <p className="text-gray-600">Lý do: {log.ly_do_thuc_hien}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {refundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Ghi nhận hoàn tiền (Thành công)</h3>
              <p className="text-xs text-gray-500">Số tiền hoàn: <strong className="text-gray-900">{order.total.toLocaleString('vi-VN')}đ</strong>. Trạng thái hoàn tiền sẽ được ghi nhận là <strong>Thành công (completed)</strong>.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do hoàn tiền (Bắt buộc)</label>
                <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do hoàn tiền..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setRefundModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
                <button onClick={handleConfirmRefund} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Xác nhận hoàn tiền (Thành công)</button>
              </div>
            </div>
          </div>
        )}

        {rejectRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Từ chối yêu cầu hoàn tiền (Thất bại)</h3>
              <p className="text-xs text-gray-500">Trạng thái hoàn tiền sẽ được ghi nhận là <strong>Thất bại / Từ chối (rejected)</strong>.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do từ chối (Bắt buộc)</label>
                <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do từ chối..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setRejectRefundModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
                <button onClick={handleRejectRefund} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Xác nhận từ chối (Thất bại)</button>
              </div>
            </div>
          </div>
        )}

        {reissueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Cấp lại mã voucher mới</h3>
              <p className="text-sm text-gray-600">Hệ thống sẽ vô hiệu hóa mã cũ bị lỗi và sinh mã QR mới liên kết với đơn hàng.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setReissueModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
                <button onClick={handleReissueCode} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600">Xác nhận cấp lại</button>
              </div>
            </div>
          </div>
        )}

        {paymentStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Xác nhận thanh toán thủ công</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do xác nhận (ghi chú)</label>
                <input type="text" value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Ví dụ: Khách đã chuyển khoản ngân hàng..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setPaymentStatusModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Hủy</button>
                <button onClick={() => handleUpdatePaymentStatus('Thanh cong')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">Xác nhận thành công & Phát mã</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Tra cứu, theo dõi và xử lý giao dịch đơn hàng toàn hệ thống.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Mã đơn / tên khách..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái đơn</option>
            {Object.entries(orderStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-medium text-gray-600">{total} đơn hàng</p>
          <button onClick={() => { setSearch(''); setOrderStatus(''); }} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium">
            <X size={14} /> Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ShoppingCart size={40} className="mb-2 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">Không tìm thấy đơn hàng phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {['Mã đơn', 'Khách hàng', 'Voucher', 'Đối tác', 'Tổng tiền', 'Trạng thái đơn', 'Thời gian', ''].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map(o => {
                  const ob = getOrderStatusBadge(o.orderStatus);
                  const hasIssue = o.voucherCodeStatus === 'Loi sinh ma' || o.orderStatus === 'Cho hoan tien';
                  return (
                    <tr key={o.id} onClick={() => loadDetail(o.id)} className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${hasIssue ? 'bg-amber-50/50' : ''}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-gray-900">
                          {hasIssue && <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />}
                          {o.id}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{o.customerName}</td>
                      <td className="px-4 py-3.5 text-gray-600 max-w-[160px] truncate">{o.voucherName}</td>
                      <td className="px-4 py-3.5 text-gray-600 truncate max-w-[120px]">{o.partnerName}</td>
                      <td className="px-4 py-3.5 font-bold text-gray-900">{o.total.toLocaleString('vi-VN')}đ</td>
                      <td className="px-4 py-3.5">{ob}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                          <Eye size={13} /> Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân trang */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
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
    </div>
  );
}
