import { useState, useEffect } from "react";
import {
  Package,
  ChevronRight,
  QrCode,
  Copy,
  Star,
  MessageSquare,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchCustomerOrders,
  fetchCustomerOrderDetail,
  submitOrderComplaint,
  submitOrderReview,
  customerCancelOrder,
  cancelOrder,
} from "../../../../shared/api/orderApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ORDER_STATUS_CONFIG = {
  "Cho thanh toan": {
    label: "Chờ thanh toán",
    variant: "amber",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  "Da thanh toan": {
    label: "Đã thanh toán",
    variant: "green",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  "Da huy": {
    label: "Đã hủy",
    variant: "gray",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: XCircle,
  },
  "Cho hoan tien": {
    label: "Chờ hoàn tiền",
    variant: "purple",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Clock,
  },
  "Da hoan tien": {
    label: "Đã hoàn tiền",
    variant: "blue",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  "Huy yeu cau hoan tien": {
    label: "Từ chối hoàn tiền",
    variant: "red",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

const codeStatusLabels = {
  pending_issue: "Chờ phát hành",
  issued: "Đã phát hành",
  used: "Đã sử dụng",
  expired: "Hết hạn",
  generation_error: "Lỗi sinh mã",
  disabled: "Vô hiệu hóa",
};

const codeStatusColor = {
  pending_issue: "bg-amber-50 text-amber-600",
  issued: "bg-green-50 text-green-700",
  used: "bg-gray-100 text-gray-500",
  expired: "bg-gray-100 text-gray-400",
  generation_error: "bg-red-100 text-red-600",
  disabled: "bg-red-50 text-red-500",
};

const CANCEL_REASON_OPTIONS = [
  {
    id: "missing-valid-code",
    label: "Chưa nhận được mã hợp lệ",
    reason: "Không nhận được voucher code hợp lệ sau khi thanh toán.",
  },
  {
    id: "invalid-code",
    label: "Mã voucher bị lỗi",
    reason: "Voucher code được cung cấp bị lỗi hoặc không hợp lệ.",
  },
  {
    id: "partner-refused",
    label: "Đối tác từ chối voucher",
    reason: "Đối tác từ chối voucher đang hợp lệ.",
  },
  {
    id: "service-unavailable",
    label: "Không còn cung cấp dịch vụ",
    reason: "Đối tác hoặc chi nhánh áp dụng không còn khả năng cung cấp dịch vụ.",
  },
  {
    id: "benefit-mismatch",
    label: "Quyền lợi không đúng mô tả",
    reason: "Quyền lợi thực tế không đúng với nội dung voucher đã công bố.",
  },
  {
    id: "voucher-specific-policy",
    label: "Theo điều kiện hủy của voucher",
    reason: "Yêu cầu hủy theo điều kiện hoàn/hủy riêng đã được công bố của voucher.",
  },
];

const COMPLAINT_REASON_OPTIONS = [
  {
    id: "missing-code",
    label: "Đã thanh toán nhưng chưa nhận mã",
    reason: "Đã thanh toán thành công nhưng chưa nhận được voucher code.",
  },
  {
    id: "invalid-code",
    label: "Mã voucher không hợp lệ",
    reason: "Voucher code được cấp không hợp lệ hoặc không thể sử dụng.",
  },
  {
    id: "partner-refused",
    label: "Đối tác từ chối voucher",
    reason: "Đối tác từ chối tiếp nhận voucher vẫn còn hiệu lực và đáp ứng điều kiện sử dụng.",
  },
  {
    id: "branch-unavailable",
    label: "Không dùng được tại chi nhánh công bố",
    reason: "Không thể sử dụng voucher tại chi nhánh áp dụng đã được công bố.",
  },
  {
    id: "benefit-mismatch",
    label: "Quyền lợi không đúng nội dung",
    reason: "Quyền lợi thực tế không đúng với nội dung voucher đã công bố.",
  },
  {
    id: "service-unavailable",
    label: "Đối tác không thể cung cấp dịch vụ",
    reason: "Đối tác không còn khả năng cung cấp dịch vụ hoặc quyền lợi của voucher.",
  },
  {
    id: "other-transaction-error",
    label: "Lỗi giao dịch, mã hoặc quyền lợi khác",
    reason: "Phát sinh lỗi khác liên quan đến giao dịch, voucher code hoặc quyền lợi voucher.",
  },
];

const COMPLAINT_STATUS_CONFIG = {
  Moi: { label: "Đã tiếp nhận", color: "bg-amber-50 text-amber-700 border-amber-200" },
  "Dang xu ly": { label: "Đang xác minh", color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Da xu ly": { label: "Đã giải quyết", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Tu choi": { label: "Không đủ điều kiện", color: "bg-red-50 text-red-700 border-red-200" },
};

const COMPLAINT_PROCESS_STEPS = [
  { title: "Đã gửi", description: "Hệ thống tiếp nhận khiếu nại" },
  { title: "Xác minh", description: "Kiểm tra giao dịch, mã và điều kiện sử dụng" },
  { title: "Khắc phục", description: "Gửi lại mã, cấp lại mã hoặc xem xét hoàn tiền" },
  { title: "Hoàn tất", description: "Thông báo kết quả xử lý" },
];

function ComplaintProgress({ complaint }) {
  const { t } = useTranslation();
  const statusConfig = COMPLAINT_STATUS_CONFIG[complaint.status] || {
    label: complaint.status || "Không rõ",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  };
  const completedThrough = complaint.status === "Da xu ly"
    ? 3
    : complaint.status === "Dang xu ly"
      ? 1
      : 0;
  const activeStep = complaint.status === "Moi"
    ? 1
    : complaint.status === "Dang xu ly"
      ? 2
      : complaint.status === "Da xu ly"
        ? 3
        : 1;
  const rejected = complaint.status === "Tu choi";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {complaint.voucherImage ? (
            <img
              src={complaint.voucherImage}
              alt={complaint.voucherName}
              className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-600">
              V
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{complaint.voucherName || t("common.voucher", "Voucher")}</p>
            <p className="mt-0.5 text-xs text-gray-500">
              {t("orders.voucherCodeLabel", "Mã voucher:")} <span className="font-mono font-semibold text-gray-700">{complaint.voucherCode || t("orders.notIssued", "Chưa phát hành")}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400">
              {t("orders.sentAt", "Gửi lúc")} {new Date(complaint.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.color}`}>
          {t(statusConfig.label)}
        </span>
      </div>

      <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs leading-5 text-gray-700">
        {complaint.content}
      </p>

      {rejected && complaint.rejectReason && (
        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          <span className="font-semibold">{t("orders.rejectReasonLabel", "Lý do không tiếp nhận:")}</span> {complaint.rejectReason}
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-4" aria-label={t("orders.complaintProcessLabel", "Quy trình xử lý khiếu nại")}>
        {COMPLAINT_PROCESS_STEPS.map((step, index) => {
          const isComplete = !rejected && index <= completedThrough;
          const isActive = !rejected && index === activeStep;
          const isRejectedStep = rejected && index === 1;
          return (
            <div key={step.title} className="relative flex gap-2 sm:block">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                isComplete
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-4 ring-blue-50"
                    : isRejectedStep
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-400"
              }`}>
                {isComplete ? <CheckCircle2 size={14} /> : isRejectedStep ? <XCircle size={14} /> : index + 1}
              </div>
              <div className="sm:mt-2">
                <p className={`text-xs font-semibold ${isRejectedStep ? "text-red-700" : isComplete || isActive ? "text-gray-900" : "text-gray-400"}`}>
                  {isRejectedStep ? t("orders.notEligible", "Không đủ điều kiện") : t(step.title)}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                  {isRejectedStep ? t("orders.policyNotMet", "Khiếu nại không đáp ứng chính sách") : t(step.description)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] leading-4 text-blue-800">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        <span>{t("orders.priorityPolicyNote", "Thứ tự ưu tiên xử lý: kiểm tra và gửi lại mã hiện có → cấp lại mã nếu cần → hoàn tiền khi không thể khắc phục và đủ điều kiện chính sách.")}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const cfg = ORDER_STATUS_CONFIG[status] || {
    label: status || "Không rõ",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    icon: AlertCircle,
  };
  const Icon = cfg.icon || AlertCircle;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <Icon size={13} />
      {t(cfg.label)}
    </span>
  );
}

export default function CustomerOrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modals
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [selectedComplaintReason, setSelectedComplaintReason] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [selectedVoucherMuaId, setSelectedVoucherMuaId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (showReviewModal && selectedVoucherMuaId && selectedOrder) {
      const code = selectedOrder.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId);
      if (code && code.hasReviewed && code.reviewDetails) {
        setReviewRating(code.reviewDetails.rating);
        setReviewText(code.reviewDetails.content);
      } else {
        setReviewRating(5);
        setReviewText("");
      }
    }
  }, [showReviewModal, selectedVoucherMuaId, selectedOrder]);

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedCancelReason("");
    setCancelReason("");
  };

  const closeComplaintModal = () => {
    if (submittingComplaint) return;
    setShowFeedbackModal(false);
    setSelectedComplaintReason("");
    setFeedbackText("");
  };

  const handleCancelOrder = async () => {
    const selectedOption = CANCEL_REASON_OPTIONS.find((option) => option.id === selectedCancelReason);
    const additionalDetail = cancelReason.trim();

    if (!selectedOption && !additionalDetail) {
      toast.error("Vui lòng chọn một lý do hoặc nhập lý do của bạn.");
      return;
    }

    const reason = selectedOption
      ? `${selectedOption.reason}${additionalDetail ? ` Thông tin bổ sung: ${additionalDetail}` : ""}`
      : additionalDetail;

    try {
      await customerCancelOrder(selectedOrderId, { reason });
      toast.success("Đã gửi yêu cầu hủy đơn, chuyển sang chờ hoàn tiền.");
      closeCancelModal();
      handleSelectOrder(selectedOrderId);
      loadOrders(pagination.page);
    } catch (e) {
      toast.error(e.message || "Không thể gửi yêu cầu hủy đơn");
    }
  };

  // hủy đơn "Chờ thanh toán"
  const handleCancleOrderNoRefund = async () => {
    try {
      await cancelOrder(selectedOrderId);
      toast.success("Đã hủy đơn hàng.");
      handleSelectOrder(selectedOrderId);
    } catch (e) {
      toast.error(e.message || "Không thể hủy đơn hàng");
    }
  };
  const handleRepayOrder = async () => {
    navigate(`/customer/checkout`, {
      state: { orderId: selectedOrderId },
    });
  };

  const loadOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await fetchCustomerOrders(filterStatus, pageNum, 10);
      setOrders(res.orders || []);
      setPagination(
        res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
      );
    } catch (e) {
      toast.error(e.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);

    const handleLangChange = () => {
      loadOrders(pagination.page || 1);
      if (selectedOrderId) {
        handleSelectOrder(selectedOrderId);
      }
    };

    window.addEventListener("app_language_changed", handleLangChange);
    return () => window.removeEventListener("app_language_changed", handleLangChange);
  }, [filterStatus]);

  const handleSelectOrder = async (orderId) => {
    try {
      setSelectedOrderId(orderId);
      setLoadingDetail(true);
      const data = await fetchCustomerOrderDetail(orderId);
      setSelectedOrder(data);
    } catch (e) {
      toast.error(e.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedVoucherMuaId) {
      toast.error("Vui lòng chọn mã voucher để đánh giá.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    try {
      await submitOrderReview(selectedOrderId, {
        maVoucherMua: selectedVoucherMuaId,
        diem: reviewRating,
        noiDung: reviewText,
      });
      toast.success("Đánh giá đã được ghi nhận thành công.", { duration: 2000 });
      setSelectedOrder(prev => {
        const newCodes = prev.codes.map(c => {
          if ((c.id || c.voucherMuaId) === selectedVoucherMuaId) {
            return {
              ...c,
              hasReviewed: true,
              reviewDetails: {
                rating: reviewRating,
                content: reviewText
              }
            };
          }
          return c;
        });
        return { ...prev, codes: newCodes };
      });
      setShowReviewModal(false);
      setReviewText("");
    } catch (e) {
      toast.error(e.message || "Không thể gửi đánh giá", { duration: 2000 });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedVoucherMuaId) {
      toast.error("Vui lòng chọn mã voucher liên quan.");
      return;
    }
    const selectedOption = COMPLAINT_REASON_OPTIONS.find((option) => option.id === selectedComplaintReason);
    const additionalDetail = feedbackText.trim();
    if (!selectedOption && !additionalDetail) {
      toast.error("Vui lòng chọn một lý do hoặc nhập nội dung khiếu nại của bạn.");
      return;
    }
    const content = selectedOption
      ? `${selectedOption.reason}${additionalDetail ? ` Thông tin bổ sung: ${additionalDetail}` : ""}`
      : additionalDetail;
    try {
      setSubmittingComplaint(true);
      await submitOrderComplaint(selectedOrderId, {
        maVoucherMua: selectedVoucherMuaId,
        noiDung: content,
      });
      toast.success("Khiếu nại đã được tiếp nhận. Bạn có thể theo dõi quy trình ngay trong đơn hàng.");
      setShowFeedbackModal(false);
      setSelectedComplaintReason("");
      setFeedbackText("");
      await Promise.all([handleSelectOrder(selectedOrderId), loadOrders(pagination.page)]);
    } catch (e) {
      toast.error(e.message || "Không thể gửi phản ánh");
    } finally {
      setSubmittingComplaint(false);
    }
  };

  if (selectedOrderId) {
    if (loadingDetail) {
      return (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      );
    }
    const order = selectedOrder;
    if (!order) return <div>{t("Không tìm thấy đơn hàng")}</div>;

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="text-sm text-gray-500 mb-4 hover:text-gray-700 flex items-center gap-1 font-medium"
        >
          ← {t("Danh sách đơn hàng")}
        </button>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-base font-bold text-gray-900 font-mono">
              {t("Mã đơn:")} {order.id}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("Ngày đặt:")} {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <div>
            <StatusBadge status={order.displayStatus || order.orderStatus} />
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">
            {t("Voucher đã mua")}
          </h3>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-center mb-3 last:mb-0 pb-3 border-b border-gray-50 last:border-0"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={t(item.voucherName)}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  V
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {t(item.voucherName)}
                </p>
                <p className="text-xs text-gray-400">
                  {t("Đối tác:")} {t(item.partnerName)} · {t("Số lượng:")} ×{item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}đ
              </p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
            <span>{t("Tổng cộng")}</span>
            <span className="text-sky-600">
              {order.total.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
        {order.orderStatus === "Cho thanh toan" && (
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCancleOrderNoRefund}
              className="flex items-center justify-center gap-2 border border-sky-500 bg-sky-50 text-sky-600 hover:bg-sky-100 active:bg-sky-200 py-2.5 px-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Huỷ đơn hàng")}
            </button>
            <button
              onClick={handleRepayOrder}
              className="flex items-center justify-center gap-2 bg-[#1E9EDB] hover:bg-[#1887BC] text-white py-2.5 px-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {t("Thanh toán lại")}
            </button>
          </div>
        )}

        {/* Codes / QR */}
        {order.codes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
            <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <QrCode size={16} /> {t("Mã voucher điện tử (QR / Code)")}
            </h3>
            <div className="space-y-3">
              {order.codes.map((codeObj, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl p-3.5 ${codeObj.status === "generation_error" ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        {t("Mã số voucher")} #{idx + 1}
                      </p>
                      {codeObj.code ? (
                        <p className="font-mono text-base font-bold text-gray-900 tracking-wider">
                          {codeObj.code}
                        </p>
                      ) : (
                        <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                          <AlertCircle size={13} />
                          {t("Lỗi sinh mã hệ thống")}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${codeStatusColor[codeObj.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {t(codeStatusLabels[codeObj.status] || codeObj.status)}
                      </span>
                      {codeObj.code && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(codeObj.code);
                            toast.success(t("Đã sao chép mã voucher!"));
                          }}
                          className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium"
                        >
                          <Copy size={13} /> {t("Sao chép")}
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Status Badges */}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {codeObj.hasReviewed && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] px-2.5 py-1 rounded-md font-semibold border border-green-100">
                        <Star size={12} className="fill-green-700" /> {t("Đã đánh giá")}
                      </span>
                    )}
                    {codeObj.hasComplained && (
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-md font-semibold border ${
                        codeObj.complaintStatus === 'Da xu ly'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        <MessageSquare size={12} /> {t("Khiếu nại:")} {t(COMPLAINT_STATUS_CONFIG[codeObj.complaintStatus]?.label || codeObj.complaintStatus)}
                      </span>
                    )}
                  </div>
                  {codeObj.hasReviewed && codeObj.reviewDetails && (
                    <div className="mt-3 bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                      <div className="flex items-center gap-1 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < codeObj.reviewDetails.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-700 italic">"{codeObj.reviewDetails.content}"</p>
                    </div>
                  )}
                  {codeObj.usedBranch && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      {t("Đã sử dụng tại chi nhánh:")}{" "}
                      <span className="text-gray-900">
                        {codeObj.usedBranch}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracker for Cancel / Refund / Complaints */}
        {(order.cancelRequests?.length > 0 || order.refunds?.length > 0 || order.complaints?.length > 0) && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">{t("Tiến trình xử lý Yêu cầu & Hỗ trợ")}</h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
              {/* Request Phase */}
              {order.cancelRequests?.map(cr => (
                <div key={cr.id} className="relative pl-5">
                  <div className="absolute w-3 h-3 bg-sky-500 rounded-full -left-[7px] top-1.5 border-2 border-white ring-4 ring-sky-50" />
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-gray-800">{t("Khách hàng yêu cầu hủy đơn")}</p>
                    <span className="text-xs text-gray-500">{new Date(cr.requestedAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Lý do: {cr.reason}</p>
                  <p className="text-xs font-medium text-sky-600">{t("Trạng thái:")} {t(cr.status)}</p>
                  {cr.status === 'Da tu choi' && cr.rejectReason && (
                    <div className="mt-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs text-red-700 font-semibold">{t("Admin từ chối")}</p>
                      <p className="text-xs text-red-600">{t("Lý do:")} {t(cr.rejectReason)}</p>
                    </div>
                  )}
                  {cr.status === 'Da chap nhan' && (cr.approvalReason || cr.processingReason) && (
                    <div className="mt-2 p-2.5 bg-green-50 border border-green-100 rounded-lg">
                      <p className="text-xs text-green-700 font-semibold">{t("Admin đã chấp nhận")}</p>
                      <p className="text-xs text-green-600">{t("Lý do:")} {t(cr.approvalReason || cr.processingReason)}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Refund Phase */}
              {order.refunds?.map(rf => (
                <div key={rf.id} className="relative pl-5">
                  <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white ring-4 ${
                    rf.status === 'Thành công' ? 'bg-green-500 ring-green-50' : 
                    rf.status === 'Thất bại' ? 'bg-red-500 ring-red-50' : 
                    'bg-blue-500 ring-blue-50'
                  }`} />
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-gray-800">{t("Xử lý hoàn tiền")} ({rf.gateway})</p>
                    <span className="text-xs text-gray-500">{new Date(rf.processedAt || Date.now()).toLocaleString('vi-VN')}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{t("Số tiền:")} <span className="font-semibold text-gray-800">{rf.amount.toLocaleString('vi-VN')}đ</span></p>
                  <p className="text-xs text-gray-600 mb-1">{t("Ghi chú:")} {t(rf.reason)}</p>
                  <p className={`text-xs font-medium ${
                    rf.status === 'Thành công' ? 'text-green-600' : 
                    rf.status === 'Thất bại' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>{t("Trạng thái:")} {t(rf.status)}</p>
                </div>
              ))}
              {/* Complaints Phase */}
              {order.complaints?.map(cp => (
                <div key={cp.id} className="relative pl-5 mt-4 border-t border-gray-100 pt-4">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-5 border-2 border-white ring-4 ring-blue-50" />
                  <ComplaintProgress complaint={cp} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin/System Cancel/Refund Reason (Fallback) */}
        {order.cancelReason && !order.cancelRequests?.length && !order.refunds?.length && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-xs text-blue-900 space-y-1">
            <p className="font-semibold text-blue-950">
              {t("Ghi chú / Lý do hủy / Phản hồi từ Admin:")}
            </p>
            <p className="text-blue-800">{t(order.cancelReason)}</p>
          </div>
        )}

        {/* Request Cancel / Refund for 'Da thanh toan' orders */}
        {order.orderStatus === "Da thanh toan" && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-xs">
            {order.cancelRequests?.length > 0 ? (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
              >
                <CheckCircle2 size={16} /> {t("Đã gửi yêu cầu hủy đơn")}
              </button>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <XCircle size={16} /> {t("Yêu cầu hủy đơn & Hoàn tiền")}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        {order.orderStatus === "Da thanh toan" && order.codes.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3 shadow-xs">
            {order.codes.every(c => c.hasReviewed) ? (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 text-gray-400 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"
              >
                <CheckCircle2 size={15} /> {t("Đã đánh giá tất cả")}
              </button>
            ) : (
              <button
                onClick={() => {
                  const targetCode = order.codes.find(c => !c.hasReviewed) || order.codes[0];
                  const firstId = targetCode?.id || targetCode?.voucherMuaId || "";
                  setSelectedVoucherMuaId(firstId);
                  setShowReviewModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-sky-300 text-sky-600 py-2.5 rounded-xl text-sm font-medium hover:bg-sky-50 transition-colors"
              >
                <Star size={15} /> {t("Viết đánh giá")}
              </button>
            )}

            {order.codes.every(c => c.hasComplained) ? (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 text-gray-400 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"
              >
                <CheckCircle2 size={15} /> {t("Đã khiếu nại tất cả")}
              </button>
            ) : (
              <button
                onClick={() => {
                  const targetCode = order.codes.find(c => !c.hasComplained) || order.codes[0];
                  const firstId = targetCode?.id || targetCode?.voucherMuaId || "";
                  setSelectedVoucherMuaId(firstId);
                  setShowFeedbackModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={15} /> {t("orders.sendFeedbackBtn", "Gửi phản ánh / khiếu nại")}
              </button>
            )}
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5">
              <h3 className="font-bold text-gray-900 mb-1">{t("Viết đánh giá sản phẩm")}</h3>
              <p className="text-xs text-gray-400 mb-3">{t("Đánh giá chất lượng dịch vụ / voucher đã mua")}</p>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">{t("Chọn mã voucher đánh giá")}</label>
                <select value={selectedVoucherMuaId} onChange={e => setSelectedVoucherMuaId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-xs">
                  {order.codes.map(c => {
                    const vid = c.id || c.voucherMuaId;
                    return (
                      <option key={vid} value={vid}>
                        {c.code} ({t(codeStatusLabels[c.status] || c.status)}) {c.hasReviewed ? ` - ${t("Đã đánh giá")}` : ''}
                      </option>
                    )
                  })}
                </select>
                {(() => {
                  const selectedCode = order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId);
                  const selectedItem = selectedCode ? order.items.find(i => i.voucherId === selectedCode.voucherId) : null;
                  if (!selectedCode || !selectedItem) return null;
                  return (
                    <div className="mt-2 p-2 bg-sky-50/50 border border-sky-100 rounded-lg flex items-center gap-2.5">
                      {selectedItem.image ? (
                        <img src={selectedItem.image} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-sky-100 text-sky-500 flex items-center justify-center text-xs font-bold">V</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{selectedItem.voucherName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{t("Mã:")} <span className="font-mono">{selectedCode.code}</span></p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed) {
                        setReviewRating(i + 1);
                      }
                    }}
                    type="button"
                    disabled={order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed}
                    className={order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed ? 'cursor-not-allowed' : ''}
                  >
                    <Star
                      size={22}
                      className={
                        i < reviewRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed}
                placeholder={t("Nhận xét chi tiết về trải nghiệm sử dụng...")}
                className={`w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 mb-4 ${
                  order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''
                }`}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600"
                >
                  {t("Hủy")}
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white ${
                    order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasReviewed 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-sky-500 hover:bg-sky-600'
                  }`}
                >
                  {t("Gửi đánh giá")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complaint Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" role="presentation">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="complaint-modal-title"
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 id="complaint-modal-title" className="font-bold text-gray-900 text-lg mb-1">
                {t("Gửi khiếu nại voucher")}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t("Chọn vấn đề theo chính sách hoặc mô tả trường hợp riêng của bạn.")}
              </p>

              <div className="mb-4">
                <label htmlFor="complaint-voucher" className="block text-sm font-semibold text-gray-800 mb-1.5">{t("Voucher cần hỗ trợ")}</label>
                <select
                  id="complaint-voucher"
                  value={selectedVoucherMuaId}
                  onChange={e => setSelectedVoucherMuaId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  {order.codes.map(c => {
                    const vid = c.id || c.voucherMuaId;
                    return (
                      <option key={vid} value={vid} disabled={c.hasComplained}>
                        {c.code} ({t(codeStatusLabels[c.status] || c.status)}) {c.hasComplained ? ` - ${t("Đã khiếu nại")}` : ''}
                      </option>
                    )
                  })}
                </select>
                {(() => {
                  const selectedCode = order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId);
                  const selectedItem = selectedCode ? order.items.find(i => i.voucherId === selectedCode.voucherId) : null;
                  if (!selectedCode || !selectedItem) return null;
                  return (
                    <div className="mt-2 p-2 bg-sky-50/50 border border-sky-100 rounded-lg flex items-center gap-2.5">
                      {selectedItem.image ? (
                        <img src={selectedItem.image} className="w-9 h-9 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-sky-100 text-sky-500 flex items-center justify-center text-xs font-bold">V</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{selectedItem.voucherName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{t("Mã:")} <span className="font-mono">{selectedCode.code}</span></p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div role="group" aria-labelledby="complaint-reason-options-label">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p id="complaint-reason-options-label" className="text-sm font-semibold text-gray-800">{t("Vấn đề theo chính sách khiếu nại")}</p>
                  <span className="text-xs text-gray-400">{t("Chọn tối đa 1")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMPLAINT_REASON_OPTIONS.map((option) => {
                    const selected = selectedComplaintReason === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedComplaintReason(selected ? "" : option.id)}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                          selected
                            ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                      >
                        {selected ? "✓ " : ""}{t(option.label)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-semibold text-blue-900">{t("Quy trình sau khi gửi")}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {COMPLAINT_PROCESS_STEPS.map((step, index) => (
                    <div key={step.title} className="rounded-lg bg-white/80 p-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{index + 1}</span>
                      <p className="mt-1 text-[11px] font-semibold text-gray-800">{t(step.title)}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] leading-4 text-blue-800">
                  {t("Khiếu nại được hoàn tiền chỉ khi voucher hợp lệ, chưa sử dụng, không thể khắc phục bằng gửi lại/cấp lại mã và đáp ứng chính sách.")}
                </p>
              </div>

              <label htmlFor="complaint-detail" className="mt-4 mb-2 block text-sm font-semibold text-gray-800">
                {t("Mô tả bổ sung")} <span className="font-normal text-gray-400">{t("(không bắt buộc nếu đã chọn tag)")}</span>
              </label>
              <textarea
                id="complaint-detail"
                rows={3}
                maxLength={1000}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t("Không có tag phù hợp? Hãy mô tả vấn đề. Bạn cũng có thể bổ sung thời gian, chi nhánh hoặc thông tin liên quan cho tag đã chọn...")}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <div className="mt-1 text-right text-[11px] text-gray-400">{feedbackText.length}/1000</div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={closeComplaintModal}
                  disabled={submittingComplaint}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t("Đóng")}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  disabled={
                    submittingComplaint
                    || (!selectedComplaintReason && !feedbackText.trim())
                    || order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasComplained
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white ${
                    submittingComplaint || (!selectedComplaintReason && !feedbackText.trim()) || order.codes.find(c => (c.id || c.voucherMuaId) === selectedVoucherMuaId)?.hasComplained
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-sky-500 hover:bg-sky-600'
                  }`}
                >
                  {submittingComplaint ? <span className="inline-flex items-center gap-2"><Loader2 size={15} className="animate-spin" /> {t("Đang gửi...")}</span> : t("Gửi khiếu nại")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {t("Yêu cầu hủy đơn & Hoàn tiền")}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t("Chọn lý do phù hợp hoặc nhập lý do riêng của bạn bên dưới.")}
              </p>

              <div role="group" aria-labelledby="cancel-reason-options-label">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p id="cancel-reason-options-label" className="text-sm font-semibold text-gray-800">{t("Lý do theo chính sách")}</p>
                  <span className="text-xs text-gray-400">{t("Chọn tối đa 1")}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CANCEL_REASON_OPTIONS.map((option) => {
                    const selected = selectedCancelReason === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedCancelReason(selected ? "" : option.id)}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                          selected
                            ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-sky-300 hover:bg-sky-50/50"
                        }`}
                      >
                        {selected ? "✓ " : ""}{t(option.label)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <p>
                  {t("Yêu cầu được xét duyệt khi voucher chưa sử dụng, còn trong thời hạn hủy và đáp ứng chính sách của voucher hoặc Chính sách Sàn.")}
                </p>
              </div>

              <label htmlFor="cancel-reason-detail" className="mt-4 mb-2 block text-sm font-semibold text-gray-800">
                {t("Thông tin bổ sung")} <span className="font-normal text-gray-400">{t("(không bắt buộc nếu đã chọn tag)")}</span>
              </label>
              <textarea
                id="cancel-reason-detail"
                rows={3}
                maxLength={1000}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={t("Không có tag phù hợp? Hãy nhập lý do của bạn. Bạn cũng có thể bổ sung chi tiết cho tag đã chọn...")}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
              <div className="mt-1 text-right text-[11px] text-gray-400">{cancelReason.length}/1000</div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  {t("Đóng")}
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={!selectedCancelReason && !cancelReason.trim()}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t("Xác nhận gửi")}
                </button>
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
          <Package className="text-sky-500" size={24} /> {t("Đơn hàng của tôi")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("Quản lý và tra cứu trạng thái đơn hàng cùng mã voucher đã mua.")}
        </p>
      </div>

      {/* Filter Tabs matching DB status values */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: "all", label: t("Tất cả") },
          { key: "Cho thanh toan", label: t("Chờ thanh toán") },
          { key: "Da thanh toan", label: t("Đã thanh toán") },
          { key: "Cho hoan tien", label: t("Chờ hoàn tiền") },
          { key: "Da hoan tien", label: t("Đã hoàn tiền") },
          { key: "Da huy", label: t("Đã hủy") },
          { key: "Huy yeu cau hoan tien", label: t("Từ chối hoàn tiền") },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterStatus(f.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${filterStatus === f.key ? "bg-sky-500 text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-sky-500" size={32} />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <Package size={48} className="mb-2 text-gray-300" />
          <p className="text-base font-medium text-gray-600">
            {t("Chưa có đơn hàng nào")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("Các đơn hàng bạn mua sẽ xuất hiện tại đây.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleSelectOrder(order.id)}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 text-left hover:border-sky-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-mono text-sm font-bold text-gray-900">
                    {order.id}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <StatusBadge status={order.displayStatus || order.orderStatus} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {order.items.length}
                  </span>{" "}
                  {t("sản phẩm")} ·{" "}
                  <span className="font-semibold text-gray-900">
                    {order.codes.length}
                  </span>{" "}
                  {t("mã voucher")}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-sky-600">
                    {order.total.toLocaleString("vi-VN")}đ
                  </p>
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
            {t("Trang")} {pagination.page} / {pagination.totalPages} (
            {pagination.total} {t("đơn hàng")})
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadOrders(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              {t("Trước")}
            </button>
            <button
              onClick={() => loadOrders(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              {t("Sau")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
