import React, { useMemo, useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import { mockStore } from "../../../../shared/store/mockDataStore";

export function StaffManagementPage() {
  const activePartner = mockStore.getActivePartner();

  const [staffs, setStaffs] = useState(
    mockStore.getStaffsByPartner(activePartner.ma_hs)
  );

  const [toastMessage, setToastMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const emptyForm = {
    ma_nv: "",
    ho_ten: "",
    email: "",
    sdt: "",
    vai_tro: "Nhân viên chi nhánh",
    chi_nhanh_phu_trach: "",
    trang_thai: "Dang hoat dong",
  };

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const reload = () => {
    setStaffs(mockStore.getStaffsByPartner(activePartner.ma_hs));
  };

  const roles = [
    "All",
    "Nhân viên chi nhánh",
    "Quản lý vận hành",
  ];

  const statuses = [
    "All",
    "Đang hoạt động",
    "Tạm khóa",
    "Tạm ngừng",
  ];

  const filteredStaffs = useMemo(() => {
    return staffs.filter((s) => {
      const matchSearch =
        s.ho_ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sdt.includes(searchQuery);

      const matchRole =
        roleFilter === "All" || s.vai_tro === roleFilter;

      const matchStatus =
        statusFilter === "All" || s.trang_thai === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [staffs, searchQuery, roleFilter, statusFilter]);

  const handleAdd = () => {
    setEditing(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (staff) => {
    setEditing(true);
    setForm({
      ...staff,
      chi_nhanh_phu_trach:
        staff.chi_nhanh_phu_trach.join(", "),
    });
    setShowModal(true);
  };

  const handleSave = () => {
    let data = mockStore.getData();

    if (editing) {
      data.staffs = data.staffs.map((s) =>
        s.ma_nv === form.ma_nv
          ? {
              ...form,
              ma_hs: activePartner.ma_hs,
              chi_nhanh_phu_trach:
                form.chi_nhanh_phu_trach
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
            }
          : s
      );

      setToastMessage("Cập nhật nhân viên thành công.");
    } else {
      data.staffs.unshift({
        ...form,
        ma_nv: "nv-" + Date.now(),
        ma_hs: activePartner.ma_hs,
        ngay_tao: new Date().toISOString().slice(0, 10),
        chi_nhanh_phu_trach:
          form.chi_nhanh_phu_trach
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
      });

      setToastMessage("Thêm nhân viên thành công.");
    }

    mockStore.saveData(data);

    reload();

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Xóa nhân viên này?")) return;

    let data = mockStore.getData();

    data.staffs = data.staffs.filter(
      (s) => s.ma_nv !== id
    );

    mockStore.saveData(data);

    reload();

    setToastMessage("Đã xóa nhân viên.");
  };

  const handleLock = (staff) => {
    let data = mockStore.getData();

    data.staffs = data.staffs.map((s) =>
      s.ma_nv === staff.ma_nv
        ? {
            ...s,
            trang_thai:
              s.trang_thai === "Dang hoat dong"
                ? "Tam khoa"
                : "Dang hoat dong",
          }
        : s
    );

    mockStore.saveData(data);

    reload();

    setToastMessage("Đã cập nhật trạng thái.");
  };

  return (
    <PartnerLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Nhân viên
            </h2>

            <p className="text-slate-500 mt-1">
              Quản lý tài khoản nhân viên của doanh nghiệp.
            </p>

          </div>

          <Button
            variant="success"
            icon="➕"
            onClick={handleAdd}
          >
            Thêm nhân viên
          </Button>

        </div>

        <Card padding={false} className="p-4">

          <div className="flex gap-4 flex-wrap">

            <input
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="Tìm tên, email..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
            />

            <select
              className="border rounded-lg px-3 py-2"
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
            >
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              className="border rounded-lg px-3 py-2"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

          </div>

        </Card>
                <Card padding={false}>
          {filteredStaffs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Không có nhân viên nào.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-slate-50 text-xs uppercase text-slate-500 border-b">

                    <th className="px-4 py-3 text-left">
                      Nhân viên
                    </th>

                    <th className="px-4 py-3 text-left">
                      Vai trò
                    </th>

                    <th className="px-4 py-3 text-left">
                      Chi nhánh
                    </th>

                    <th className="px-4 py-3 text-left">
                      Trạng thái
                    </th>

                    <th className="px-4 py-3 text-left">
                      Ngày tạo
                    </th>

                    <th className="px-4 py-3 text-right">
                      Thao tác
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredStaffs.map((staff) => (

                    <tr
                      key={staff.ma_nv}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">

                            {staff.ho_ten.charAt(0)}

                          </div>

                          <div>

                            <div className="font-semibold">

                              {staff.ho_ten}

                            </div>

                            <div className="text-xs text-slate-500">

                              {staff.email}

                            </div>

                            <div className="text-xs text-slate-400">

                              {staff.sdt}

                            </div>

                          </div>

                        </div>

                      </td>

                      <td className="px-4 py-4">

                        {staff.vai_tro}

                      </td>

                      <td className="px-4 py-4">

                        {staff.chi_nhanh_phu_trach.length === 0
                          ? "-"
                          : staff.chi_nhanh_phu_trach.join(", ")}

                      </td>

                      <td className="px-4 py-4">

                        <Badge
                          status={staff.trang_thai}
                          size="sm"
                        />

                      </td>

                      <td className="px-4 py-4">

                        {staff.ngay_tao}

                      </td>

                      <td className="px-4 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(staff)}
                          >
                            ✏️
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLock(staff)}
                          >
                            {staff.trang_thai === "Dang hoat dong"
                              ? "🔒"
                              : "🔓"}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(staff.ma_nv)
                            }
                          >
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
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">

            <div className="bg-white rounded-xl w-full max-w-xl p-6">

              <h3 className="text-xl font-bold mb-5">

                {editing
                  ? "Chỉnh sửa nhân viên"
                  : "Thêm nhân viên"}

              </h3>

              <div className="space-y-4">

                <input
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Họ tên"
                  value={form.ho_ten}
                  onChange={(e)=>
                    setForm({
                      ...form,
                      ho_ten:e.target.value
                    })
                  }
                />

                <input
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e)=>
                    setForm({
                      ...form,
                      email:e.target.value
                    })
                  }
                />

                <input
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Số điện thoại"
                  value={form.sdt}
                  onChange={(e)=>
                    setForm({
                      ...form,
                      sdt:e.target.value
                    })
                  }
                />

                <select
                  className="w-full border rounded-lg px-4 py-2"
                  value={form.vai_tro}
                  onChange={(e)=>
                    setForm({
                      ...form,
                      vai_tro:e.target.value
                    })
                  }
                >
                  <option>Nhân viên chi nhánh</option>
                  <option>Quản lý vận hành</option>
                </select>

                <input
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Chi nhánh (phân cách dấu phẩy)"
                  value={form.chi_nhanh_phu_trach}
                  onChange={(e)=>
                    setForm({
                      ...form,
                      chi_nhanh_phu_trach:e.target.value
                    })
                  }
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <Button
                  variant="secondary"
                  onClick={()=>{
                    setShowModal(false);
                    setForm(emptyForm);
                  }}
                >
                  Hủy
                </Button>

                <Button
                  variant="primary"
                  onClick={handleSave}
                >
                  {editing ? "Cập nhật" : "Thêm"}
                </Button>

              </div>

            </div>

          </div>
        )}
                <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />

      </div>

    </PartnerLayout>
  );
}

export default StaffManagementPage;