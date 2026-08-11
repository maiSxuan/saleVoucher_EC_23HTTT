import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Tag, XCircle, Eye } from "lucide-react";
import { getVouchersApi, getPartnersApi } from "../../../../shared/api/partnerApi";
import { formatCategoryName } from "../../../../shared/utils/categoryFormatter";
import { getVoucherPublicationStatus } from "../../../../shared/utils/publicationStatusHelper";

const SESSION_KEY = "ec_admin_voucher_approval_list_state_v1";

const getSavedState = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export function VoucherApprovalListPage() {
  const savedState = getSavedState();

  const [vouchers, setVouchers] = useState(savedState?.cachedVouchers || []);
  const [partners, setPartners] = useState(savedState?.cachedPartners || []);
  const [loading, setLoading] = useState(!savedState?.cachedVouchers || savedState.cachedVouchers.length === 0);

  // Filters state matching prototype code
  const [searchName, setSearchName] = useState(savedState?.searchName || "");
  const [filterPartner, setFilterPartner] = useState(savedState?.filterPartner || "");
  const [filterReview, setFilterReview] = useState(savedState?.filterReview || "pending");

  // Pagination state
  const [page, setPage] = useState(savedState?.page || 1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [searchName, filterPartner, filterReview]);

  const loadData = async () => {
    if (!savedState?.cachedVouchers) setLoading(true);
    try {
      const [vData, pData] = await Promise.all([getVouchersApi(), getPartnersApi()]);
      setVouchers(vData || []);
      setPartners(pData || []);
    } catch (e) {
      console.error("Error loading vouchers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          searchName,
          filterPartner,
          filterReview,
          cachedVouchers: vouchers,
          cachedPartners: partners,
        })
      );
    } catch (e) {}
  }, [searchName, filterPartner, filterReview, vouchers, partners]);

  useEffect(() => {
    loadData();
  }, []);

  const getReviewStatusBadge = (status) => {
    if (status === "Dang ban" || status === "Da duyet" || status === "approved") {
      return { label: "Đã duyệt", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
    }
    if (status === "Tu choi" || status === "rejected") {
      return { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" };
    }
    return { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" };
  };

  const getPublicationStatusBadge = (v) => {
    return getVoucherPublicationStatus(v);
  };

  const filteredVouchers = vouchers.filter((v) => {
    const matchName = !searchName || (v.ten_voucher || "").toLowerCase().includes(searchName.toLowerCase());
    const partnerName = v.ten_dn || "";
    const partnerId = v.ma_hs || "";
    const matchPartner = !filterPartner || partnerId === filterPartner || partnerName === filterPartner;

    let vReviewStatus = "pending";
    if (v.trang_thai === "Dang ban" || v.trang_thai === "Da duyet") vReviewStatus = "approved";
    else if (v.trang_thai === "Tu choi") vReviewStatus = "rejected";

    const matchReview = !filterReview || filterReview === "ALL" || vReviewStatus === filterReview || v.trang_thai === filterReview;

    return matchName && matchPartner && matchReview;
  });

  const partnerNames = [...new Set(partners.map((p) => p.ten_dn).filter(Boolean))];

  const totalVouchers = filteredVouchers.length;
  const totalPages = Math.ceil(totalVouchers / limit) || 1;
  const paginatedVouchers = filteredVouchers.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Duyệt voucher</h1>
        <p className="text-sm text-slate-500 mt-1">Kiểm tra và phê duyệt voucher do đối tác gửi.</p>
      </div>

      {/* Filters Bar matching prototype */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tên voucher..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <select
            value={filterPartner}
            onChange={(e) => setFilterPartner(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
          >
            <option value="">Tất cả đối tác</option>
            {partnerNames.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={filterReview}
            onChange={(e) => setFilterReview(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
          >
            <option value="ALL">Tất cả trạng thái kiểm duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>

        {(searchName || filterPartner || filterReview !== "ALL") && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Đang lọc ra {totalVouchers} kết quả</span>
            <button
              onClick={() => {
                setSearchName("");
                setFilterPartner("");
                setFilterReview("ALL");
              }}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
            >
              <X size={14} /> Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Đang tải danh sách voucher...</div>
        ) : filteredVouchers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Không tìm thấy voucher nào phù hợp.</div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-3.5 py-3">Tên voucher</th>
                    <th className="px-3.5 py-3">Đối tác</th>
                    <th className="px-3.5 py-3">Danh mục</th>
                    <th className="px-3.5 py-3">Giá gốc</th>
                    <th className="px-3.5 py-3">Giá bán</th>
                    <th className="px-3.5 py-3">Thời gian bán</th>
                    <th className="px-3.5 py-3 text-center">SL</th>
                    <th className="px-3.5 py-3">Kiểm duyệt</th>
                    <th className="px-3.5 py-3">Công bố</th>
                    <th className="px-3.5 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedVouchers.map((v) => {
                    const giaGoc = Number(v.gia_goc) || 0;
                    const giaBan = Number(v.gia_ban) || 0;
                    const isInvalidPrice = giaBan >= giaGoc;

                    const rb = getReviewStatusBadge(v.trang_thai);
                    const pb = getPublicationStatusBadge(v);

                    const startDate = v.tg_bat_dau_ban ? v.tg_bat_dau_ban.slice(0, 10) : "2025-08-01";
                    const endDate = v.tg_ket_thuc_ban ? v.tg_ket_thuc_ban.slice(0, 10) : "2025-12-31";

                    return (
                      <tr key={v.ma_voucher} className="hover:bg-slate-50 transition-colors">
                        {/* Tên voucher */}
                        <td className="px-3.5 py-3.5 font-medium text-slate-900 max-w-xs">
                          <div className="flex items-center gap-2">
                            {isInvalidPrice && (
                              <XCircle size={15} className="text-rose-500 shrink-0" title="Giá bán không hợp lệ" />
                            )}
                            <Link
                              to={`/admin/vouchers/${v.ma_voucher}`}
                              className="hover:text-blue-600 truncate max-w-[180px] font-bold"
                            >
                              {v.ten_voucher}
                            </Link>
                          </div>
                        </td>

                        {/* Đối tác */}
                        <td className="px-3.5 py-3.5 text-slate-600 truncate max-w-[120px]">
                          {v.ten_dn || "Doanh nghiệp đối tác"}
                        </td>

                        {/* Danh mục */}
                        <td className="px-3.5 py-3.5 text-slate-600">{formatCategoryName(v.ten_danh_muc)}</td>

                        {/* Giá gốc */}
                        <td className="px-3.5 py-3.5 font-medium text-slate-700">{giaGoc.toLocaleString("vi-VN")}đ</td>

                        {/* Giá bán */}
                        <td className={`px-3.5 py-3.5 font-bold ${isInvalidPrice ? "text-rose-600" : "text-emerald-600"}`}>
                          {giaBan.toLocaleString("vi-VN")}đ
                        </td>

                        {/* Thời gian bán */}
                        <td className="px-3.5 py-3.5 text-xs text-slate-600 font-mono whitespace-nowrap">
                          {startDate} → {endDate}
                        </td>

                        {/* SL */}
                        <td className="px-3.5 py-3.5 text-center text-slate-700 font-medium">{v.so_luong_phat_hanh || 0}</td>

                        {/* Kiểm duyệt Badge */}
                        <td className="px-3.5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${rb.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rb.dot}`} />
                            {rb.label}
                          </span>
                        </td>

                        {/* Công bố Badge */}
                        <td className="px-3.5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pb.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${pb.dot}`} />
                            {pb.label}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="px-3.5 py-3.5 text-right whitespace-nowrap">
                          <Link
                            to={`/admin/vouchers/${v.ma_voucher}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <Eye size={14} /> Chi tiết
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalVouchers > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm">
                <p className="text-xs text-gray-600">
                  Trang {page} / {totalPages} (Tổng {totalVouchers} voucher)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoucherApprovalListPage;
