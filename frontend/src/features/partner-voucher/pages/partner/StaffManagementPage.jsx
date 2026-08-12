import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, X, Users, Edit, Lock, Unlock, Trash2 } from "lucide-react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import Button from "../../../../shared/components/Button";
import {
  getStaffsByPartnerApi,
  createStaffApi,
  updateStaffApi,
  deleteStaffApi,
  getPartnerByIdApi,
  getBranchesByPartnerApi,
} from "../../../../shared/api/partnerApi";

export function StaffManagementPage() {
  const [staffs, setStaffs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const emptyForm = {
    ma_nv: "",
    ho_ten: "",
    email: "",
    sdt: "",
    mat_khau: "123456",
    ngay_sinh: "",
    gioi_tinh: "Nam",
    cccd: "",
    vai_tro: "Nhân viên chi nhánh",
    ma_chi_nhanh: "",
    trang_thai: "Dang hoat dong",
  };

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const getActiveUser = () => {
    try {
      const userStr = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  };

  const reload = async () => {
    setLoading(true);
    const activeUser = getActiveUser();
    const targetId = activeUser?.ma_hsdn || activeUser?.ma_hs || activeUser?.id || activeUser?.ma_nguoi_dung || "20000000-0000-0000-0000-000000000001";

    const partner = await getPartnerByIdApi(targetId);
    const realMaHs = partner?.ma_hs || targetId;
    setPartnerId(realMaHs);

    const [staffData, branchData] = await Promise.all([
      getStaffsByPartnerApi(realMaHs),
      getBranchesByPartnerApi(realMaHs),
    ]);

    setStaffs(staffData || []);
    setBranches(branchData || []);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const roles = ["All", "Nhân viên chi nhánh", "Quản lý vận hành"];
  const statuses = ["All", "Dang hoat dong", "Tam khoa", "Tam ngung"];

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

  const filteredStaffs = useMemo(() => {
    return staffs.filter((s) => {
      const matchSearch =
        (s.ho_ten || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.cccd || "").includes(searchQuery) ||
        (s.sdt || "").includes(searchQuery);

      const matchRole = roleFilter === "All" || s.vai_tro === roleFilter;
      const matchStatus = statusFilter === "All" || s.trang_thai === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [staffs, searchQuery, roleFilter, statusFilter]);

  const handleAdd = () => {
    setEditing(false);
    setForm({
      ...emptyForm,
      ma_chi_nhanh: branches[0]?.ma_chi_nhanh || "",
    });
    setShowModal(true);
  };

  const handleEdit = (staff) => {
    setEditing(true);
    setForm({
      ...staff,
      ngay_sinh: staff.ngay_sinh ? staff.ngay_sinh.slice(0, 10) : "",
      gioi_tinh: staff.gioi_tinh || "Nam",
      cccd: staff.cccd || "",
      ma_chi_nhanh: staff.ma_chi_nhanh || branches[0]?.ma_chi_nhanh || "",
    });
    setShowModal(true);
  };

  const handleRoleChange = (newRole) => {
    if (newRole === "Nhân viên chi nhánh") {
      setForm((prev) => ({
        ...prev,
        vai_tro: newRole,
        ma_chi_nhanh: prev.ma_chi_nhanh || branches[0]?.ma_chi_nhanh || "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        vai_tro: newRole,
        ma_chi_nhanh: "",
      }));
    }
  };

  const handleSave = async () => {
    if (!form.ho_ten.trim()) {
      setToastMessage("Vui lòng nhập họ và tên nhân viên.");
      return;
    }
    if (!form.sdt || !/^\d{10}$/.test(form.sdt.trim())) {
      setToastMessage("Số điện thoại phải bao gồm đúng 10 chữ số.");
      return;
    }
    if (form.cccd && !/^\d{12}$/.test(form.cccd.trim())) {
      setToastMessage("Số CCCD phải bao gồm đúng 12 chữ số.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setToastMessage("Địa chỉ email không đúng định dạng.");
      return;
    }

    try {
      if (editing) {
        await updateStaffApi(form.ma_nv, {
          ...form,
          ma_hs: partnerId,
          ma_chi_nhanh: form.vai_tro === "Nhân viên chi nhánh" ? form.ma_chi_nhanh : null,
        });
        setToastMessage("Cập nhật thông tin nhân viên thành công.");
      } else {
        await createStaffApi({
          ...form,
          ma_hs: partnerId,
          ma_chi_nhanh: form.vai_tro === "Nhân viên chi nhánh" ? form.ma_chi_nhanh : null,
        });
        setToastMessage("Thêm nhân viên mới thành công.");
      }

      await reload();
      setShowModal(false);
    } catch (e) {
      setToastMessage("Lỗi lưu nhân viên: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nhân viên này?")) return;
    await deleteStaffApi(id);
    await reload();
    setToastMessage("Đã xóa nhân viên.");
  };

  const handleLock = async (staff) => {
    const nextStatus = staff.trang_thai === "Dang hoat dong" ? "Tam khoa" : "Dang hoat dong";
    await updateStaffApi(staff.ma_nv, { trang_thai: nextStatus });
    await reload();
    setToastMessage("Đã cập nhật trạng thái.");
  };

  return (
    <PartnerLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Title & Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản nhân viên của doanh nghiệp.</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
          >
            <Plus size={16} /> Thêm nhân viên
          </button>
        </div>

        {/* Filters Bar matching prototype */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tên, email, SĐT, CCCD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="Nhân viên chi nhánh">Nhân viên chi nhánh</option>
              <option value="Quản lý vận hành">Quản lý vận hành</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Dang hoat dong">Đang hoạt động</option>
              <option value="Tam khoa">Tạm khóa</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">{filteredStaffs.length} nhân viên</p>
            <button
              onClick={handleResetFilters}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Đặt lại
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Đang tải danh sách nhân viên...</div>
          ) : filteredStaffs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-400">
              <Users size={40} className="mb-2 text-gray-300" />
              <p className="text-sm">Không có nhân viên nào phù hợp.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Nhân viên</th>
                    <th className="px-4 py-3">Thông tin cá nhân</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3">Chi nhánh phụ trách</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredStaffs.map((staff) => (
                    <tr key={staff.ma_nv} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0 border border-blue-200">
                            {staff.ho_ten?.charAt(0) || "N"}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{staff.ho_ten}</div>
                            <div className="text-xs text-gray-500">{staff.email || "Chưa có email"}</div>
                            <div className="text-xs text-gray-400 font-mono">{staff.sdt || "Chưa có SĐT"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-xs space-y-0.5 text-gray-600">
                        <div><span className="font-medium text-gray-700">Giới tính:</span> {staff.gioi_tinh === "Nu" ? "Nữ" : staff.gioi_tinh === "Nam" ? "Nam" : "Khác"}</div>
                        <div><span className="font-medium text-gray-700">Ngày sinh:</span> {staff.ngay_sinh ? staff.ngay_sinh.slice(0, 10) : "Chưa cập nhật"}</div>
                        <div><span className="font-medium text-gray-700">CCCD:</span> {staff.cccd || "Chưa cập nhật"}</div>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-gray-800">{staff.vai_tro}</td>

                      <td className="px-4 py-3.5">
                        {staff.vai_tro === "Nhân viên chi nhánh" ? (
                          !staff.chi_nhanh_phu_trach || staff.chi_nhanh_phu_trach.length === 0 ? (
                            <span className="text-gray-400 italic">Chưa phân công</span>
                          ) : (
                            <span className="font-medium text-gray-800">{staff.chi_nhanh_phu_trach.join(", ")}</span>
                          )
                        ) : (
                          <span className="text-gray-400 italic">Tất cả chi nhánh (Quản lý)</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <Badge status={staff.trang_thai} size="sm" />
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(staff)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Sửa nhân viên"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleLock(staff)}
                            className="p-1.5 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title={staff.trang_thai === "Dang hoat dong" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {staff.trang_thai === "Dang hoat dong" ? <Lock size={15} /> : <Unlock size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-4 text-gray-800">
              <h3 className="text-xl font-bold text-gray-900">{editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Họ và tên *</label>
                  <input
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                    value={form.ho_ten}
                    onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0901234567"
                    value={form.sdt}
                    onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  />
                </div>

                {!editing && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Mật khẩu khởi tạo *</label>
                    <input
                      type="password"
                      className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      placeholder="Nhập mật khẩu (Mặc định: 123456)"
                      value={form.mat_khau || "123456"}
                      onChange={(e) => setForm({ ...form, mat_khau: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={form.ngay_sinh}
                    onChange={(e) => setForm({ ...form, ngay_sinh: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Giới tính</label>
                  <select
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={form.gioi_tinh}
                    onChange={(e) => setForm({ ...form, gioi_tinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                    <option value="Khac">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="079098000000"
                    value={form.cccd}
                    onChange={(e) => setForm({ ...form, cccd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Vai trò *</label>
                  <select
                    className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={form.vai_tro}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    <option value="Nhân viên chi nhánh">Nhân viên chi nhánh</option>
                    <option value="Quản lý vận hành">Quản lý vận hành</option>
                  </select>
                </div>

                {form.vai_tro === "Nhân viên chi nhánh" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Chi nhánh phụ trách *</label>
                    <select
                      className="w-full border rounded-lg px-3.5 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={form.ma_chi_nhanh}
                      onChange={(e) => setForm({ ...form, ma_chi_nhanh: e.target.value })}
                    >
                      {branches.length === 0 ? (
                        <option value="">Chưa có chi nhánh nào trong hệ thống</option>
                      ) : (
                        branches.map((b) => (
                          <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>
                            {b.ten_chi_nhanh} ({b.dia_chi || b.khu_vuc})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setForm(emptyForm);
                  }}
                  className="px-4 py-2 text-xs font-semibold border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                >
                  {editing ? "Cập nhật" : "Thêm nhân viên"}
                </button>
              </div>
            </div>
          </div>
        )}

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default StaffManagementPage;