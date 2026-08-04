import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Danh Sách Chương Trình Voucher</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý toàn bộ danh mục Voucher, trạng thái duyệt và tình hình bán hàng</p>
          </div>
          <Button variant="primary" icon="➕" onClick={() => navigate("/partner/vouchers/new")}>
            Tạo Voucher mới
          </Button>
        </div>

        {/* Filters Card */}
        <Card padding={false} className="p-4 space-y-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
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
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Tìm kiếm Voucher theo tên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>

            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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
        </Card>

        {/* Voucher Table */}
        <Card padding={false}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải danh sách voucher...</div>
          ) : filteredVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không tìm thấy Voucher nào phù hợp với bộ lọc.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Voucher</th>
                    <th className="py-3.5 px-4">Trạng thái duyệt</th>
                    <th className="py-3.5 px-4">Trạng thái công bố</th>
                    <th className="py-3.5 px-4">Giá bán / Giá gốc</th>
                    <th className="py-3.5 px-4">Đã bán / Tồn kho</th>
                    <th className="py-3.5 px-4">Thời gian bán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredVouchers.map((v) => {
                    return (
                      <tr key={v.ma_voucher} className="hover:bg-slate-50/80 transition-colors">
                        {/* Column 1: Image & Title */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.hinh_anh_url}
                              alt={v.ten_voucher}
                              className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                            />
                            <div>
                              <Link
                                to={`/partner/vouchers/${v.ma_voucher}`}
                                className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1"
                              >
                                {v.ten_voucher}
                              </Link>
                              <div className="text-xs text-slate-400 mt-0.5">{v.ten_danh_muc}</div>
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
                          <div className="text-xs text-slate-400 line-through">{v.gia_goc?.toLocaleString()}đ</div>
                        </td>

                        {/* Column 5: Sales Stock */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800">
                            {v.so_luong_da_ban} / {v.so_luong_phat_hanh}
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
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

                        {/* Column 6: Selling Time (Thời gian bán) */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400">Từ: </span>
                            <span className="font-semibold text-slate-800">{formatDate(v.tg_bat_dau_ban)}</span>
                          </div>
                          <div className="mt-0.5">
                            <span className="text-slate-400">Đến: </span>
                            <span className="font-semibold text-slate-800">{formatDate(v.tg_ket_thuc_ban)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default VoucherListPage;