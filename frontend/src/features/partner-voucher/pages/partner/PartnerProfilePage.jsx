import React, { useEffect, useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import { getPartnerByIdApi, updatePartnerApi } from "../../../../shared/api/partnerApi";

export function PartnerProfilePage() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    ten_dn: "",
    ma_so_thue: "",
    dia_chi: "",
    ho_ten: "",
    sdt: "",
    email: "",
    cccd: "",
  });

  const getActiveUser = () => {
    try {
      const userStr = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  };

  const loadPartner = async () => {
    setLoading(true);
    const activeUser = getActiveUser();
    const targetId = activeUser?.ma_hsdn || activeUser?.ma_hs || activeUser?.id || activeUser?.ma_nguoi_dung || "20000000-0000-0000-0000-000000000001";

    const data = await getPartnerByIdApi(targetId);
    if (data) {
      setPartner(data);
      setFormData({
        ten_dn: data.ten_dn || "",
        ma_so_thue: data.ma_so_thue || "",
        dia_chi: data.dia_chi || "",
        ho_ten: data.nguoi_dai_dien?.ho_ten || "",
        sdt: data.nguoi_dai_dien?.sdt || "",
        email: data.nguoi_dai_dien?.email || "",
        cccd: data.nguoi_dai_dien?.cccd || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartner();
  }, []);

  const handleSave = async () => {
    if (!partner?.ma_hs) return;
    setSaving(true);

    await updatePartnerApi(partner.ma_hs, {
      ten_dn: formData.ten_dn,
      ma_so_thue: formData.ma_so_thue,
      dia_chi: formData.dia_chi,
      trang_thai: "Cho duyet",
      ly_do_tu_choi: "",
      nguoi_dai_dien: {
        ho_ten: formData.ho_ten,
        sdt: formData.sdt,
        email: formData.email,
        cccd: formData.cccd,
      },
    });

    setSaving(false);
    setIsEditing(false);
    setToastMessage("Cập nhật hồ sơ thành công! Đã chuyển trạng thái sang Chờ duyệt.");
    await loadPartner();
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="p-8 text-center text-slate-500">Đang tải hồ sơ doanh nghiệp...</div>
      </PartnerLayout>
    );
  }

  if (!partner) {
    return (
      <PartnerLayout>
        <div className="p-8 text-center text-slate-500">Không tìm thấy thông tin đối tác.</div>
      </PartnerLayout>
    );
  }

  const isRejected = partner.trang_thai === "Tu choi";
  const isPending = partner.trang_thai === "Cho duyet";

  return (
    <PartnerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Hồ Sơ Doanh Nghiệp & Pháp Lý</h2>
            <p className="text-sm text-slate-500 mt-1">Quản lý thông tin công ty, giấy phép đăng ký kinh doanh và người đại diện</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={partner.trang_thai} />
            {!isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </div>

        {/* Rejection Reason Highlight Banner */}
        {isRejected && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-900 text-sm">Hồ sơ đã bị Quản trị viên từ chối phê duyệt</h4>
                <p className="text-xs text-rose-700 font-medium">
                  Lý do từ chối: <span className="italic font-normal">{partner.ly_do_tu_choi || "Thông tin hồ sơ chưa đủ điều kiện pháp lý."}</span>
                </p>
                <div className="pt-2">
                  <Button variant="danger" size="sm" onClick={() => setIsEditing(true)}>
                    Khắc phục thông tin & Gửi lại yêu cầu xét duyệt
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Banner */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>⏳</span>
              <span>Hồ sơ đang ở trạng thái <strong>"Chờ duyệt"</strong>. Quản trị viên đang thẩm định thông tin của bạn.</span>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <Card title="Thông Tin Pháp Lý Doanh Nghiệp">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Doanh Nghiệp</label>
                  <input
                    type="text"
                    value={formData.ten_dn}
                    onChange={(e) => setFormData({ ...formData, ten_dn: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số thuế / MST</label>
                  <input
                    type="text"
                    value={formData.ma_so_thue}
                    onChange={(e) => setFormData({ ...formData, ma_so_thue: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ đăng ký kinh doanh</label>
                <input
                  type="text"
                  value={formData.dia_chi}
                  onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <h4 className="font-semibold text-slate-900 pt-4 border-t border-slate-100 text-sm">Người Đại Diện Pháp Luật</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.sdt}
                    onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số CCCD</label>
                  <input
                    type="text"
                    value={formData.cccd}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>Hủy bỏ</Button>
                <Button variant="primary" onClick={handleSave} loading={saving}>Lưu & Gửi lại yêu cầu xét duyệt</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Business Info Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Tên Doanh Nghiệp:</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{partner.ten_dn}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Mã số thuế / MST:</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{partner.ma_so_thue}</div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs text-slate-400 font-medium">Địa chỉ đăng ký kinh doanh:</span>
                  <div className="text-sm font-medium text-slate-800 mt-0.5">{partner.dia_chi}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Thông Tin Người Đại Diện</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Họ và tên:</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.ho_ten}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Số điện thoại:</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.sdt}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Email:</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.email}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">CCCD:</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.cccd}</div>
                  </div>
                </div>
              </div>

              {/* License Document Preview */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Giấy Phép Đăng Ký Kinh Doanh</h4>
                <div className="flex items-center gap-4">
                  <img
                    src={partner.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"}
                    alt="Giấy phép kinh doanh"
                    className="w-36 h-24 object-cover rounded-lg border border-slate-200 shadow-xs"
                  />
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-slate-800">File_GiayPhepKinhDoanh_Certified.pdf</div>
                    <div className="text-slate-400">Định dạng: Đã xác thực trên hệ thống</div>
                    {partner.giay_phep_kinh_doanh && (
                      <a
                        href={partner.giay_phep_kinh_doanh}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-blue-600 font-medium hover:underline pt-1"
                      >
                        🔗 Xem bản phóng to
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default PartnerProfilePage;