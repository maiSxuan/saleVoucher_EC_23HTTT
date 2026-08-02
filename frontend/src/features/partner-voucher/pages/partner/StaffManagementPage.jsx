import React, { useEffect, useMemo, useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import {
  getStaffsByPartnerApi,
  createStaffApi,
  updateStaffApi,
  deleteStaffApi,
  getPartnerByIdApi,
  getBranchesByPartnerApi,
} from "../../../../shared/api/partnerApi";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function StaffManagementPage() {
  const activePartnerFromStore = mockStore.getActivePartner();
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
    const targetId = activeUser?.id || activeUser?.accountId || activePartnerFromStore?.ma_hs || "20000000-0000-0000-0000-000000000001";

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
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Nhân viên</h2>
            <p className="text-slate-500 mt-1">Quản lý tài khoản nhân viên của doanh nghiệp.</p>
          </div>
          <Button variant="success" icon="➕" onClick={handleAdd}>
            Thêm nhân viên
          </Button>
        </div>

        <Card padding={false} className="p-4">
          <div className="flex gap-4 flex-wrap">
            <input
              className="flex-1 border rounded-lg px-4 py-2 text-sm"
              placeholder="Tìm tên, email, SĐT, CCCD..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card padding={false}>
          {loading ? (
            <div className="p-12 text-center text-slate-400">Đang tải danh sách nhân viên...</div>
          ) : filteredStaffs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">Không có nhân viên nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                    <th className="px-4 py-3 text-left">Nhân viên</th>
                    <th className="px-4 py-3 text-left">Thông tin cá nhân</th>
                    <th className="px-4 py-3 text-left">Vai trò</th>
                    <th className="px-4 py-3 text-left">Chi nhánh phụ trách</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStaffs.map((staff) => (
                    <tr key={staff.ma_nv} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-base font-bold text-blue-700 shrink-0">
                            {staff.ho_ten?.charAt(0) || "N"}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{staff.ho_ten}</div>
                            <div className="text-xs text-slate-500">{staff.email || "Chưa có email"}</div>
                            <div className="text-xs text-slate-400">{staff.sdt || "Chưa có SĐT"}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs space-y-0.5 text-slate-600">
                        <div><span className="font-medium text-slate-700">Giới tính:</span> {staff.gioi_tinh === "Nu" ? "Nữ" : staff.gioi_tinh === "Nam" ? "Nam" : "Khác"}</div>
                        <div><span className="font-medium text-slate-700">Ngày sinh:</span> {staff.ngay_sinh ? staff.ngay_sinh.slice(0, 10) : "Chưa cập nhật"}</div>
                        <div><span className="font-medium text-slate-700">CCCD:</span> {staff.cccd || "Chưa cập nhật"}</div>
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-800">{staff.vai_tro}</td>

                      <td className="px-4 py-4">
                        {staff.vai_tro === "Nhân viên chi nhánh" ? (
                          !staff.chi_nhanh_phu_trach || staff.chi_nhanh_phu_trach.length === 0 ? (
                            <span className="text-slate-400 font-italic">Chưa phân công</span>
                          ) : (
                            <span className="font-medium text-slate-800">{staff.chi_nhanh_phu_trach.join(", ")}</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">Tất cả chi nhánh (Quản lý)</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Badge status={staff.trang_thai} size="sm" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(staff)}>
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleLock(staff)}>
                            {staff.trang_thai === "Dang hoat dong" ? "🔒" : "🔓"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(staff.ma_nv)}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-xl space-y-4">
              <h3 className="text-xl font-bold">{editing ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                    value={form.ho_ten}
                    onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="email@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0901234567"
                    value={form.sdt}
                    onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={form.ngay_sinh}
                    onChange={(e) => setForm({ ...form, ngay_sinh: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={form.gioi_tinh}
                    onChange={(e) => setForm({ ...form, gioi_tinh: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                    <option value="Khac">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="079098000000"
                    value={form.cccd}
                    onChange={(e) => setForm({ ...form, cccd: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò *</label>
                  <select
                    className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={form.vai_tro}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    <option value="Nhân viên chi nhánh">Nhân viên chi nhánh</option>
                    <option value="Quản lý vận hành">Quản lý vận hành</option>
                  </select>
                </div>

                {/* Single Branch Select - ONLY visible when role is 'Nhân viên chi nhánh' */}
                {form.vai_tro === "Nhân viên chi nhánh" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Chi nhánh phụ trách *</label>
                    <select
                      className="w-full border rounded-lg px-3.5 py-2 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    setForm(emptyForm);
                  }}
                >
                  Hủy
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  {editing ? "💾 Cập nhật" : "➕ Thêm nhân viên"}
                </Button>
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