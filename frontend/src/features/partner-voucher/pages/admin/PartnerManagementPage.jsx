import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function PartnerManagementPage() {
  const partners = mockStore.getPartners();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.ten_dn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ma_so_thue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nguoi_dai_dien?.ho_ten || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === "ALL" ? true : p.trang_thai === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quản Lý Danh Sách Đối Tác (BR-ADM-02)</h2>
            <p className="text-sm text-slate-500 mt-1">
              Thẩm định hồ sơ doanh nghiệp, phê duyệt hợp đồng đối tác và quản lý quyền truy cập
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <Card padding={false} className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên công ty, MST, Người đại diện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            </div>

            <div className="w-full md:w-64">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Cho duyet">Chờ duyệt</option>
                <option value="Dang hoat dong">Đang hoạt động</option>
                <option value="Tu choi">Bị từ chối</option>
                <option value="Tam khoa">Tạm khóa</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Partner Table */}
        <Card padding={false}>
          {filteredPartners.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không tìm thấy đối tác nào phù hợp.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Tên Doanh Nghiệp</th>
                    <th className="py-3.5 px-4">Mã Số Thuế</th>
                    <th className="py-3.5 px-4">Người Đại Diện</th>
                    <th className="py-3.5 px-4">Ngày Đăng Ký</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredPartners.map((partner) => (
                    <tr key={partner.ma_hs} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <Link to={`/admin/partners/${partner.ma_hs}`} className="hover:text-blue-600">
                          {partner.ten_dn}
                        </Link>
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-700">{partner.ma_so_thue}</td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-800">{partner.nguoi_dai_dien?.ho_ten}</div>
                        <div className="text-xs text-slate-400">{partner.nguoi_dai_dien?.sdt}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 text-xs">
                        {new Date(partner.ngay_tao).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-4">
                        <Badge status={partner.trang_thai} />
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <Link to={`/admin/partners/${partner.ma_hs}`}>
                          <Button variant="secondary" size="sm">
                            Xem & Thẩm định ➔
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
    </AdminLayout>
  );
}

export default PartnerManagementPage;
