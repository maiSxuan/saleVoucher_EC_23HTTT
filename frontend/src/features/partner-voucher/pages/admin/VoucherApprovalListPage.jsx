import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import { getVouchersApi, getPartnersApi } from "../../../../shared/api/partnerApi";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function VoucherApprovalListPage() {
  const [vouchers, setVouchers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = mockStore.getCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [vData, pData] = await Promise.all([getVouchersApi(), getPartnersApi()]);
      setVouchers(vData || []);
      setPartners(pData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch =
      (v.ten_voucher || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.ten_dn || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPartner = selectedPartner === "ALL" ? true : v.ma_hs === selectedPartner;
    const matchesCategory = selectedCategory === "ALL" ? true : v.ma_danh_muc === selectedCategory;
    const matchesStatus =
      selectedStatusFilter === "ALL"
        ? true
        : v.trang_thai === selectedStatusFilter || v.trang_thai_kiem_duyet === selectedStatusFilter;

    return matchesSearch && matchesPartner && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Duyệt Voucher Niêm Yết (UC-ADM-03)</h2>
            <p className="text-sm text-slate-500 mt-1">
              Thẩm định nội dung, giá bán chiết khấu, điều kiện sử dụng và thời gian công bố của Voucher
            </p>
          </div>
        </div>

        {/* Filters Card */}
        <Card padding={false} className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Tìm kiếm Voucher hoặc Tên đối tác..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-auto">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Cho duyet">Chờ duyệt</option>
                <option value="Da duyet">Đã duyệt</option>
                <option value="Dang ban">Đang bán</option>
                <option value="Tu choi">Bị từ chối</option>
              </select>

              <select
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
              >
                <option value="ALL">Tất cả đối tác</option>
                {partners.map((p) => (
                  <option key={p.ma_hs} value={p.ma_hs}>
                    {p.ten_dn}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
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

        {/* Voucher Review Table */}
        <Card padding={false}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải danh sách voucher...</div>
          ) : filteredVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không có Voucher nào trong danh sách thẩm định.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Tên Voucher</th>
                    <th className="py-3.5 px-4">Đối Tác Phát Hành</th>
                    <th className="py-3.5 px-4">Giá bán / Giá gốc</th>
                    <th className="py-3.5 px-4">Thời Gian Bán</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredVouchers.map((v) => (
                    <tr key={v.ma_voucher} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={v.hinh_anh_url}
                            alt={v.ten_voucher}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <Link
                              to={`/admin/vouchers/${v.ma_voucher}`}
                              className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1"
                            >
                              {v.ten_voucher}
                            </Link>
                            <div className="text-xs text-slate-400">{v.ten_danh_muc}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-slate-800">{v.ten_dn || "Công ty đối tác"}</td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-600">{v.gia_ban?.toLocaleString()}đ</div>
                        <div className="text-xs text-slate-400 line-through">{v.gia_goc?.toLocaleString()}đ</div>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {v.tg_bat_dau_ban ? new Date(v.tg_bat_dau_ban).toLocaleDateString("vi-VN") : "-"} -{" "}
                        {v.tg_ket_thuc_ban ? new Date(v.tg_ket_thuc_ban).toLocaleDateString("vi-VN") : "-"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge status={v.trang_thai_kiem_duyet || v.trang_thai} />
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link to={`/admin/vouchers/${v.ma_voucher}`}>
                          <Button variant="secondary" size="sm">
                            Thẩm định ➔
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
  );
}

export default VoucherApprovalListPage;
