/**
 * FILE: frontend/src/features/core-access/pages/customer/IssuedVoucherDetailPage.jsx
 * PURPOSE: BR-CUS-07 — Chi tiết voucher đã mua.
 *
 * Hiển thị đầy đủ theo spec:
 *  - Mã voucher (font mono)
 *  - Mã QR mô phỏng (canvas QR code thật từ thư viện qrcode)
 *  - Thời hạn sử dụng
 *  - Chi nhánh áp dụng
 *  - Tên đối tác, điều kiện sử dụng
 *  - Trạng thái sử dụng
 *  - Link đến "Đơn hàng của tôi" (A7 fallback)
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ShoppingBag,
  RefreshCw,
  Building2,
  Star,
  MessageSquare,
} from "lucide-react";
import { getIssuedVoucherDetail } from "../../../../shared/api/issuedVoucherApi";
import QrCodeDisplay from "../../component/QRCodeDisplay";
import ReviewForm from "../../../content-feedback/components/ReviewForm";
import FeedbackForm from "../../../content-feedback/components/FeedbackForm";
import { useReview } from "../../../content-feedback/hooks/useReview";
import { useFeedback } from "../../../content-feedback/hooks/useFeedback";
import { reviewApi } from "../../../content-feedback/api/reviewApi";
import { feedbackApi } from "../../../content-feedback/api/feedbackApi";
import { toast } from "sonner";

function StatusBadge({ status }) {
  const configs = {
    "Chua su dung": {
      icon: <Clock className="w-4 h-4" />,
      label: "Chưa sử dụng",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-300",
    },
    "Da su dung": {
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Đã sử dụng",
      cls: "bg-slate-100 text-slate-500 border-slate-300",
    },
    "Het han": {
      icon: <XCircle className="w-4 h-4" />,
      label: "Hết hạn",
      cls: "bg-red-50 text-red-600 border-red-300",
    },
    "Loi sinh ma": {
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Lỗi phát hành",
      cls: "bg-orange-50 text-orange-600 border-orange-300",
    },
  };
  const cfg = configs[status] || {
    icon: <AlertCircle className="w-4 h-4" />,
    label: status || "Không xác định",
    cls: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-slate-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function IssuedVoucherDetailPage() {
  const { issuedId } = useParams();
  const navigate = useNavigate();
  const [vm, setVm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);

  const { create: createReview } = useReview();
  const { create: createFeedback } = useFeedback();

  const handleSubmitReview = async (reviewData) => {
    try {
      await createReview({ ...reviewData, ma_voucher_mua: issuedId });
      setShowReviewModal(false);
      toast.success('Đã gửi đánh giá!');
      // Refresh existing review
      reviewApi.getByPurchaseId(issuedId)
        .then((rev) => setExistingReview(rev))
        .catch(() => {});
    } catch (err) {
      toast.error(err.message || 'Gửi đánh giá thất bại');
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await createFeedback({ ...feedbackData, ma_voucher_mua: issuedId });
      setShowFeedbackModal(false);
      toast.success('Đã gửi phản ánh!');
      feedbackApi.getByPurchaseId(issuedId)
        .then((fb) => setExistingFeedback(fb))
        .catch(() => {});
    } catch (err) {
      toast.error(err.message || 'Gửi phản ánh thất bại');
    }
  };

  useEffect(() => {
    if (!issuedId) return;
    setLoading(true);
    setError(null);
    getIssuedVoucherDetail(issuedId)
      .then((data) => setVm(data))
      .catch((err) =>
        setError(err.message || "Không thể tải thông tin voucher.")
      )
      .finally(() => setLoading(false));

    reviewApi.getByPurchaseId(issuedId)
      .then((rev) => setExistingReview(rev))
      .catch(() => setExistingReview(null));

    feedbackApi.getByPurchaseId(issuedId)
      .then((fb) => setExistingFeedback(fb))
      .catch(() => setExistingFeedback(null));
  }, [issuedId]);

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center py-24 gap-3">
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="text-sm text-slate-500">Đang tải thông tin voucher...</p>
      </div>
    );
  }

  // Error (E2.3)
  if (error || !vm) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">
          Không thể tải voucher
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {error || "Không tìm thấy voucher này."}
        </p>
        {/* A7.3 — Hướng dẫn truy cập "Đơn hàng của tôi" */}
        <p className="text-xs text-slate-400 mb-4">
          Voucher của bạn vẫn được lưu. Bạn có thể xem lại tại mục "Đơn hàng của tôi".
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/customer/orders")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600"
          >
            <ShoppingBag className="w-4 h-4" />
            Xem đơn hàng của tôi
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const v = vm.voucher || {};
  const branches = vm.applicableBranches || [];
  const issuedAt = vm.thoi_gian_sinh_ma
    ? new Date(vm.thoi_gian_sinh_ma).toLocaleString("vi-VN")
    : "—";
  const validUntil = v.tg_ket_thuc_ban
    ? new Date(v.tg_ket_thuc_ban).toLocaleDateString("vi-VN")
    : "—";
  const validFrom = v.tg_bat_dau_ban
    ? new Date(v.tg_bat_dau_ban).toLocaleDateString("vi-VN")
    : null;
  const qrValue = vm.gia_tri_qr_mo_phong || `ECQR:${vm.voucher_code}`;
  const isDone = vm.trang_thai === "Da su dung";

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>

      {/* Header card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 mb-4 text-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            {v.hinh_anh_url ? (
              <img
                src={v.hinh_anh_url}
                alt={v.ten_voucher}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Ticket className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg leading-tight truncate">
              {v.ten_voucher || "Voucher"}
            </p>
            <p className="text-sm text-orange-100 mt-0.5">
              {vm.partnerName || "Đối tác"}
            </p>
            <div className="mt-2">
              <StatusBadge status={vm.trang_thai} />
            </div>
          </div>
        </div>
      </div>

      {/* QR Code — luồng cơ bản bước 5 (hiển thị mã QR mô phỏng) */}
      {!isDone && (
        <div className="mb-4">
          <QrCodeDisplay
            value={qrValue}
            size={220}
            title="Mã QR Voucher"
            subtitle="Đưa mã này cho nhân viên tại quầy để sử dụng"
            showDownload={true}
          />
        </div>
      )}

      {/* Thông tin chi tiết */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 mb-4 shadow-sm">
        {/* Mã code */}
        <div className="py-4 border-b border-slate-100">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1.5">
            Mã Voucher
          </p>
          <p className="font-mono font-bold text-lg text-orange-600 tracking-widest">
            {vm.voucher_code}
          </p>
        </div>

        <InfoRow
          icon={<Calendar className="w-4 h-4" />}
          label="Thời hạn sử dụng"
          value={
            validFrom ? `${validFrom} → ${validUntil}` : `Đến ${validUntil}`
          }
        />
        <InfoRow
          icon={<Clock className="w-4 h-4" />}
          label="Thời gian phát hành"
          value={issuedAt}
        />
        <InfoRow
          icon={<FileText className="w-4 h-4" />}
          label="Điều kiện sử dụng"
          value={v.dieu_kien_ap_dung || "Áp dụng tại các chi nhánh được chỉ định."}
        />
        {vm.mo_ta && (
          <InfoRow
            icon={<FileText className="w-4 h-4" />}
            label="Mô tả"
            value={v.mo_ta}
          />
        )}

        {/* Thông tin khi đã sử dụng */}
        {isDone && vm.ngay_su_dung && (
          <InfoRow
            icon={<CheckCircle2 className="w-4 h-4 text-slate-400" />}
            label="Ngày sử dụng"
            value={new Date(vm.ngay_su_dung).toLocaleString("vi-VN")}
          />
        )}
      </div>

      {/* Chi nhánh áp dụng — luồng cơ bản bước 8 */}
      {branches.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-slate-800">
              Chi nhánh áp dụng ({branches.length})
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {branches.map((b, idx) => (
              <div
                key={b.branchId || idx}
                className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl"
              >
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {b.branchName}
                  </p>
                  {b.address && (
                    <p className="text-xs text-slate-400 truncate">{b.address}</p>
                  )}
                  {b.area && (
                    <p className="text-xs text-orange-500">{b.area}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {existingReview ? (
          <button
            onClick={() => setShowViewReviewModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 border border-amber-200 text-sm font-medium rounded-xl hover:bg-amber-100 transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            Xem đánh giá của bạn
          </button>
        ) : (
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-600 border border-orange-200 text-sm font-medium rounded-xl hover:bg-orange-100 transition-colors"
          >
            <Star className="w-4 h-4" />
            Viết đánh giá
          </button>
        )}
        {existingFeedback ? (
          <button
            onClick={() => setShowViewFeedbackModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 border border-purple-200 text-sm font-medium rounded-xl hover:bg-purple-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            Xem phản ánh của bạn
          </button>
        ) : (
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Gửi phản ánh/khiếu nại
          </button>
        )}
        <button
          onClick={() => navigate("/customer/vouchers/my")}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <Ticket className="w-4 h-4" />
          Xem tất cả voucher của tôi
        </button>
        <button
          onClick={() => navigate("/customer/orders")}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Lịch sử đơn hàng
        </button>
      </div>

      {/* Modals */}
      {showReviewModal && <ReviewForm onSubmit={handleSubmitReview} onCancel={() => setShowReviewModal(false)} />}
      {showFeedbackModal && <FeedbackForm onSubmit={handleSubmitFeedback} onCancel={() => setShowFeedbackModal(false)} />}
      {showViewReviewModal && existingReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              Đánh giá của bạn
            </h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= (existingReview.rating || 5) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
              ))}
              <span className="text-sm font-semibold text-slate-700 ml-2">{existingReview.rating} / 5 sao</span>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
              {existingReview.comment || "Không có nội dung."}
            </p>
            <p className="text-xs text-slate-400 mb-5">
              Ngày đánh giá: {existingReview.createdAt ? new Date(existingReview.createdAt).toLocaleString("vi-VN") : "—"}
            </p>
            <button
              onClick={() => setShowViewReviewModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showViewFeedbackModal && existingFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Phản ánh / Khiếu nại của bạn
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-3">
              {existingFeedback.content || "Không có nội dung."}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-5">
              <span>Trạng thái: <strong className="text-slate-700">{existingFeedback.status || "Mới"}</strong></span>
              <span>Ngày gửi: {existingFeedback.createdAt ? new Date(existingFeedback.createdAt).toLocaleString("vi-VN") : "—"}</span>
            </div>
            <button
              onClick={() => setShowViewFeedbackModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
