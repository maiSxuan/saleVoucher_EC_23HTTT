/**
 * FILE: frontend/src/features/core-access/pages/customer/MyVoucherPage.jsx
 * PURPOSE: BR-CUS-07 — Trang "Voucher của tôi" — danh sách voucher đã mua.
 *
 * Hiển thị:
 *  - Danh sách voucher với trạng thái, mã code, tên voucher, đối tác
 *  - Lọc theo trạng thái (Chua su dung / Da su dung / Het han)
 *  - Click vào xem chi tiết (qr code, chi nhánh, hạn sử dụng)
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getMyVouchers } from "../../../../shared/api/issuedVoucherApi";

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const map = {
    "Chua su dung": {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: t("Chưa sử dụng"),
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    "Da su dung": {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: t("Đã sử dụng"),
      cls: "bg-slate-100 text-slate-500 border-slate-200",
    },
    "Het han": {
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: t("Hết hạn"),
      cls: "bg-red-50 text-red-600 border-red-200",
    },
    "Loi sinh ma": {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: t("Lỗi phát hành"),
      cls: "bg-orange-50 text-orange-600 border-orange-200",
    },
  };
  const info = map[status] || {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    label: t(status),
    cls: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${info.cls}`}
    >
      {info.icon}
      {info.label}
    </span>
  );
}

function VoucherCard({ vm, onClick }) {
  const { t } = useTranslation();
  const v = vm.voucher || {};
  const issuedDate = vm.thoi_gian_sinh_ma
    ? new Date(vm.thoi_gian_sinh_ma).toLocaleDateString("vi-VN")
    : "—";
  const validUntil = v.tg_ket_thuc_ban
    ? new Date(v.tg_ket_thuc_ban).toLocaleDateString("vi-VN")
    : "—";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200"
    >
      {/* Ảnh hoặc icon */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-orange-50 flex items-center justify-center">
        {v.hinh_anh_url ? (
          <img
            src={v.hinh_anh_url}
            alt={v.ten_voucher}
            className="w-full h-full object-cover"
          />
        ) : (
          <Ticket className="w-7 h-7 text-orange-400" />
        )}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate text-sm">
          {v.ten_voucher || "Voucher"}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {t(vm.partnerName) || t("Đối tác")}
        </p>

        {/* Code */}
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 tracking-wider">
            {vm.voucher_code}
          </span>
          <StatusBadge status={vm.trang_thai} />
        </div>

        <p className="text-xs text-slate-400 mt-1">
          {t("Phát hành:")} {issuedDate} &nbsp;·&nbsp; {t("HSD:")} {validUntil}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-orange-400 transition-colors flex-shrink-0" />
    </div>
  );
}

export default function MyVoucherPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const STATUS_OPTIONS = [
    { value: "", label: t("Tất cả") },
    { value: "Chua su dung", label: t("Chưa sử dụng") },
    { value: "Da su dung", label: t("Đã sử dụng") },
    { value: "Het han", label: t("Hết hạn") },
    { value: "Loi sinh ma", label: t("Lỗi phát hành") },
  ];
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const LIMIT = 12;

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyVouchers({ page: p, limit: LIMIT, status });
        setVouchers(result.records || []);
        setPagination({
          total: result.total,
          totalPages: result.totalPages,
          page: result.page,
        });
        setPage(p);
      } catch (err) {
        setError(t(err.message || "Không thể tải danh sách voucher."));
      } finally {
        setLoading(false);
      }
    },
    [status, t]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  // Lọc client-side theo search text
  const filtered = vouchers.filter((vm) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (vm.voucher_code || "").toLowerCase().includes(q) ||
      (vm.voucher?.ten_voucher || "").toLowerCase().includes(q) ||
      (vm.partnerName || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <QrCode className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t("Voucher của tôi")}</h1>
            <p className="text-sm text-slate-500">
              {pagination?.total ?? "—"} voucher
            </p>
          </div>
        </div>
        <button
          onClick={() => load(page)}
          disabled={loading}
          className="p-2 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
          title={t("Làm mới")}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatus(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${status === opt.value
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={t("Tìm theo mã code, tên voucher, đối tác...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16 gap-3">
          <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
          <p className="text-sm text-slate-500">{t("Đang tải voucher...")}</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <p className="text-xs text-slate-400">
            {t("Không thể tải danh sách voucher. Vui lòng thử lại.")}
          </p>
          <button
            onClick={() => load(1)}
            className="mt-2 px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-xl hover:bg-orange-600"
          >
            {t("Thử lại")}
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
          <p className="text-base font-semibold text-slate-700">
            {search ? t("Không tìm thấy voucher phù hợp") : t("Chưa có voucher nào")}
          </p>
          <p className="text-sm text-slate-400">
            {search
              ? t("Thử thay đổi từ khóa tìm kiếm.")
              : t("Mua voucher để nhận mã và sử dụng tại các chi nhánh đối tác.")}
          </p>
          {!search && (
            <button
              onClick={() => navigate("/customer")}
              className="mt-3 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600"
            >
              {t("Khám phá voucher")}
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((vm) => (
            <VoucherCard
              key={vm.ma_voucher_mua}
              vm={vm}
              onClick={() =>
                navigate(`/customer/vouchers/issued/${vm.ma_voucher_mua}`)
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && !search && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => load(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
                  }`}
              >
                {p}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
