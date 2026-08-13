import { useEffect, useRef, useState } from "react";
import {
  Search,
  X,
  ArrowLeft,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
  Eye,
  Loader2,
  MessageSquare,
  BellRing,
  ChevronUp,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchAdminOrders,
  fetchAdminOrderDetail,
  fetchAdminOrderLogs,
  approveCancelRequest,
  rejectCancelRequest,
  executeRefund,
  reissueOrderCode,
  openComplaint,
  resendComplaintCode,
  reissueComplaintCode,
  approveComplaintRefund,
  rejectComplaint,
} from "../../../../shared/api/orderApi";

const ORDER_STATUS_CONFIG = {
  'Cho thanh toan': { label: 'Chờ thanh toán', variant: 'amber', dot: true },
  'Da thanh toan': { label: 'Đã thanh toán', variant: 'green', dot: true },
  'Da huy': { label: 'Đã hủy', variant: 'gray' },
  'Cho hoan tien': { label: 'Chờ hoàn tiền', variant: 'purple', dot: true },
  'Da hoan tien': { label: 'Đã hoàn tiền', variant: 'blue', dot: true },
};

const orderStatusLabels = {
  'Cho thanh toan': 'Chờ thanh toán',
  'Da thanh toan': 'Đã thanh toán',
  'Da huy': 'Đã hủy',
  'Cho hoan tien': 'Chờ hoàn tiền',
  'Da hoan tien': 'Đã hoàn tiền',
};

const paymentStatusLabels = {
  'Dang xu ly': 'Đang xử lý',
  'Thanh cong': 'Thành công',
  'That bai': 'Thất bại',
};

const voucherCodeStatusLabels = {
  not_issued: 'Chưa phát hành',
  'Chua su dung': 'Chưa sử dụng',
  'Da su dung': 'Đã sử dụng',
  'Het han': 'Hết hạn',
  'Loi sinh ma': 'Lỗi sinh mã',
  'Vo hieu hoa': 'Vô hiệu hóa',
};

const EMPTY_ACTION_CENTER = { refunds: [], codeErrors: [], complaints: [] };

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function formatDate(value, withTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return withTime ? date.toLocaleString('vi-VN') : date.toLocaleDateString('vi-VN');
}

function formatOrderCode(id) {
  if (!id) return '—';
  if (/^ORD/i.test(id)) return id;
  return `#${id.slice(0, 8).toUpperCase()}`;
}

function formatWaitingTime(value) {
  if (!value) return 'Mới nhận';
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 0) return 'Mới nhận';
  const days = Math.floor(elapsed / 86400000);
  if (days >= 1) return `Chờ ${days} ngày`;
  const hours = Math.max(1, Math.floor(elapsed / 3600000));
  return `Chờ ${hours} giờ`;
}

