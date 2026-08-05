import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, X, Tag, Eye } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import { getVouchersByPartnerApi, getCategoriesApi } from "../../../../shared/api/partnerApi";

export function VoucherListPage() {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  const statusTabs = [
    { key: "All", label: "Tất cả" },
    { key: "Nhap", label: "Bản nháp" },
    { key: "Cho duyet", label: "Chờ duyệt" },
    { key: "Dang ban", label: "Đang bán" },
    { key: "Tam ngung", label: "Tạm ngưng" },
    { key: "Tu choi", label: "Bị từ chối" },
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
    setLoading(true);
    const partnerId = getLoggedInPartnerId();
    const data = await getVouchersByPartnerApi(partnerId);
    setVouchers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    async function loadData() {
      const cats = await getCategoriesApi();
      setCategories(cats || []);
      await loadVouchers();
    }
    loadData();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatusTab("All");
    setSelectedCategory("All");
  };

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      (v.ten_voucher || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.ten_danh_muc || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusTab === "All"
        ? true
        : v.trang_thai === selectedStatusTab || v.trang_thai_kiem_duyet === selectedStatusTab;

    const matchesCategory =
      selectedCategory === "All"
        ? true
        : v.ma_danh_muc === selectedCategory ||
          v.ten_danh_muc === selectedCategory ||
          String(v.ma_danh_muc) === String(selectedCategory);

    return matchesSearch && matchesStatus && matchesCategory;
  });

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
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Title & Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách voucher</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý toàn bộ danh mục Voucher, trạng thái duyệt và tình hình bán hàng.</p>
          </div>
          <button
            onClick={() => navigate("/partner/vouchers/new")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} /> Tạo Voucher mới
          </button>
        </div>

        {/* Filters Bar matching prototype */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto">
            {statusTabs.map((tab) => {
              const count =
                tab.key === "All"
                  ? vouchers.length
                  : vouchers.filter((v) => v.trang_thai === tab.key || v.trang_thai_kiem_duyet === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatusTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedStatusTab === tab.key
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Category Select Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm Voucher theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="All">Tất cả danh mục</option>
                {categories.map((c) => {
                  const catVal = c.ma_danh_muc || c.id || c.ten_danh_muc;
                  return (
                    <option key={catVal} value={catVal}>
                      {c.ten_danh_muc}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Filter Footer */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm text-gray-500">{filteredVouchers.length} voucher</p>
            <button
              onClick={handleResetFilters}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Đặt lại
            </button>
          </div>
        </div>

        {/* Voucher Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Đang tải danh sách voucher...</div>
          ) : filteredVouchers.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-400">
              <Tag size={40} className="mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy Voucher nào phù hợp với bộ lọc.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Voucher</th>
                    <th className="py-3.5 px-4">Trạng thái duyệt</th>
                    <th className="py-3.5 px-4">Trạng thái công bố</th>
                    <th className="py-3.5 px-4">Giá bán / Giá gốc</th>
                    <th className="py-3.5 px-4">Đã bán / Tồn kho</th>
                    <th className="py-3.5 px-4">Thời gian bán</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredVouchers.map((v) => {
                    return (
                      <tr key={v.ma_voucher} className="hover:bg-gray-50 transition-colors">
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
                                className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1"
                              >
                                {v.ten_voucher}
                              </Link>
                              <div className="text-xs text-gray-400 mt-0.5">{v.ten_danh_muc}</div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Review status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Badge status={v.trang_thai_kiem_duyet || v.trang_thai} size="sm" />
                        </td>

                        {/* Column 3: Publication status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Badge status={v.trang_thai_cong_bo || v.trang_thai} size="sm" />
                        </td>

                        {/* Column 4: Price */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-emerald-600">{v.gia_ban?.toLocaleString()}đ</div>
                          <div className="text-xs text-gray-400 line-through">{v.gia_goc?.toLocaleString()}đ</div>
                        </td>

                        {/* Column 5: Sales Stock */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-800">
                            {v.so_luong_da_ban} / {v.so_luong_phat_hanh}
                          </div>
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.round((v.so_luong_da_ban / (v.so_luong_phat_hanh || 1)) * 100)
                                )}%`,
                              }}
                            />
                          </div>
                        </td>

                        {/* Column 6: Selling Time */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                          <div>From: {formatDate(v.tg_bat_dau_ban)}</div>
                          <div>To: {formatDate(v.tg_ket_thuc_ban)}</div>
                        </td>

                        {/* Column 7: Action */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <Link
                            to={`/partner/vouchers/${v.ma_voucher}`}
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
          )}
        </div>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherListPage;