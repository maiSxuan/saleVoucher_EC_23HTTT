/**
 * FILE: frontend/src/features/customer-commerce/pages/customer/PaymentResultPage.jsx
 * PURPOSE: Trang kết quả thanh toán — BR-CUS-07 tích hợp:
 *   Sau khi thanh toán thành công, hiển thị voucher đã phát hành ngay lập tức.
 *   Luồng cơ bản bước 7-8: hiển thị mã voucher, QR, hạn sử dụng, chi nhánh.
 */
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  XCircle,
  Loader,
  Ticket,
  QrCode,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  finalizeVnpayReturn,
  finalizePaypalReturn,
} from "../../../../shared/api/paymentApi";
import { getVouchersByOrder } from "../../../../shared/api/issuedVoucherApi";
import QrCodeDisplay from "../../../core-access/component/QRCodeDisplay";

// Hiển thị một voucher đã phát hành trong kết quả thanh toán
function IssuedVoucherMini({ vm, onClick }) {
  const { t } = useTranslation();
  const v = vm.voucher || {};
  const qrValue = vm.gia_tri_qr_mo_phong || `ECQR:${vm.voucher_code}`;
  const validUntil = v.tg_ket_thuc_ban
    ? new Date(v.tg_ket_thuc_ban).toLocaleDateString("vi-VN")
    : "—";
  const branches = vm.applicableBranches || [];

  const rawVoucherName = typeof v.ten_voucher === 'object' && v.ten_voucher !== null 
    ? (v.ten_voucher.name || v.ten_voucher.ten_voucher || "Voucher") 
    : (v.name || v.ten_voucher || "Voucher");

  const rawPartnerName = typeof vm.partnerName === 'object' && vm.partnerName !== null 
    ? (vm.partnerName.name || vm.partnerName.ten_dn || "") 
    : (vm.partnerName || "");

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Tên voucher */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Ticket className="w-5 h-5 text-orange-500" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 truncate text-sm">
            {t(rawVoucherName)}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {t(rawPartnerName)}
          </p>
        </div>
      </div>

      {/* QR Code */}
      <QrCodeDisplay
        value={qrValue}
        size={180}
        title={t("Mã QR Voucher")}
        subtitle={t("Đưa mã này cho nhân viên tại quầy")}
        showDownload={true}
        className="mb-3"
      />

      {/* Hạn sử dụng + Chi nhánh */}
      <div className="mt-3 space-y-1.5 text-xs text-slate-500">
        <p>
          <span className="font-medium text-slate-700">{t("HSD:")}</span> {validUntil}
        </p>
        {branches.length > 0 && (
          <div className="flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
            <span>
              {branches
                .slice(0, 2)
                .map((b) => t(b.branchName) || b.branchName)
                .join(", ")}
              {branches.length > 2 ? ` +${branches.length - 2}` : ""}
            </span>
          </div>
        )}
      </div>

      {/* Xem chi tiết */}
      <button
        onClick={onClick}
        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-400 rounded-xl transition-colors"
      >
        {t("Xem chi tiết")}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function PaymentResultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [orderId, setOrderId] = useState(null);
  const [issuedVouchers, setIssuedVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [issuePending, setIssuePending] = useState(false);

  // Chặn gọi API trùng lặp trong React StrictMode
  const isCalledRef = useRef(false);

  useEffect(() => {
    if (isCalledRef.current) return;
    isCalledRef.current = true;

    const isPaypal = searchParams.has("token");
    const run = isPaypal
      ? finalizePaypalReturn(searchParams.get("token"))
      : finalizeVnpayReturn(Object.fromEntries(searchParams.entries()));

    run
      .then(async (res) => {
        setOrderId(res.orderId);
        if (res.status === "success") {
          setStatus("success");
          setIssuePending(!!res.issuePending);

          // BR-CUS-07: Tải voucher đã phát hành để hiển thị ngay
          if (res.orderId) {
            setLoadingVouchers(true);
            try {
              let rows = await getVouchersByOrder(res.orderId);
              if (!rows || rows.length === 0) {
                // Retry sau 800ms đề phòng DB vừa commit xong
                await new Promise((r) => setTimeout(r, 800));
                rows = await getVouchersByOrder(res.orderId);
              }
              setIssuedVouchers(Array.isArray(rows) ? rows : []);
            } catch (err) {
              console.warn("[PaymentResult] Lỗi tải voucher:", err);
            } finally {
              setLoadingVouchers(false);
            }
          }
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, []);

  // Processing
  if (status === "processing") {
    return (
      <div className="flex flex-col items-center py-24 gap-3">
        <Loader size={40} className="text-orange-500 animate-spin" />
        <p className="text-lg font-semibold text-gray-800">
          {t("Đang xác nhận thanh toán...")}
        </p>
        <p className="text-sm text-slate-400">
          {t("Hệ thống đang xử lý và phát hành voucher cho bạn.")}
        </p>
      </div>
    );
  }

  // Success
  if (status === "success") {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        {/* Header thành công */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            {t("Đặt mua thành công!")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("Mã đơn:")}{" "}
            <span className="font-mono font-semibold text-slate-700">
              {orderId}
            </span>
          </p>
        </div>

        {/* Voucher đã phát hành — luồng cơ bản bước 7-9 */}
        {loadingVouchers && (
          <div className="flex flex-col items-center py-8 gap-2">
            <Loader className="w-6 h-6 text-orange-400 animate-spin" />
            <p className="text-sm text-slate-500">{t("Đang phát hành mã voucher...")}</p>
          </div>
        )}

        {/* A4: Lỗi phát hành */}
        {!loadingVouchers && issuePending && (
          <div className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-700">
                {t("Chưa thể phát hành mã voucher")}
              </p>
              <p className="text-xs text-orange-600 mt-0.5">
                {t("Hệ thống đang xử lý. Mã của bạn sẽ sớm xuất hiện trong \"Voucher của tôi\". Nếu sau 5 phút vẫn chưa nhận được, vui lòng liên hệ hỗ trợ.")}
              </p>
            </div>
          </div>
        )}

        {/* Hiển thị voucher đã sinh */}
        {!loadingVouchers && issuedVouchers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-slate-800">
                {t("Voucher của bạn")} ({issuedVouchers.length})
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {issuedVouchers.slice(0, 3).map((vm) => (
                <IssuedVoucherMini
                  key={vm.ma_voucher_mua}
                  vm={vm}
                  onClick={() =>
                    navigate(
                      `/customer/vouchers/issued/${vm.ma_voucher_mua}`
                    )
                  }
                />
              ))}
              {issuedVouchers.length > 3 && (
                <p className="text-xs text-slate-400 text-center">
                  {t("và")} {issuedVouchers.length - 3} {t("voucher khác...")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/customer/vouchers/my")}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            {t("Xem voucher của tôi")}
          </button>
          <button
            onClick={() => navigate("/customer/orders")}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:border-sky-300 hover:text-sky-600 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {t("Lịch sử đơn hàng")}
          </button>
          <button
            onClick={() => navigate("/customer")}
            className="text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors text-center"
          >
            {t("Tiếp tục mua sắm")}
          </button>
        </div>
      </div>
    );
  }

  // Failed
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-9 h-9 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {t("Thanh toán thất bại")}
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        {t("Giao dịch không thành công. Bạn có thể thử lại từ giỏ hàng.")}
      </p>
      <button
        onClick={() => navigate("/customer/cart")}
        className="w-full px-4 py-3 bg-sky-500 text-white font-semibold rounded-xl hover:bg-sky-600"
      >
        {t("Quay lại giỏ hàng")}
      </button>
    </div>
  );
}
