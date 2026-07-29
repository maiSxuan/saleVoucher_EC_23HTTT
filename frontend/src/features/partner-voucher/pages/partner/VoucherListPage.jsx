import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function VoucherListPage() {
  const navigate = useNavigate();
  const activePartner = mockStore.getActivePartner();
  const vouchers = mockStore.getVouchersByPartner(activePartner?.ma_hs);
  const categories = mockStore.getCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");

  const statusTabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "Nhap", label: "Bản nháp" },
    { key: "Cho duyet", label: "Chờ duyệt" },
    { key: "Dang ban", label: "Đang bán" },
    { key: "Tam ngung", label: "Tạm ngưng" },
    { key: "Tu choi", label: "Bị từ chối" },
  ];

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      v.ten_voucher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ten_danh_muc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusTab === "ALL"
        ? true
        : v.trang_thai === selectedStatusTab || v.trang_thai_kiem_duyet === selectedStatusTab;

    const matchesCategory = selectedCategory === "ALL" ? true : v.ma_danh_muc === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (voucherId, newStatus) => {
    mockStore.updateVoucherStatus(voucherId, newStatus);
    setToastMessage("Cập nhật trạng thái Voucher thành công!");
    window.location.reload();
  };

  const handleDuplicate = (voucher) => {
    const newForm = {
      ...voucher,
      ma_voucher: "",
      ten_voucher: `${voucher.ten_voucher} (Bản sao)`,
      isSubmit: false,
    };
    mockStore.saveVoucher(newForm);
    setToastMessage("Nhân bản Voucher thành công!");
    window.location.reload();
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
                tab.key === "ALL"
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
                <option value="ALL">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ten_danh_muc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Voucher Table */}
        <Card padding={false}>
          {filteredVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không tìm thấy Voucher nào phù hợp với bộ lọc.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Voucher</th>
                    <th className="py-3.5 px-4">Giá bán / Giá gốc</th>
                    <th className="py-3.5 px-4">Trạng thái duyệt</th>
                    <th className="py-3.5 px-4">Trạng thái công bố</th>
                    <th className="py-3.5 px-4">Đã bán / Tồn kho</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredVouchers.map((v) => (
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

                      {/* Column 2: Price */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-600">{v.gia_ban?.toLocaleString()}đ</div>
                        <div className="text-xs text-slate-400 line-through">{v.gia_goc?.toLocaleString()}đ</div>
                      </td>

                      {/* Column 3: Review status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge status={v.trang_thai_kiem_duyet || v.trang_thai} size="sm" />
                      </td>

                      {/* Column 4: Publication status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge status={v.trang_thai_cong_bo || v.trang_thai} size="sm" />
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
                                Math.round((v.so_luong_da_ban / v.so_luong_phat_hanh) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Column 6: Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link to={`/partner/vouchers/${v.ma_voucher}`}>
                            <Button variant="ghost" size="sm" title="Xem chi tiết">
                              👁️
                            </Button>
                          </Link>

                          <Link to={`/partner/vouchers/${v.ma_voucher}/edit`}>
                            <Button variant="ghost" size="sm" title="Chỉnh sửa">
                              ✏️
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            title="Nhân bản"
                            onClick={() => handleDuplicate(v)}
                          >
                            📋
                          </Button>

                          {v.trang_thai === "Dang ban" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Tạm ngưng bán"
                              onClick={() => handleStatusChange(v.ma_voucher, "Tam ngung")}
                            >
                              ⏸️
                            </Button>
                          )}

                          {v.trang_thai === "Tam ngung" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Mở bán lại"
                              onClick={() => handleStatusChange(v.ma_voucher, "Dang ban")}
                            >
                              ▶️
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
