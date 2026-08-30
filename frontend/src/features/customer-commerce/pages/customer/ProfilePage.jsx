import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from "../../../../shared/api/customerApi";

function PwField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-base focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(() => setErrorMsg(t("Không thể tải thông tin hồ sơ.")))
      .finally(() => setLoading(false));
  }, [t]);

  const handleSaveProfile = async () => {
    setFieldErrors({});
    setSaving(true);
    try {
      const updated = await updateProfile({
        ho_ten: profile.ho_ten,
        email: profile.email,
        sdt: profile.sdt,
        ngay_sinh: profile.ngay_sinh,
        gioi_tinh: profile.gioi_tinh,
      });
      setProfile(updated);
      toast.success(t("Cập nhật hồ sơ thành công!"));
    } catch (err) {
      if (err.details?.fieldErrors) setFieldErrors(err.details.fieldErrors); // A7
      toast.error(t(err.message || "Cập nhật hồ sơ thất bại.")); // E2
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError("");
    setChangingPw(true);
    try {
      await changePassword({
        oldPassword: oldPw,
        newPassword: newPw,
        confirmPassword: confirmPw,
      });
      setOldPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success(t("Đổi mật khẩu thành công!"));
    } catch (err) {
      setPwError(t(err.message || "Đổi mật khẩu thất bại."));
    } finally {
      setChangingPw(false);
    }
  };

  if (loading)
    return (
      <div className="py-16 text-center text-gray-400 text-base">
        {t("Đang tải hồ sơ...")}
      </div>
    );
  if (errorMsg)
    return (
      <div className="py-16 text-center text-red-500 text-base">
        {t(errorMsg)}
      </div>
    );
  if (!profile) return null;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        {t("Tài khoản của tôi")}
      </h1>

      <div className="flex bg-white border border-gray-300 rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab("info")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-base font-medium transition-colors ${tab === "info" ? "bg-sky-500 text-white shadow-sm" : "text-gray-600"}`}
        >
          <User size={18} /> {t("Hồ sơ cá nhân")}
        </button>
        <button
          onClick={() => setTab("password")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-base font-medium transition-colors ${tab === "password" ? "bg-sky-500 text-white shadow-sm" : "text-gray-600"}`}
        >
          <Lock size={18} /> {t("Đổi mật khẩu")}
        </button>
      </div>

      {tab === "info" && (
        <div className="bg-white rounded-xl border border-gray-300 p-5 space-y-3">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-2">
              <User size={28} className="text-orange-500" />
            </div>
            <p className="text-base font-semibold text-gray-900">
              {profile.ho_ten}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("Họ và tên")} <span className="text-red-500">*</span>
            </label>
            <input
              value={profile.ho_ten || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, ho_ten: e.target.value }))
              }
              className={`w-full border rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 ${fieldErrors.ho_ten ? "border-red-300" : "border-gray-300"}`}
            />
            {fieldErrors.ho_ten && (
              <p className="text-sm text-red-500 mt-1">
                {t(fieldErrors.ho_ten)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className={`w-full border rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 ${fieldErrors.email ? "border-red-300" : "border-gray-300"}`}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-500 mt-1">
                {t(fieldErrors.email)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("Số điện thoại")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={profile.sdt || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, sdt: e.target.value }))
              }
              className={`w-full border rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 ${fieldErrors.sdt ? "border-red-300" : "border-gray-300"}`}
            />
            {fieldErrors.sdt && (
              <p className="text-sm text-red-500 mt-1">{t(fieldErrors.sdt)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("Ngày sinh")}
            </label>
            <input
              type="date"
              value={profile.ngay_sinh || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, ngay_sinh: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {t("Giới tính")}
            </label>
            <select
              value={profile.gioi_tinh || ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, gioi_tinh: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
            >
              <option value="">-- {t("Chọn")} --</option>
              <option value="Nam">{t("Nam")}</option>
              <option value="Nu">{t("Nữ")}</option>
              <option value="Khac">{t("Khác")}</option>
            </select>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-2.5 rounded-xl font-semibold text-base hover:bg-sky-600 disabled:opacity-50 mt-2"
          >
            <Save size={15} /> {saving ? t("Đang lưu...") : t("Lưu thay đổi")}
          </button>
        </div>
      )}

      {tab === "password" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <PwField
            label={t("Mật khẩu hiện tại *")}
            value={oldPw}
            onChange={setOldPw}
            placeholder={t("Nhập mật khẩu hiện tại")}
          />
          <PwField
            label={t("Mật khẩu mới *")}
            value={newPw}
            onChange={setNewPw}
            placeholder={t("Tối thiểu 6 ký tự")}
          />
          <PwField
            label={t("Xác nhận mật khẩu mới *")}
            value={confirmPw}
            onChange={setConfirmPw}
            placeholder={t("Nhập lại mật khẩu mới")}
          />

          {pwError && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={12} /> {t(pwError)}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={changingPw}
            className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-2.5 rounded-xl font-semibold text-base hover:bg-sky-600 disabled:opacity-50"
          >
            <Lock size={15} />
            {changingPw ? t("Đang xử lý...") : t("Đổi mật khẩu")}
          </button>
        </div>
      )}
    </div>
  );
}