function ActionCard({ item, tone, label, children }) {
  const tones = {
    red: {
      card: 'border-red-400 bg-red-50/70',
      badge: 'bg-red-100 text-red-600',
      wait: 'bg-amber-100 text-amber-700',
    },
    amber: {
      card: 'border-amber-400 bg-amber-50/70',
      badge: 'bg-amber-100 text-amber-700',
      wait: 'bg-amber-100 text-amber-700',
    },
    purple: {
      card: 'border-purple-400 bg-purple-50/70',
      badge: 'bg-purple-100 text-purple-600',
      wait: 'bg-amber-100 text-amber-700',
    },
  };
  const style = tones[tone] || tones.red;
  const timestamp = item.requestedAt || item.createdAt;

  return (
    <article className={`border-l-4 rounded-r-xl px-4 py-3 ${style.card}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-md px-2 py-1 font-semibold ${style.badge}`}>{label}</span>
            <span className="font-mono font-bold text-gray-700" title={item.orderId}>{formatOrderCode(item.orderId)}</span>
            <span className="text-gray-300">·</span>
            <span className="font-medium text-gray-700">{item.customerName || 'Khách hàng'}</span>
            <span className={`rounded-full px-2 py-1 font-medium ${style.wait}`}>{formatWaitingTime(timestamp)}</span>
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {item.voucherName || 'Voucher'} · {item.partnerName || 'Đối tác'} · {formatCurrency(item.total || item.amount)}
          </p>
          <p className="mt-2 rounded-md bg-white/80 px-3 py-2 text-sm italic text-gray-700">
            “{item.reason || item.content || 'Cần quản trị viên kiểm tra và xử lý.'}”
          </p>
          <p className="mt-2 text-xs text-gray-400">Gửi lúc: {formatDate(timestamp, true)}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:w-28 lg:flex-col">{children}</div>
      </div>
    </article>
  );
}

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
  const [actionCenter, setActionCenter] = useState(EMPTY_ACTION_CENTER);
  const [queueCollapsed, setQueueCollapsed] = useState(false);
  const listRequestRef = useRef(0);

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [voucherCodeStatus, setVoucherCodeStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  // Selected order detail
  const [selectedId, setSelectedId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orderLogs, setOrderLogs] = useState([]);
  const [logsError, setLogsError] = useState(false);

  // Modals & reasons
  const [approveCancelModal, setApproveCancelModal] = useState(false);
  const [rejectCancelModal, setRejectCancelModal] = useState(false);
  const [executeRefundModal, setExecuteRefundModal] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [activeRefundId, setActiveRefundId] = useState(null);
  const [activeVoucherMuaId, setActiveVoucherMuaId] = useState(null);
  const [actionLoading, setActionLoading] = useState('');
  const [reissueModal, setReissueModal] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [complaintRefundModal, setComplaintRefundModal] = useState(false);
  const [complaintRejectModal, setComplaintRejectModal] = useState(false);
  const [complaintReasonInput, setComplaintReasonInput] = useState('');

  const loadOrders = async (pageNum = 1) => {
    const requestId = ++listRequestRef.current;
    try {
      setLoading(true);
      const res = await fetchAdminOrders({
        search: debouncedSearch,
        orderStatus,
        paymentStatus,
        voucherCodeStatus,
        page: pageNum,
        limit: 10,
      });
      if (requestId !== listRequestRef.current) return;
      setOrders(res.orders || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      setTotal(res.total || 0);
      setActionCenter(res.actionCenter || EMPTY_ACTION_CENTER);
    } catch (e) {
      if (requestId === listRequestRef.current) {
        toast.error(e.message || 'Không thể tải dữ liệu đơn hàng. Vui lòng thử lại.');
      }
    } finally {
      if (requestId === listRequestRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    loadOrders(1);
  }, [debouncedSearch, orderStatus, paymentStatus, voucherCodeStatus]);

  const loadDetail = async (id, tab = 'overview') => {
    try {
      setSelectedId(id);
      setSelectedOrder(null);
      setActiveTab(tab);
      setLoadingDetail(true);
      setLogsError(false);
      // Chi tiết được tải trước để backend ghi nhận VIEW_ORDER_DETAIL, sau đó
      // mới lấy log nhằm hiển thị luôn lần kiểm tra vừa thực hiện.
      const data = await fetchAdminOrderDetail(id);
      const logsResult = await fetchAdminOrderLogs(id)
        .then((logs) => ({ logs }))
        .catch(() => ({ error: true }));
      setSelectedOrder(data);
      setOrderLogs(logsResult.logs || []);
      setLogsError(Boolean(logsResult.error));
      return true;
    } catch (e) {
      toast.error(e.message || 'Không thể tải chi tiết đơn hàng');
      setSelectedId(null);
      return false;
    } finally {
      setLoadingDetail(false);
    }
  };

  const refreshCurrentData = async () => {
    const tasks = [loadOrders(pagination.page)];
    if (selectedId) tasks.push(loadDetail(selectedId, activeTab));
    await Promise.all(tasks);
  };

  const handleApproveCancel = async () => {
    if (!reasonInput.trim()) { toast.error('Vui lòng nhập lý do chấp nhận.'); return; }
    try {
      setActionLoading('approve-cancel');
      await approveCancelRequest(activeRequestId, { reason: reasonInput });
      toast.success('Yêu cầu hủy đã được chấp nhận. Đơn hàng đang chờ hoàn tiền.');
      setApproveCancelModal(false);
      setReasonInput('');
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    } finally {
      setActionLoading('');
    }
  };

  const handleRejectCancel = async () => {
    if (!reasonInput.trim()) { toast.error('Vui lòng nhập lý do từ chối.'); return; }
    try {
      setActionLoading('reject-cancel');
      const res = await rejectCancelRequest(activeRequestId, { reason: reasonInput });
      if (res.data?.notificationSent === false) {
        toast.warning('Đã từ chối yêu cầu, nhưng chưa gửi được email thông báo cho khách hàng.');
      } else {
        toast.success('Yêu cầu hủy đơn đã bị từ chối.');
      }
      setRejectCancelModal(false);
      setReasonInput('');
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    } finally {
      setActionLoading('');
    }
  };

  const handleExecuteRefund = async () => {
    try {
      setActionLoading('execute-refund');
      toast.info('Đang gọi Sandbox hoàn tiền...');
      const res = await executeRefund(activeRefundId);
      if (res.data?.outcome === 'thanh_cong') {
        toast.success(`Hoàn tiền thành công qua Sandbox! (Mã GD: ${res.data.refundId})`);
      } else if (res.data?.outcome === 'that_bai') {
        toast.error(`Sandbox từ chối hoàn tiền! (Lý do: ${res.data.responseCode})`);
      } else if (res.data?.outcome === 'can_kiem_tra') {
        toast.warning('Không nhận được phản hồi rõ ràng từ Sandbox. Vui lòng kiểm tra lại sau.');
      } else if (res.data?.outcome === 'khong_ket_noi') {
        toast.warning('Chưa kết nối được Sandbox. Yêu cầu vẫn ở trạng thái Chờ xử lý để có thể thử lại.');
      } else {
        toast.success('Đã gọi API hoàn tiền.');
      }

      setExecuteRefundModal(false);
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    } finally {
      setActionLoading('');
    }
  };

  const handleReissueCode = async () => {
    const voucherMuaId = activeVoucherMuaId
      || selectedOrder?.codes?.find((code) => code.status === 'Loi sinh ma')?.id;
    if (!voucherMuaId) { toast.error('Không tìm thấy mã voucher bị lỗi để cấp lại.'); return; }
    try {
      setActionLoading('reissue-code');
      const res = await reissueOrderCode(selectedId, { maVoucherMua: voucherMuaId });
      if (res.data?.notificationSent === false) {
        toast.warning('Đã cấp mã mới nhưng chưa gửi được email cho khách hàng; không sinh thêm mã khác.');
      } else {
        toast.success('Đã cấp lại và gửi mã voucher mới thành công.');
      }
      setReissueModal(false);
      setActiveVoucherMuaId(null);
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Thao tác thất bại');
    } finally {
      setActionLoading('');
    }
  };

  const handleOpenComplaint = async (complaintId) => {
    if (!window.confirm('Tiếp nhận khiếu nại này và chuyển sang trạng thái Đang xử lý?')) return;
    try {
      setActionLoading(`open-complaint-${complaintId}`);
      await openComplaint(complaintId);
      toast.success('Đã tiếp nhận khiếu nại để xử lý.');
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Không thể tiếp nhận khiếu nại.');
    } finally {
      setActionLoading('');
    }
  };

  const handleResendComplaintCode = async (complaintId) => {
    if (!window.confirm('Gửi lại chính voucher code hiện tại cho khách hàng?')) return;
    try {
      setActionLoading(`resend-complaint-${complaintId}`);
      await resendComplaintCode(complaintId);
      toast.success('Đã gửi lại voucher code hiện tại cho khách hàng.');
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Không thể gửi lại voucher code.');
    } finally {
      setActionLoading('');
    }
  };

  const handleReissueComplaintCode = async (complaintId) => {
    if (!window.confirm('Vô hiệu hóa mã cũ và cấp một voucher code mới cho khách hàng?')) return;
    try {
      setActionLoading(`reissue-complaint-${complaintId}`);
      await reissueComplaintCode(complaintId);
      toast.success('Đã cấp và gửi voucher code mới cho khách hàng.');
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Không thể cấp lại voucher code.');
    } finally {
      setActionLoading('');
    }
  };

  const handleApproveComplaintRefund = async () => {
    if (!complaintReasonInput.trim()) {
      toast.error('Vui lòng nhập lý do hoàn tiền.');
      return;
    }
    try {
      setActionLoading(`refund-complaint-${activeComplaintId}`);
      await approveComplaintRefund(activeComplaintId, { reason: complaintReasonInput.trim() });
      toast.success('Khiếu nại đã được chấp nhận và chuyển sang xử lý hoàn tiền.');
      setComplaintRefundModal(false);
      setComplaintReasonInput('');
      setActiveComplaintId(null);
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Không thể chuyển khiếu nại sang hoàn tiền.');
    } finally {
      setActionLoading('');
    }
  };

  const handleRejectComplaint = async () => {
    if (!complaintReasonInput.trim()) {
      toast.error('Vui lòng nhập lý do từ chối.');
      return;
    }
    try {
      setActionLoading(`reject-complaint-${activeComplaintId}`);
      const res = await rejectComplaint(activeComplaintId, { reason: complaintReasonInput.trim() });
      if (res.data?.notificationSent === false) {
        toast.warning('Đã từ chối khiếu nại, nhưng chưa gửi được email thông báo cho khách hàng.');
      } else {
        toast.success('Đã từ chối khiếu nại.');
      }
      setComplaintRejectModal(false);
      setComplaintReasonInput('');
      setActiveComplaintId(null);
      await refreshCurrentData();
    } catch (e) {
      toast.error(e.message || 'Không thể từ chối khiếu nại.');
    } finally {
      setActionLoading('');
    }
  };

  const openCancelAction = async (item, action) => {
    setActiveRequestId(item.id);
    setReasonInput('');
    if (!await loadDetail(item.orderId, 'refund')) return;
    if (action === 'approve') setApproveCancelModal(true);
    if (action === 'reject') setRejectCancelModal(true);
  };

  const openRefundAction = async (item) => {
    setActiveRefundId(item.id);
    if (await loadDetail(item.orderId, 'refund')) setExecuteRefundModal(true);
  };

  const openReissueAction = async (item) => {
    setActiveVoucherMuaId(item.id);
    if (await loadDetail(item.orderId, 'codes')) setReissueModal(true);
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
    const errorCode = order.codes?.find((code) => code.status === 'Loi sinh ma');
    const canReissue = order.paymentStatus === 'Thanh cong' && Boolean(errorCode);
    const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
    const voucherBadge = getVoucherCodeStatusBadge(order.voucherCodeStatus);
    const activeRefund = order.refunds?.find((refund) => refund.id === activeRefundId) || null;
    const activeGateway = String(activeRefund?.gateway || order.paymentMethod || '').toLowerCase().includes('paypal')
      ? 'PayPal'
      : 'VNPay';
    const refundEndpoint = activeGateway === 'PayPal'
      ? `/v2/payments/captures/${activeRefund?.originalTransactionId || '{CAPTURE_ID}'}/refund`
      : '/merchant_webapi/api/transaction (vnp_Command=refund)';

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
                <span className="text-xs text-gray-500">Đơn hàng</span>
                {getOrderStatusBadge(order.orderStatus)}
                <span className="text-xs text-gray-500 ml-1">Thanh toán</span>
                <StatusBadge label={paymentBadge.label} variant={paymentBadge.variant} />
                <span className="text-xs text-gray-500 ml-1">Voucher code</span>
                <StatusBadge label={voucherBadge.label} variant={voucherBadge.variant} dot={voucherBadge.dot} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canReissue && (
                <button onClick={() => { setActiveVoucherMuaId(errorCode.id); setReissueModal(true); }} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium shadow-xs">
                  Cấp lại mã mới
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
            { id: 'complaints', label: `Khiếu nại (${order.complaints?.length || 0})` },
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
                    { label: 'Tổng tiền thanh toán', value: formatCurrency(order.total) },
                    { label: 'Phương thức thanh toán', value: order.paymentMethod || 'Chưa có giao dịch' },
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
                    {(order.items || []).map((i, idx) => (
                      <div key={idx} className="text-xs text-gray-800 flex justify-between py-1 border-b border-gray-200 last:border-0">
                        <span>{i.voucherName} (×{i.quantity})</span>
                        <span className="font-semibold">{(i.unitPrice * i.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Mã voucher & Trạng thái phát hành từng mã:</p>
                    {(order.codes || []).map((c, idx) => {
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
                (order.paymentHistory || []).map(p => (
                  <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.method} — {p.id}</p>
                      <p className="text-xs text-gray-500">{new Date(p.timestamp).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</p>
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
                (order.codeHistory || []).map(c => (
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
            <div className="space-y-6">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <h4 className="text-sm font-bold text-blue-800">Chính sách / điều kiện voucher</h4>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  {(order.items || []).map((item) => (
                    <p key={item.voucherId}><strong>{item.voucherName}:</strong> {item.terms || 'Chưa cập nhật điều kiện hủy/hoàn tiền riêng.'}</p>
                  ))}
                </div>
              </div>
              {/* Danh sách Yêu cầu hủy */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 border-b pb-2">Yêu cầu hủy đơn</h4>
                {(!order.cancelRequests || order.cancelRequests.length === 0) ? (
                  <p className="text-sm text-gray-400">Không có yêu cầu hủy nào.</p>
                ) : (
                  <div className="space-y-3">
                    {order.cancelRequests.map(cr => (
                      <div key={cr.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-900 font-semibold mb-1">
                            Trạng thái: <StatusBadge label={cr.status} variant={cr.status === 'Da chap nhan' ? 'green' : (cr.status === 'Cho xu ly' ? 'amber' : 'red')} />
                          </p>
                          <p className="text-sm text-gray-700"><strong>Lý do yêu cầu:</strong> {cr.reason}</p>
                          <p className="text-xs text-gray-500 mt-1">Yêu cầu lúc: {new Date(cr.requestedAt).toLocaleString('vi-VN')}</p>
                          {cr.processingReason && (
                            <p className={`text-sm mt-1 ${cr.status === 'Da chap nhan' ? 'text-green-600' : 'text-red-600'}`}>
                              <strong>{cr.status === 'Da chap nhan' ? 'Lý do chấp nhận:' : 'Lý do từ chối:'}</strong> {cr.processingReason}
                            </p>
                          )}
                        </div>
                        {cr.status === 'Cho xu ly' && (
                          <div className="flex gap-2">
                            <button onClick={() => { setReasonInput(''); setActiveRequestId(cr.id); setApproveCancelModal(true); }} className="px-3 py-1.5 bg-green-600 text-white rounded shadow-xs text-sm font-medium hover:bg-green-700">Duyệt</button>
                            <button onClick={() => { setReasonInput(''); setActiveRequestId(cr.id); setRejectCancelModal(true); }} className="px-3 py-1.5 bg-red-600 text-white rounded shadow-xs text-sm font-medium hover:bg-red-700">Từ chối</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách Hoàn tiền */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 border-b pb-2">Tiến trình hoàn tiền (Sandbox)</h4>
                {(!order.refunds || order.refunds.length === 0) ? (
                  <p className="text-sm text-gray-400">Không có giao dịch hoàn tiền nào.</p>
                ) : (
                  <div className="space-y-3">
                    {order.refunds.map(rf => (
                      <div key={rf.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-900 font-semibold mb-1">
                            Trạng thái hoàn: <StatusBadge label={rf.status} variant={rf.status === 'Thanh cong' ? 'green' : (rf.status === 'Cho xu ly' ? 'amber' : 'red')} />
                          </p>
                          <p className="text-sm text-gray-700"><strong>Số tiền:</strong> {formatCurrency(rf.amount)} (Qua {rf.gateway || 'chưa xác định'})</p>
                          <p className="text-sm text-gray-700"><strong>Lý do:</strong> {rf.reason}</p>
                          <p className="text-xs text-gray-500 mt-1"><strong>Giao dịch gốc:</strong> <span className="font-mono">{rf.originalTransactionId || rf.paymentId || 'Không có'}</span>{rf.paymentAt ? ` · ${formatDate(rf.paymentAt, true)}` : ''}</p>
                          <p className="text-xs text-gray-500 mt-1">Nguồn: {rf.nguon} {rf.processedAt ? `| Xử lý lúc: ${new Date(rf.processedAt).toLocaleString('vi-VN')}` : ''}</p>
                          {rf.maGdHoan && <p className="text-xs text-blue-600 font-mono mt-1">Mã hoàn Sandbox: {rf.maGdHoan}</p>}
                          {rf.responseCode && <p className="text-xs text-gray-500 font-mono mt-1">Mã phản hồi: {rf.responseCode}</p>}
                        </div>
                        {rf.status === 'Cho xu ly' && (
                          <div className="flex gap-2">
                            <button onClick={() => { setActiveRefundId(rf.id); setExecuteRefundModal(true); }} className="px-3 py-1.5 bg-blue-600 text-white rounded shadow-xs text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
                              <RefreshCw size={14} /> Thực hiện hoàn tiền
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
                <h4 className="flex items-center gap-2 text-sm font-bold text-purple-800">
                  <MessageSquare size={16} /> Xử lý khiếu nại trong đơn hàng
                </h4>
                <p className="mt-1 text-xs leading-5 text-purple-700">
                  Kiểm tra thông tin đơn, thanh toán, voucher code và chọn phương án xử lý ngay tại từng khiếu nại bên dưới.
                </p>
              </div>
              {(!order.complaints || order.complaints.length === 0) ? (
                <p className="py-6 text-center text-sm text-gray-400">Đơn hàng chưa có khiếu nại/phản ánh.</p>
              ) : (
                order.complaints.map((complaint) => {
                  const complaintCode = order.codes?.find((code) => code.id === complaint.voucherPurchaseId) || null;
                  const codeBadge = getVoucherCodeStatusBadge(complaintCode?.status);
                  const relatedRefund = order.refunds?.find((refund) => refund.maKhieuNai === complaint.id) || null;
                  const isLocked = complaint.status === 'Da xu ly' || complaint.status === 'Tu choi';
                  const isProcessing = Boolean(actionLoading);
                  const canResendCode = complaint.status === 'Dang xu ly'
                    && complaintCode?.status === 'Chua su dung'
                    && order.orderStatus === 'Da thanh toan';
                  const canReissueCode = complaint.status === 'Dang xu ly'
                    && ['Loi sinh ma', 'Het han', 'Vo hieu hoa'].includes(complaintCode?.status)
                    && order.orderStatus === 'Da thanh toan';
                  const canRequestRefund = complaint.status === 'Dang xu ly'
                    && Boolean(complaintCode)
                    && complaintCode?.status !== 'Da su dung'
                    && order.orderStatus === 'Da thanh toan'
                    && !relatedRefund;

                  return (
                    <article key={complaint.id} className="overflow-hidden rounded-xl border border-purple-100 bg-white">
                      <div className="border-b border-purple-100 bg-purple-50/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-700">{complaint.id}</span>
                            <StatusBadge
                              label={complaint.status === 'Moi' ? 'Mới' : complaint.status === 'Dang xu ly' ? 'Đang xử lý' : complaint.status === 'Da xu ly' ? 'Đã xử lý' : 'Từ chối'}
                              variant={complaint.status === 'Da xu ly' ? 'green' : complaint.status === 'Tu choi' ? 'red' : complaint.status === 'Moi' ? 'amber' : 'purple'}
                            />
                          </div>
                          <span className="text-xs text-gray-400">Gửi lúc {formatDate(complaint.createdAt, true)}</span>
                        </div>
                        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm italic text-gray-700">“{complaint.content}”</p>
                        {complaint.rejectReason && <p className="mt-2 text-sm text-red-600"><strong>Lý do từ chối:</strong> {complaint.rejectReason}</p>}
                      </div>

                      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Voucher code liên quan</p>
                            <code className="mt-1 block break-all font-mono text-xs font-bold text-blue-600">{complaintCode?.code || 'Chưa có mã hợp lệ'}</code>
                            <div className="mt-2"><StatusBadge label={codeBadge.label} variant={codeBadge.variant} dot={codeBadge.dot} /></div>
                            <p className="mt-2 text-xs text-gray-500">Loại: <strong>Khiếu nại voucher code</strong></p>
                          </div>
                          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Người xử lý</p>
                            <p className="mt-1 break-all text-xs font-semibold text-gray-700">{complaint.handlerId || 'Chưa tiếp nhận'}</p>
                            <p className="mt-2 text-xs text-gray-500">Thanh toán: <strong>{paymentBadge.label}</strong></p>
                          </div>
                        </div>

                        <div className="flex min-w-[190px] flex-wrap gap-2 lg:flex-col">
                          {relatedRefund ? (
                            <>
                              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                                Đã chuyển sang hoàn tiền · {relatedRefund.status}
                              </div>
                              <button
                                onClick={() => { setActiveRefundId(relatedRefund.id); setActiveTab('refund'); }}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                <RefreshCw size={13} /> Mở tiến trình hoàn tiền
                              </button>
                            </>
                          ) : isLocked ? (
                            <span className="rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-500">Đã hoàn tất xử lý</span>
                          ) : (
                            <>
                              {complaint.status === 'Moi' && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleOpenComplaint(complaint.id)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {actionLoading === `open-complaint-${complaint.id}` ? <Loader2 size={13} className="animate-spin" /> : <MessageSquare size={13} />}
                                  {actionLoading === `open-complaint-${complaint.id}` ? 'Đang tiếp nhận...' : 'Mở & tiếp nhận'}
                                </button>
                              )}
                              {canResendCode && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleResendComplaintCode(complaint.id)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  {actionLoading === `resend-complaint-${complaint.id}` ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                                  {actionLoading === `resend-complaint-${complaint.id}` ? 'Đang gửi lại...' : 'Gửi lại mã hiện tại'}
                                </button>
                              )}
                              {canReissueCode && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleReissueComplaintCode(complaint.id)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                >
                                  {actionLoading === `reissue-complaint-${complaint.id}` ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                                  {actionLoading === `reissue-complaint-${complaint.id}` ? 'Đang cấp mã...' : 'Cấp mã mới'}
                                </button>
                              )}
                              {canRequestRefund && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => { setComplaintReasonInput(''); setActiveComplaintId(complaint.id); setComplaintRefundModal(true); }}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                >
                                  <RefreshCw size={13} /> Chấp nhận & hoàn tiền
                                </button>
                              )}
                              <button
                                disabled={isProcessing}
                                onClick={() => { setComplaintReasonInput(''); setActiveComplaintId(complaint.id); setComplaintRejectModal(true); }}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                <X size={13} /> Từ chối khiếu nại
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'log' && (
            <div className="space-y-3">
              {logsError ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Không thể tải nhật ký kiểm tra của đơn hàng. Dữ liệu đơn hàng phía trên vẫn được giữ nguyên.
                </div>
              ) : orderLogs.length === 0 ? (
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

        {/* Modals UC-ADM-05 / 06 */}
        {approveCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Duyệt Yêu Cầu Hủy</h3>
              <p className="text-sm text-gray-500">Chấp nhận yêu cầu hủy sẽ chuyển đơn hàng sang trạng thái Chờ hoàn tiền.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do chấp nhận (Bắt buộc)</label>
                <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button disabled={Boolean(actionLoading)} onClick={() => { setApproveCancelModal(false); setReasonInput(''); }} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
                <button disabled={Boolean(actionLoading)} onClick={handleApproveCancel} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                  {actionLoading === 'approve-cancel' ? 'Đang xử lý...' : 'Duyệt yêu cầu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {rejectCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-lg text-gray-900">Từ Chối Yêu Cầu Hủy</h3>
              <p className="text-sm text-gray-500">Từ chối sẽ giữ nguyên đơn hàng.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Lý do từ chối (Bắt buộc)</label>
                <textarea rows={3} value={reasonInput} onChange={e => setReasonInput(e.target.value)} placeholder="Nhập lý do từ chối..." className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button disabled={Boolean(actionLoading)} onClick={() => { setRejectCancelModal(false); setReasonInput(''); }} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
                <button disabled={Boolean(actionLoading)} onClick={handleRejectCancel} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                  {actionLoading === 'reject-cancel' ? 'Đang xử lý...' : 'Từ chối yêu cầu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {executeRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Xác nhận hoàn tiền qua {activeGateway}</h3>
                  <p className="mt-1 text-sm text-gray-500">Merchant gửi yêu cầu Refund API trực tiếp đến cổng thanh toán.</p>
                </div>
                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">SANDBOX</span>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm">
                <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2">
                  <span className="text-gray-500">Gateway</span>
                  <strong className="text-blue-700">{activeGateway} Sandbox</strong>
                  <span className="text-gray-500">Hình thức</span>
                  <span className="font-medium text-gray-800">Server-to-server Refund API</span>
                  <span className="text-gray-500">Endpoint</span>
                  <code className="break-all text-xs font-semibold text-gray-800">{refundEndpoint}</code>
                  <span className="text-gray-500">Giao dịch gốc</span>
                  <code className="break-all text-xs font-semibold text-gray-800">{activeRefund?.originalTransactionId || 'Chưa có mã giao dịch gốc'}</code>
                  <span className="text-gray-500">Số tiền hoàn</span>
                  <strong className="text-gray-900">{formatCurrency(activeRefund?.amount)}</strong>
                  <span className="text-gray-500">Lý do</span>
                  <span className="text-gray-800">{activeRefund?.reason || 'Không có'}</span>
                </div>
              </div>

              <p className="text-xs leading-5 text-gray-500">Refund không mở lại trang checkout như lúc khách thanh toán. Sau khi xác nhận, backend sẽ gọi đúng API Sandbox, lưu mã refund/mã phản hồi và chỉ vô hiệu hóa voucher khi gateway báo thành công.</p>
              <div className="flex justify-end gap-2 pt-2">
                <button disabled={Boolean(actionLoading)} onClick={() => setExecuteRefundModal(false)} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
                <button disabled={Boolean(actionLoading)} onClick={handleExecuteRefund} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {actionLoading === 'execute-refund' ? `Đang gọi ${activeGateway} Sandbox...` : `Gửi yêu cầu đến ${activeGateway} Sandbox`}
                </button>
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
                <button disabled={Boolean(actionLoading)} onClick={() => { setReissueModal(false); setActiveVoucherMuaId(null); }} className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
                <button disabled={Boolean(actionLoading)} onClick={handleReissueCode} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 disabled:opacity-50">
                  {actionLoading === 'reissue-code' ? 'Đang cấp lại...' : 'Xác nhận cấp lại'}
                </button>
              </div>
            </div>
          </div>
        )}

        {complaintRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900">Chấp nhận khiếu nại & hoàn tiền</h3>
              <p className="text-sm leading-5 text-gray-500">
                Hệ thống sẽ chuyển đơn sang Chờ hoàn tiền và tạo bản ghi hoàn tiền Chờ xử lý. Khiếu nại chỉ hoàn tất sau khi Sandbox hoàn tiền thành công.
              </p>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Lý do hoàn tiền (Bắt buộc)</label>
                <textarea
                  rows={3}
                  value={complaintReasonInput}
                  onChange={(event) => setComplaintReasonInput(event.target.value)}
                  placeholder="Nhập căn cứ chấp nhận khiếu nại..."
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  disabled={Boolean(actionLoading)}
                  onClick={() => { setComplaintRefundModal(false); setComplaintReasonInput(''); setActiveComplaintId(null); }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  disabled={Boolean(actionLoading)}
                  onClick={handleApproveComplaintRefund}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {actionLoading === `refund-complaint-${activeComplaintId}` ? 'Đang chuyển...' : 'Xác nhận chuyển hoàn tiền'}
                </button>
              </div>
            </div>
          </div>
        )}

        {complaintRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900">Từ chối khiếu nại</h3>
              <p className="text-sm text-gray-500">Khách hàng sẽ nhận được lý do từ chối này. Đơn hàng, thanh toán và voucher code được giữ nguyên.</p>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Lý do từ chối (Bắt buộc)</label>
                <textarea
                  rows={3}
                  value={complaintReasonInput}
                  onChange={(event) => setComplaintReasonInput(event.target.value)}
                  placeholder="Nhập lý do từ chối khiếu nại..."
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  disabled={Boolean(actionLoading)}
                  onClick={() => { setComplaintRejectModal(false); setComplaintReasonInput(''); setActiveComplaintId(null); }}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  disabled={Boolean(actionLoading)}
                  onClick={handleRejectComplaint}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === `reject-complaint-${activeComplaintId}` ? 'Đang từ chối...' : 'Xác nhận từ chối'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  const refundQueue = actionCenter.refunds || [];
  const codeErrorQueue = actionCenter.codeErrors || [];
  const complaintQueue = actionCenter.complaints || [];
  const queueTotal = refundQueue.length + codeErrorQueue.length + complaintQueue.length;

  const resetFilters = () => {
    setSearch('');
    setOrderStatus('');
    setPaymentStatus('');
    setVoucherCodeStatus('');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-gray-500">{total} đơn hàng phù hợp</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
            <RefreshCw size={13} /> {refundQueue.length} chờ hoàn
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <AlertTriangle size={13} /> {codeErrorQueue.length} lỗi mã
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-600">
            <MessageSquare size={13} /> {complaintQueue.length} khiếu nại
          </span>
        </div>
      </div>

      <section className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <button
          type="button"
          onClick={() => setQueueCollapsed((value) => !value)}
          className="flex w-full flex-wrap items-center gap-2 bg-blue-600 px-4 py-3 text-left text-white sm:gap-3"
          aria-expanded={!queueCollapsed}
        >
          <BellRing size={17} className="text-yellow-300" />
          <span className="font-semibold">Hộp xử lý</span>
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold">{refundQueue.length} hoàn tiền</span>
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950">{codeErrorQueue.length} lỗi mã</span>
          <span className="rounded-full bg-purple-400 px-2 py-0.5 text-xs font-bold">{complaintQueue.length} khiếu nại</span>
          <ChevronUp size={16} className={`ml-auto transition-transform ${queueCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {!queueCollapsed && (
          <div>
            {loading && queueTotal === 0 ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
                <Loader2 size={18} className="animate-spin text-blue-600" /> Đang tải hộp xử lý...
              </div>
            ) : queueTotal === 0 ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-emerald-600">
                Không có vấn đề đang chờ xử lý.
              </div>
            ) : (
              <>
                {refundQueue.length > 0 && (
                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-red-600"><RefreshCw size={15} /> Yêu cầu hủy / hoàn tiền ({refundQueue.length})</h2>
                      <span className="text-xs text-gray-400">Cần duyệt hoặc thực hiện hoàn tiền</span>
                    </div>
                    <div className="space-y-3">
                      {refundQueue.map((item) => (
                        <ActionCard key={`${item.type}-${item.id}`} item={item} tone="red" label={item.type === 'refund' ? (item.status === 'Can kiem tra' ? 'Cần kiểm tra' : item.status === 'Dang xu ly' ? 'Đang hoàn tiền' : 'Chờ hoàn tiền') : 'Yêu cầu hủy'}>
                          <button onClick={() => loadDetail(item.orderId, 'refund')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><ExternalLink size={13} /> Xem đơn</button>
                          {item.type === 'cancel_request' ? (
                            <>
                              <button onClick={() => openCancelAction(item, 'approve')} className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><RefreshCw size={13} /> Chấp nhận</button>
                              <button onClick={() => openCancelAction(item, 'reject')} className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"><X size={13} /> Từ chối</button>
                            </>
                          ) : item.status === 'Cho xu ly' ? (
                            <button onClick={() => openRefundAction(item)} className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><RefreshCw size={13} /> Hoàn tiền</button>
                          ) : (
                            <span className="rounded-lg bg-red-100 px-3 py-2 text-center text-xs font-semibold text-red-600">{item.status === 'Can kiem tra' ? 'Đối soát cổng' : 'Đang xử lý'}</span>
                          )}
                        </ActionCard>
                      ))}
                    </div>
                  </div>
                )}

                {codeErrorQueue.length > 0 && (
                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-amber-600"><AlertTriangle size={15} /> Lỗi sinh mã ({codeErrorQueue.length})</h2>
                      <span className="text-xs text-gray-400">Cấp lại mã cho khách hàng</span>
                    </div>
                    <div className="space-y-3">
                      {codeErrorQueue.map((item) => (
                        <ActionCard key={item.id} item={item} tone="amber" label="Lỗi sinh mã">
                          <button onClick={() => loadDetail(item.orderId, 'codes')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><ExternalLink size={13} /> Xem đơn</button>
                          <button onClick={() => openReissueAction(item)} className="inline-flex items-center justify-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"><RotateCcw size={13} /> Cấp lại mã</button>
                        </ActionCard>
                      ))}
                    </div>
                  </div>
                )}

                {complaintQueue.length > 0 && (
                  <div className="px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h2 className="flex items-center gap-2 text-sm font-bold text-purple-600"><MessageSquare size={15} /> Khiếu nại / Phản ánh ({complaintQueue.length})</h2>
                      <span className="text-xs text-gray-400">Xem xét và phản hồi khách hàng</span>
                    </div>
                    <div className="space-y-3">
                      {complaintQueue.map((item) => (
                        <ActionCard key={item.id} item={item} tone="purple" label={item.status === 'Moi' ? 'Khiếu nại mới' : 'Đang xử lý'}>
                          <button onClick={() => loadDetail(item.orderId, 'overview')} className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><ExternalLink size={13} /> Xem đơn</button>
                          <button onClick={() => loadDetail(item.orderId, 'complaints')} className="inline-flex items-center justify-center gap-1 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"><MessageSquare size={13} /> Xử lý trong đơn</button>
                        </ActionCard>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

      <section className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input aria-label="Tìm đơn hàng" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Mã đơn / tên khách..." className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <select aria-label="Lọc trạng thái đơn" value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">Tất cả trạng thái đơn</option>
            {Object.entries(orderStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select aria-label="Lọc trạng thái thanh toán" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">Tất cả thanh toán</option>
            {Object.entries(paymentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select aria-label="Lọc trạng thái voucher code" value={voucherCodeStatus} onChange={(event) => setVoucherCodeStatus(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">Tất cả trạng thái mã</option>
            {Object.entries(voucherCodeStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">{loading ? 'Đang cập nhật...' : `${total} đơn hàng`}</p>
          <button onClick={resetFilters} className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"><X size={14} /> Đặt lại</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs" aria-busy={loading}>
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-blue-600" size={30} /></div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <ShoppingCart size={40} className="mb-2 text-gray-300" />
            <p className="text-sm font-medium text-gray-600">Không có dữ liệu đơn hàng phù hợp.</p>
            <button onClick={resetFilters} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700">Xóa bộ lọc</button>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}>
            <table className="w-full min-w-[1040px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {['Mã đơn', 'Khách hàng', 'Voucher · Đối tác', 'Tổng tiền', 'Trạng thái', 'Vấn đề', 'Ngày tạo', ''].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {orders.map((order) => {
                  const payment = getPaymentStatusBadge(order.paymentStatus);
                  const voucher = getVoucherCodeStatusBadge(order.voucherCodeStatus);
                  const isRefund = Boolean(order.pendingCancelRequest || order.pendingRefund || order.orderStatus === 'Cho hoan tien');
                  const isCodeError = order.voucherCodeStatus === 'Loi sinh ma';
                  const isComplaint = order.hasActiveComplaint;
                  const hasIssue = isRefund || isCodeError || isComplaint;
                  const rowTone = isRefund ? 'border-red-400 bg-red-50/30' : isCodeError ? 'border-amber-400 bg-amber-50/30' : isComplaint ? 'border-purple-400 bg-purple-50/30' : 'border-transparent';

                  return (
                    <tr key={order.id} onClick={() => loadDetail(order.id, order.hasActiveComplaint ? 'complaints' : 'overview')} className={`cursor-pointer border-l-4 transition-colors hover:bg-blue-50/60 ${rowTone}`}>
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-700" title={order.id}>{formatOrderCode(order.id)}</td>
                      <td className="px-4 py-3.5 font-medium text-gray-800">{order.customerName}</td>
                      <td className="max-w-[230px] px-4 py-3.5">
                        <p className="truncate font-medium text-gray-700">{order.voucherName}</p>
                        <p className="truncate text-xs text-gray-400">{order.partnerName}</p>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-800">{formatCurrency(order.total)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2">
                          {getOrderStatusBadge(order.orderStatus)}
                          <div className="space-y-0.5 whitespace-nowrap text-[10px] text-gray-400">
                            <p>TT: <span className="font-semibold text-gray-600">{payment.label}</span></p>
                            <p>Mã: <span className="font-semibold text-gray-600">{voucher.label}</span></p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1.5">
                          {isRefund && <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold text-red-600"><RefreshCw size={11} /> Chờ hoàn tiền</span>}
                          {isCodeError && <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold text-amber-600"><AlertTriangle size={11} /> Lỗi sinh mã</span>}
                          {isComplaint && <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold text-purple-600"><MessageSquare size={11} /> Khiếu nại</span>}
                          {!hasIssue && <span className="text-xs text-gray-300">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"><Eye size={13} /> Xem</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <p className="text-sm text-gray-500">Trang {pagination.page} / {pagination.totalPages} ({pagination.total} đơn hàng)</p>
            <div className="flex gap-2">
              <button onClick={() => loadOrders(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Trước</button>
              <button onClick={() => loadOrders(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Sau</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
