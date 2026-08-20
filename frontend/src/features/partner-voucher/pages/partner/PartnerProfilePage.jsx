import React, { useEffect, useState } from "react";
import PartnerLayout from "../../../../layouts/PartnerLayout";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Badge from "../../../../shared/components/Badge";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import {
  getPartnerByIdApi,
  updatePartnerApi,
  createPartnerProfileRequestApi,
  getPendingPartnerProfileRequestApi,
  changePartnerPasswordApi,
} from "../../../../shared/api/partnerApi";
import { useTranslation } from "react-i18next";

export function PartnerProfilePage() {
  const { t } = useTranslation();
  const [partner, setPartner] = useState(null);
  const [pendingProfileReq, setPendingProfileReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    ten_dn: "",
    ma_so_thue: "",
    dia_chi: "",
    ho_ten: "",
    sdt: "",
    email: "",
    cccd: "",
    ngay_sinh: "",
    gioi_tinh: "Nam",
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
    const targetId = activeUser?.ma_hsdn || activeUser?.ma_hs || activeUser?.id || activeUser?.ma_nguoi_dung;
    if (!targetId) {
      setLoading(false);
      return;
    }

    const data = await getPartnerByIdApi(targetId);
    if (data) {
      setPartner(data);
      setFormData({
        ten_dn: data.ten_dn || "",
        ma_so_thue: data.ma_so_thue || "",
        dia_chi: data.dia_chi || "",
        giay_phep_kinh_doanh: data.giay_phep_kinh_doanh || "",
        logo: data.logo || "",
        ho_ten: data.nguoi_dai_dien?.ho_ten || "",
        sdt: data.nguoi_dai_dien?.sdt || "",
        email: data.nguoi_dai_dien?.email || "",
        cccd: data.nguoi_dai_dien?.cccd || "",
        ngay_sinh: data.nguoi_dai_dien?.ngay_sinh ? data.nguoi_dai_dien.ngay_sinh.slice(0, 10) : "",
        gioi_tinh: data.nguoi_dai_dien?.gioi_tinh || "Nam",
      });

      // Check pending profile update request
      const req = await getPendingPartnerProfileRequestApi(targetId);
      setPendingProfileReq(req);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPartner();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToastMessage("Dung lượng file vượt quá 10MB. Vui lòng chọn tệp nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      setFormData((prev) => ({ ...prev, giay_phep_kinh_doanh: dataUrl }));
      setToastMessage(`Đã tải lên tệp "${file.name}" mới thành công!`);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setToastMessage("Dung lượng tệp Logo vượt quá 10MB. Vui lòng chọn tệp nhỏ hơn.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      setFormData((prev) => ({ ...prev, logo: dataUrl }));
      setToastMessage(`Đã tải lên tệp Logo "${file.name}" mới thành công!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!partner?.ma_hs) return;
    if (partner.trang_thai === "Cho duyet" || pendingProfileReq) {
      setToastMessage("Hồ sơ đang ở trạng thái Chờ duyệt, tạm thời không thể chỉnh sửa.");
      setIsEditing(false);
      return;
    }
    if (formData.sdt && !/^\d{10}$/.test(formData.sdt.trim())) {
      setToastMessage("Số điện thoại phải bao gồm đúng 10 chữ số.");
      return;
    }
    if (formData.cccd && !/^\d{12}$/.test(formData.cccd.trim())) {
      setToastMessage("Số CCCD phải bao gồm đúng 12 chữ số.");
      return;
    }

    setSaving(true);
    try {
      await createPartnerProfileRequestApi({
        ma_hs: partner.ma_hs,
        ten_dn_moi: formData.ten_dn,
        ma_so_thue_moi: formData.ma_so_thue,
        dia_chi_moi: formData.dia_chi,
        giay_phep_kinh_doanh_moi: formData.giay_phep_kinh_doanh,
        logo_new: formData.logo,
        ho_ten_nguoi_dai_dien_moi: formData.ho_ten,
        sdt_nguoi_dai_dien_moi: formData.sdt,
        email_nguoi_dai_dien_moi: formData.email,
        cccd_moi: formData.cccd,
        ngay_sinh: formData.ngay_sinh,
        gioi_tinh: formData.gioi_tinh,
        trang_thai: "Cho duyet",
      });
      setToastMessage("Đã gửi Yêu cầu Cập nhật Hồ sơ Doanh nghiệp tới Quản trị viên!");
    } catch (e) {
      setToastMessage("Gửi yêu cầu thất bại: " + e.message);
    }
    setSaving(false);
    setIsEditing(false);
    await loadPartner();
  };

  const handleChangePasswordConfirm = async () => {
    if (!passwordForm.oldPassword) {
      setToastMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setToastMessage("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToastMessage("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePartnerPasswordApi(partner.ma_hs, passwordForm);
      setToastMessage("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setToastMessage(e.message || "Đổi mật khẩu thất bại.");
    }
    setChangingPassword(false);
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
  const hasPendingReq = !!pendingProfileReq;
  const canEdit = !isPending && !hasPendingReq && !isEditing;

  return (
    <PartnerLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t("Hồ Sơ Doanh Nghiệp & Pháp Lý")}</h2>
            <p className="text-sm text-slate-500 mt-1">{t("Quản lý thông tin công ty, giấy phép đăng ký kinh doanh và người đại diện")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge status={partner.trang_thai} />
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
              {t("Đổi mật khẩu")}
            </Button>
            {canEdit && (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                {t("Chỉnh sửa hồ sơ")}
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
                <h4 className="font-bold text-rose-900 text-sm">{t("Hồ sơ đã bị Quản trị viên từ chối phê duyệt")}</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {t("Lý do từ chối:")} <span className="italic font-normal">{partner.ly_do_tu_choi || t("Thông tin hồ sơ chưa đủ điều kiện pháp lý.")}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Profile Update Request Banner */}
        {pendingProfileReq && (pendingProfileReq.trang_thai === "Cho duyet" || pendingProfileReq.trang_thai === "Cho xu ly") && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <span>{t("Bạn có 1 Yêu cầu cập nhật hồ sơ doanh nghiệp đang chờ Quản trị viên duyệt")}</span>
            </div>
            <div className="text-gray-700 grid grid-cols-2 gap-1 pt-1 bg-white/70 p-2.5 rounded-lg border border-amber-100">
              {pendingProfileReq.ten_dn_moi && <div>• {t("Tên DN mới đề xuất:")} <strong>{pendingProfileReq.ten_dn_moi}</strong></div>}
              {pendingProfileReq.dia_chi_moi && <div>• {t("Địa chỉ trụ sở mới:")} <strong>{pendingProfileReq.dia_chi_moi}</strong></div>}
              {pendingProfileReq.ho_ten_nguoi_dai_dien_moi && <div>• {t("Người đại diện mới:")} <strong>{pendingProfileReq.ho_ten_nguoi_dai_dien_moi}</strong></div>}
              {pendingProfileReq.sdt_nguoi_dai_dien_moi && <div>• {t("SĐT mới:")} <strong>{pendingProfileReq.sdt_nguoi_dai_dien_moi}</strong></div>}
            </div>
          </div>
        )}

        {/* Rejected Profile Update Request Banner */}
        {pendingProfileReq && pendingProfileReq.trang_thai === "Tu choi" && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="space-y-1">
                <h4 className="font-bold text-rose-900 text-sm">{t("Yêu cầu cập nhật hồ sơ doanh nghiệp gần đây đã bị từ chối")}</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {t("Lý do từ chối:")} <span className="italic font-normal">{pendingProfileReq.ly_do_tu_choi || t("Thông tin đề xuất mới chưa phù hợp quy định.")}</span>
                </p>
                <div className="pt-2">
                  <Button variant="danger" size="sm" onClick={() => setIsEditing(true)}>
                    {t("Khắc phục thông tin & Gửi lại đề xuất mới")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Initial Partner Banner */}
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{t("Hồ sơ đối tác mới đăng ký đang ở trạng thái")} <strong>"{t("Chờ duyệt")}"</strong>. {t("Quản trị viên đang thẩm định thông tin của bạn.")}</span>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <Card title={t("Thông Tin Pháp Lý Doanh Nghiệp")}>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Tên Doanh Nghiệp")}</label>
                  <input
                    type="text"
                    value={formData.ten_dn}
                    onChange={(e) => setFormData({ ...formData, ten_dn: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{t("Mã số thuế / MST")}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({t("Cố định - Không thể chỉnh sửa")})</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ma_so_thue}
                    disabled
                    readOnly
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Địa chỉ đăng ký kinh doanh")}</label>
                <input
                  type="text"
                  value={formData.dia_chi}
                  onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <h4 className="font-semibold text-slate-900 pt-4 border-t border-slate-100 text-sm">{t("Người Đại Diện Pháp Luật")}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Họ và tên")}</label>
                  <input
                    type="text"
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{t("Số điện thoại")}</span>
                    <span className={`text-xs font-semibold ${formData.sdt?.length === 10 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                      {formData.sdt?.length || 0}/10 {t("chữ số")}
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.sdt}
                    onChange={(e) => setFormData({ ...formData, sdt: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Email")}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{t("Số CCCD / CMND")}</span>
                    <span className={`text-xs font-semibold ${formData.cccd?.length === 12 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                      {formData.cccd?.length || 0}/12 {t("chữ số")}
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.cccd}
                    onChange={(e) => setFormData({ ...formData, cccd: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Ngày sinh")}</label>
                  <input
                    type="date"
                    value={formData.ngay_sinh}
                    onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Giới tính")}</label>
                  <select
                    value={formData.gioi_tinh}
                    onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Nam">{t("Nam")}</option>
                    <option value="Nu">{t("Nữ")}</option>
                    <option value="Khac">{t("Khác")}</option>
                  </select>
                </div>
              </div>

              <h4 className="font-semibold text-slate-900 pt-4 border-t border-slate-100 text-sm">{t("Hình Ảnh Logo Thương Hiệu & Giấy Phép Pháp Lý")}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Upload Box */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700">{t("Logo Thương Hiệu Doanh Nghiệp (Hiển thị trên Landing Page)")}</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo xem trước"
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 object-contain rounded-xl border border-slate-300 shadow-xs bg-white p-1"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-xs text-slate-400">
                        {t("Chưa có logo")}
                      </div>
                    )}

                    <div className="space-y-2">
                      <input
                        type="file"
                        id="profile-logo-upload-input"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="profile-logo-upload-input"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                      >
                        🖼️ {t("Tải lên Logo mới (PNG, JPG)")}
                      </label>
                      <p className="text-[11px] text-slate-500">{t("Kích thước khuyên dùng: Vuông (1:1), PNG/JPG (tối đa 10MB). Tự động lưu trên Supabase Storage.")}</p>
                    </div>
                  </div>
                </div>

                {/* License Upload Box */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700">{t("Giấy phép kinh doanh mới (Tệp pháp lý)")}</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {formData.giay_phep_kinh_doanh ? (
                      <img
                        src={formData.giay_phep_kinh_doanh}
                        alt="Giấy phép xem trước"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-300 shadow-xs bg-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-xs text-slate-400">
                        {t("Chưa có tệp")}
                      </div>
                    )}

                    <div className="space-y-2">
                      <input
                        type="file"
                        id="profile-license-upload-input"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="profile-license-upload-input"
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                      >
                        📁 {t("Tải GPKD mới (Ảnh/PDF)")}
                      </label>
                      <p className="text-[11px] text-slate-500">{t("Hỗ trợ PNG, JPG, PDF (tối đa 10MB). Lưu trữ trên Supabase Storage.")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>{t("Hủy bỏ")}</Button>
                <Button variant="primary" onClick={handleSave} loading={saving}>{t("Lưu & Gửi lại yêu cầu xét duyệt")}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Business Info Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-slate-400 font-medium">{t("Tên Doanh Nghiệp:")}</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{partner.ten_dn}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">{t("Mã số thuế / MST:")}</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{partner.ma_so_thue}</div>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs text-slate-400 font-medium">{t("Địa chỉ đăng ký kinh doanh:")}</span>
                  <div className="text-sm font-medium text-slate-800 mt-0.5">{partner.dia_chi}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{t("Thông Tin Người Đại Diện")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Họ và tên:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.ho_ten || t("Chưa cập nhật")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Số điện thoại:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.sdt || t("Chưa cập nhật")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Email:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.email || t("Chưa cập nhật")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Số CCCD / CMND:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.cccd || t("Chưa cập nhật")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Ngày sinh:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.ngay_sinh ? partner.nguoi_dai_dien.ngay_sinh.slice(0, 10) : t("Chưa cập nhật")}</div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{t("Giới tính:")}</span>
                    <div className="text-sm font-semibold text-slate-900 mt-0.5">{partner.nguoi_dai_dien?.gioi_tinh === "Nu" ? t("Nữ") : partner.nguoi_dai_dien?.gioi_tinh === "Nam" ? t("Nam") : t("Khác")}</div>
                  </div>
                </div>
              </div>

              {/* Logo & License Document Preview */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t("Logo Thương Hiệu Hiện Tại")}</h4>
                  <div className="flex items-center gap-4">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt="Logo doanh nghiệp"
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 object-contain rounded-xl border border-slate-200 shadow-xs bg-white p-1"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium">
                        {t("Chưa thiết lập")}
                      </div>
                    )}
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-slate-800">{t("Logo chính thức đối tác")}</div>
                      <div className="text-slate-400">{t("Hiển thị tại danh mục & slider Landing Page")}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t("Giấy Phép Đăng Ký Kinh Doanh")}</h4>
                  <div className="flex items-center gap-4">
                    <img
                      src={partner.giay_phep_kinh_doanh || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"}
                      alt="Giấy phép kinh doanh"
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
                    />
                    <div className="text-xs space-y-1">
                      <div className="font-semibold text-slate-800">{t("Giấy phép kinh doanh chính thức")}</div>
                      <div className="text-slate-400">{t("Định dạng: Đã xác thực trên hệ thống")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <Modal
            isOpen={true}
            onClose={() => setShowPasswordModal(false)}
            onConfirm={handleChangePasswordConfirm}
            title={t("Đổi Mật Khẩu Tài Khoản")}
            confirmText={changingPassword ? t("Đang xử lý...") : t("Xác nhận đổi mật khẩu")}
            confirmVariant="primary"
          >
            <div className="space-y-3 text-left">
              <p className="text-xs text-slate-500">
                {t("Nhập mật khẩu hiện tại và mật khẩu mới để bảo mật tài khoản đối tác của bạn.")}
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Mật khẩu hiện tại")}</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder={t("Nhập mật khẩu hiện tại...")}
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Mật khẩu mới (tối thiểu 6 ký tự)")}</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder={t("Nhập mật khẩu mới...")}
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t("Xác nhận mật khẩu mới")}</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder={t("Nhập lại mật khẩu mới...")}
                  className="w-full px-3 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Modal>
        )}

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </PartnerLayout>
  );
}

export default PartnerProfilePage;