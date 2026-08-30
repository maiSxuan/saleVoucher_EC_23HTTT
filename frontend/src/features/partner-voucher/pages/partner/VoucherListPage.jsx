import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, X, Tag, Eye } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import {
  getVouchersByPartnerApi,
  getCategoriesApi,
} from "../../../../shared/api/partnerApi";
import { getVoucherPublicationStatus } from "../../../../shared/utils/publicationStatusHelper";
import { useTranslation } from "react-i18next";

const SESSION_KEY = "ec_partner_voucher_list_state_v2";

const getSavedState = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export function VoucherListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const savedState = getSavedState();

  const [vouchers, setVouchers] = useState(savedState?.cachedVouchers || []);
  const [categories, setCategories] = useState(
    savedState?.cachedCategories || [],
  );
  const [loading, setLoading] = useState(
    !savedState?.cachedVouchers || savedState.cachedVouchers.length === 0,
  );

  const [searchQuery, setSearchQuery] = useState(savedState?.searchQuery || "");
  const [selectedStatusTab, setSelectedStatusTab] = useState(
    savedState?.selectedStatusTab || "All",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    savedState?.selectedCategory || "All",
  );
  const [toastMessage, setToastMessage] = useState("");

  // Pagination state
  const [page, setPage] = useState(savedState?.page || 1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatusTab, selectedCategory]);

  const statusTabs = [
    { key: "All", label: t("Tất cả") },
    { key: "Nhap", label: t("Bản nháp") },
    { key: "Cho duyet", label: t("Chờ duyệt") },
    { key: "Dang ban", label: t("Đang bán") },
    { key: "Tam ngung", label: t("Tạm ngưng") },
    { key: "Ngung ban", label: t("Ngừng bán") },
    { key: "Tu choi", label: t("Bị từ chối") },
  ];

  const getLoggedInPartnerId = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        return u.ma_hsdn || u.ma_hs || u.id || u.ma_nguoi_dung;
      }
    } catch (e) {}
    return "20000000-0000-0000-0000-000000000001";
  };

  const loadVouchers = async () => {
    if (!savedState?.cachedVouchers) setLoading(true);
    const partnerId = getLoggedInPartnerId();
    const data = await getVouchersByPartnerApi(partnerId);
    setVouchers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          searchQuery,
          selectedStatusTab,
          selectedCategory,
          cachedVouchers: vouchers,
          cachedCategories: categories,
        }),
      );
    } catch (e) {}
  }, [searchQuery, selectedStatusTab, selectedCategory, vouchers, categories]);

  useEffect(() => {
    async function loadData() {
      if (!savedState?.cachedVouchers) setLoading(true);
      const partnerId = getLoggedInPartnerId();
      const [cats, data] = await Promise.all([
        getCategoriesApi(),
        getVouchersByPartnerApi(partnerId),
      ]);
      setCategories(cats || []);
      setVouchers(data || []);
      setLoading(false);
    }
    loadData();

    window.addEventListener("app_language_changed", loadData);
    return () => window.removeEventListener("app_language_changed", loadData);
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatusTab("All");
    setSelectedCategory("All");
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  };

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      (v.ten_voucher || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.ten_danh_muc || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusTab === "All"
        ? true
        : v.trang_thai === selectedStatusTab ||
          v.trang_thai_kiem_duyet === selectedStatusTab;

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : v.ma_danh_muc === selectedCategory ||
          v.ten_danh_muc === selectedCategory ||
          String(v.ma_danh_muc) === String(selectedCategory);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalVouchers = filteredVouchers.length;
  const totalPages = Math.ceil(totalVouchers / limit) || 1;
  const paginatedVouchers = filteredVouchers.slice(
    (page - 1) * limit,
    page * limit,
  );

  const getPublicationStatusBadge = (v) => {
    return getVoucherPublicationStatus(v);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <PartnerLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Title & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("Quản lý Voucher")}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("Danh sách tất cả các chương trình ưu đãi của bạn.")}
            </p>
          </div>
          <button
            onClick={() => navigate("/partner/vouchers/new")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors cursor-pointer shadow-soft"
          >
            <Plus size={16} /> {t("Tạo Voucher mới")}
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
          {statusTabs.map((tab) => {
            const count =
              tab.key === "All"
                ? vouchers.length
                : vouchers.filter(
                    (v) =>
                      v.trang_thai === tab.key ||
                      v.trang_thai_kiem_duyet === tab.key,
                  ).length;
            const isActive = selectedStatusTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedStatusTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-sky-600 text-sky-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? "bg-sky-100 text-sky-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={t("Tìm tên Voucher...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-400 bg-white text-gray-700"
            >
              <option value="All">{t("Tất cả danh mục")}</option>
              {categories.map((c) => {
                const catVal = c.ma_danh_muc || c.id || c.ten_danh_muc;
                return (
                  <option key={catVal} value={catVal}>
                    {t(c.ten_danh_muc)}
                  </option>
                );
              })}
            </select>
          </div>
          {(searchQuery ||
            selectedStatusTab !== "All" ||
            selectedCategory !== "All") && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span>
                {t("Đang lọc ra kết quả")}: {totalVouchers}
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                <X size={14} /> {t("Xóa bộ lọc")}
              </button>
            </div>
          )}
        </div>

        {/* Voucher Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              {t("Đang tải danh sách voucher...")}
            </div>
          ) : paginatedVouchers.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-400">
              <Tag size={40} className="mb-2 text-gray-300" />
              <p className="text-sm">
                {t("Không tìm thấy Voucher nào phù hợp với bộ lọc.")}
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">{t("Voucher")}</th>
                      <th className="py-3.5 px-4">{t("Trạng thái duyệt")}</th>
                      <th className="py-3.5 px-4">{t("Trạng thái công bố")}</th>
                      <th className="py-3.5 px-4">{t("Giá bán")}</th>
                      <th className="py-3.5 px-4">{t("Đã bán")}</th>
                      <th className="py-3.5 px-4">{t("Thời gian bán")}</th>
                      <th className="py-3.5 px-4 text-right">
                        {t("Thao tác")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {paginatedVouchers.map((v) => {
                      return (
                        <tr
                          key={v.ma_voucher}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Column 1: Image & Title */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.hinh_anh_url}
                                alt={v.ten_voucher}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                              />
                              <div>
                                <Link
                                  to={`/partner/vouchers/${v.ma_voucher}`}
                                  className="font-bold text-gray-900 hover:text-sky-600 line-clamp-1"
                                >
                                  {typeof v.ten_voucher === "object" &&
                                  v.ten_voucher !== null
                                    ? v.ten_voucher.name ||
                                      v.ten_voucher.ten_voucher ||
                                      "Voucher"
                                    : v.ten_voucher}
                                </Link>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {t(v.ten_danh_muc) || "---"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Review status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <Badge
                              status={v.trang_thai_kiem_duyet || v.trang_thai}
                              size="sm"
                            />
                          </td>

                          {/* Column 3: Publication status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {(() => {
                              const pb = getPublicationStatusBadge(v);
                              return (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${pb.color}`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${pb.dot}`}
                                  />
                                  {t(pb.label)}
                                </span>
                              );
                            })()}
                          </td>

                          {/* Column 4: Price */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-bold text-emerald-600">
                              {v.gia_ban?.toLocaleString()}đ
                            </div>
                            <div className="text-xs text-gray-400 line-through">
                              {v.gia_goc?.toLocaleString()}đ
                            </div>
                          </td>

                          {/* Column 5: Sales Stock */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-800">
                              {v.so_luong_da_ban} / {v.so_luong_phat_hanh}
                            </div>
                            <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div
                                className="bg-sky-600 h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(
                                      (v.so_luong_da_ban /
                                        (v.so_luong_phat_hanh || 1)) *
                                        100,
                                    ),
                                  )}%`,
                                }}
                              />
                            </div>
                          </td>

                          {/* Column 6: Selling Time */}
                          <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                            <div>
                              {t("Từ")}: {formatDate(v.tg_bat_dau_ban)}
                            </div>
                            <div>
                              {t("Đến")}: {formatDate(v.tg_ket_thuc_ban)}
                            </div>
                          </td>

                          {/* Column 7: Action */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <Link
                              to={`/partner/vouchers/${v.ma_voucher}`}
                              className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 font-semibold hover:bg-sky-50 px-2.5 py-1 rounded-lg transition-colors"
                            >
                              <Eye size={14} /> {t("Chi tiết")}
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
                    {t("Trang")} {page} / {totalPages} ({t("Tổng")}{" "}
                    {totalVouchers} voucher)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {t("Trước")}
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {t("Sau")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherListPage;
