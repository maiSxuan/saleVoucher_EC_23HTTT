import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import Toast from "../../../../shared/components/Toast";
import Modal from "../../../../shared/components/Modal";
import {
  registerPartnerAccountApi,
  registerPartnerProfileApi,
  checkTaxCodeApi,
  requestPartnerOtpApi,
  verifyPartnerOtpApi,
  resendPartnerOtpApi,
} from "../../../../shared/api/partnerApi";
import { VIETNAM_PROVINCES } from "../../../../shared/constants/vietnamProvinces";

export function PartnerRegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  // OTP Verification Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState("");

  useEffect(() => {
    let timer;
    if (showOtpModal && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpCountdown]);

  const [formData, setFormData] = useState({
    // Step 1: Account Creation
    account_email: "",
    account_password: "",
    account_confirm_password: "",
    account_ho_ten: "",
    account_sdt: "",

    // Step 2: Business Info
    ten_dn: "",
    ma_so_thue: "",
    dia_chi: "",

    // Step 3: Representative Info
    ho_ten: "",
    sdt: "",
    email: "",
    cccd: "",
    ngay_sinh: "1990-01-01",
    gioi_tinh: "Nam",

    // Step 4: Business License
    giay_phep_kinh_doanh: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",

    // Step 5: Initial Branch Info
    ten_chi_nhanh: "",
    khu_vuc: "TP. Hồ Chí Minh",
    dia_chi_cn: "",
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Tạo tài khoản" },
    { number: 2, title: "Thông tin doanh nghiệp" },
    { number: 3, title: "Người đại diện" },
    { number: 4, title: "Giấy phép kinh doanh" },
    { number: 5, title: "Chi nhánh ban đầu" },
    { number: 6, title: "Xem lại & Gửi duyệt" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    const phoneRegex = /^0\d{9}$/;
    const taxRegex = /^\d{10}(\d{3})?$/;
    const cccdRegex = /^\d{9}(\d{3})?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      if (!formData.account_email.trim()) {
        newErrors.account_email = "Email không được để trống";
      } else if (!emailRegex.test(formData.account_email.trim())) {
        newErrors.account_email = "Email không đúng định dạng";
      }
      if (!formData.account_password) {
        newErrors.account_password = "Mật khẩu không được để trống";
      } else if (formData.account_password.length < 6) {
        newErrors.account_password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (formData.account_password !== formData.account_confirm_password) {
        newErrors.account_confirm_password = "Mật khẩu xác nhận không khớp";
      }
      if (!formData.account_ho_ten.trim()) {
        newErrors.account_ho_ten = "Họ tên không được để trống";
      }
      if (!formData.account_sdt.trim()) {
        newErrors.account_sdt = "Số điện thoại không được để trống";
      } else if (!phoneRegex.test(formData.account_sdt.trim())) {
        newErrors.account_sdt = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0";
      }
    } else if (step === 2) {
      if (!formData.ten_dn.trim()) newErrors.ten_dn = "Tên doanh nghiệp không được để trống";
      if (!formData.ma_so_thue.trim()) {
        newErrors.ma_so_thue = "Mã số thuế không được để trống";
      } else if (!taxRegex.test(formData.ma_so_thue.trim())) {
        newErrors.ma_so_thue = "Mã số thuế phải gồm 10 hoặc 13 chữ số";
      }
      if (!formData.dia_chi.trim()) newErrors.dia_chi = "Địa chỉ kinh doanh không được để trống";
    } else if (step === 3) {
      if (!formData.ho_ten.trim()) newErrors.ho_ten = "Họ tên người đại diện không được để trống";
      if (!formData.sdt.trim()) {
        newErrors.sdt = "Số điện thoại liên hệ không được để trống";
      } else if (!phoneRegex.test(formData.sdt.trim())) {
        newErrors.sdt = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email liên hệ không được để trống";
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Email liên hệ không đúng định dạng";
      }
      if (!formData.cccd.trim()) {
        newErrors.cccd = "Số CCCD/CMND không được để trống";
      } else if (!cccdRegex.test(formData.cccd.trim())) {
        newErrors.cccd = "Số CCCD/CMND phải gồm 9 hoặc 12 chữ số";
      }
      if (!formData.ngay_sinh) newErrors.ngay_sinh = "Ngày sinh người đại diện không được để trống";
      if (!formData.gioi_tinh) newErrors.gioi_tinh = "Giới tính không được để trống";
    } else if (step === 4) {
      if (!formData.giay_phep_kinh_doanh) newErrors.giay_phep_kinh_doanh = "Giấy phép kinh doanh không được để trống";
    } else if (step === 5) {
      if (!formData.ten_chi_nhanh.trim()) newErrors.ten_chi_nhanh = "Tên chi nhánh không được để trống";
      if (!formData.khu_vuc) newErrors.khu_vuc = "Khu vực chi nhánh không được để trống";
      if (!formData.dia_chi_cn.trim()) newErrors.dia_chi_cn = "Địa chỉ chi nhánh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    // Step 1: Request OTP Verification
    if (currentStep === 1 && !createdUser) {
      setLoading(true);
      try {
        const res = await requestPartnerOtpApi({
          email: formData.account_email,
          sdt: formData.account_sdt,
          password: formData.account_password,
          ho_ten: formData.account_ho_ten,
        });

        setDemoOtpHint(res.demoOtp || "");
        setOtpCountdown(60);
        setOtpError("");
        setOtpValue("");
        setShowOtpModal(true);
        setToastMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và xác nhận!");
      } catch (err) {
        setErrors((prev) => ({ ...prev, account_email: err.message }));
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2: Check Tax Code Uniqueness immediately
    if (currentStep === 2) {
      setLoading(true);
      try {
        await checkTaxCodeApi(formData.ma_so_thue);
      } catch (err) {
        setErrors((prev) => ({ ...prev, ma_so_thue: err.message }));
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerPartnerProfileApi({
        id_nguoi_dai_dien: createdUser?.id || createdUser?.ma_nguoi_dung,
        ten_dn: formData.ten_dn,
        ma_so_thue: formData.ma_so_thue,
        dia_chi: formData.dia_chi,
        giay_phep_kinh_doanh: formData.giay_phep_kinh_doanh,
        ho_ten: formData.ho_ten,
        sdt: formData.sdt,
        email: formData.email,
        cccd: formData.cccd,
        ngay_sinh: formData.ngay_sinh,
        gioi_tinh: formData.gioi_tinh,
        ten_chi_nhanh: formData.ten_chi_nhanh,
        khu_vuc: formData.khu_vuc,
        dia_chi_cn: formData.dia_chi_cn,
        sdt_cn: formData.sdt_cn,
      });

      setToastMessage("Hồ sơ đối tác đã được tạo thành công! Trạng thái đang Chờ duyệt.");
      setShowSuccessModal(true);
    } catch (err) {
      setToastMessage("Đăng ký thất bại: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 6) {
      setOtpError("Vui lòng nhập đủ 6 chữ số mã OTP.");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await verifyPartnerOtpApi({
        email: formData.account_email,
        otp: otpValue,
      });

      const userAccount = res.userAccount;
      setCreatedUser(userAccount);
      localStorage.setItem("user", JSON.stringify(userAccount));
      localStorage.setItem("accessToken", "demo-partner-token");

      // Prefill Step 3 fields with account data
      setFormData((prev) => ({
        ...prev,
        ho_ten: prev.ho_ten || userAccount.ho_ten,
        email: prev.email || userAccount.email,
        sdt: prev.sdt || userAccount.sdt,
      }));

      setShowOtpModal(false);
      setToastMessage("Xác thực tài khoản thành công! Vui lòng hoàn tất thông tin hồ sơ doanh nghiệp.");
      setCurrentStep(2);
    } catch (err) {
      setOtpError(err.message || "Xác thực mã OTP thất bại.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const res = await resendPartnerOtpApi({ email: formData.account_email });
      setDemoOtpHint(res.demoOtp || "");
      setOtpCountdown(60);
      setToastMessage("Đã gửi lại mã OTP thành công! Vui lòng kiểm tra hòm thư.");
    } catch (err) {
      setOtpError(err.message || "Gửi lại mã OTP thất bại.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Đăng ký Hồ sơ Đối tác</h2>
          <p className="text-sm text-slate-500 mt-1">
            Khai báo tài khoản, thông tin doanh nghiệp & giấy phép kinh doanh để tham gia phát hành Voucher trên hệ thống
          </p>
        </div>

        {/* Wizard Step Indicator Header */}
        <Card padding={false}>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between relative">
              {steps.map((step) => {
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;
                return (
                  <div key={step.number} className="flex-1 flex flex-col items-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium text-center ${
                        isCurrent ? "text-blue-700 font-bold" : isCompleted ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Step Form Content */}
        <Card>
          {/* STEP 1: Account Registration */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold text-slate-900">Bước 1: Tạo Tài Khoản Đối Tác</h3>
                {createdUser && <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">✓ Đã tạo tài khoản</span>}
              </div>
              <p className="text-xs text-slate-500">
                Tạo tài khoản người đại diện doanh nghiệp để đăng nhập và quản lý hệ thống Voucher sau khi được phê duyệt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email đăng nhập <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    disabled={!!createdUser}
                    value={formData.account_email}
                    onChange={(e) => handleInputChange("account_email", e.target.value)}
                    placeholder="partner@domain.com"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50"
                  />
                  {errors.account_email && <p className="text-xs text-rose-600 mt-1">{errors.account_email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Họ và tên người đại diện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!!createdUser}
                    value={formData.account_ho_ten}
                    onChange={(e) => handleInputChange("account_ho_ten", e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50"
                  />
                  {errors.account_ho_ten && <p className="text-xs text-rose-600 mt-1">{errors.account_ho_ten}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    disabled={!!createdUser}
                    value={formData.account_password}
                    onChange={(e) => handleInputChange("account_password", e.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50"
                  />
                  {errors.account_password && <p className="text-xs text-rose-600 mt-1">{errors.account_password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    disabled={!!createdUser}
                    value={formData.account_confirm_password}
                    onChange={(e) => handleInputChange("account_confirm_password", e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50"
                  />
                  {errors.account_confirm_password && <p className="text-xs text-rose-600 mt-1">{errors.account_confirm_password}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!!createdUser}
                    value={formData.account_sdt}
                    onChange={(e) => handleInputChange("account_sdt", e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-50"
                  />
                  {errors.account_sdt && <p className="text-xs text-rose-600 mt-1">{errors.account_sdt}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 2: Thông tin Doanh Nghiệp</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên Doanh Nghiệp / Công Ty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_dn}
                  onChange={(e) => handleInputChange("ten_dn", e.target.value)}
                  placeholder="Ví dụ: Công ty TNHH Thương Mại & Dịch Vụ ABC"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ten_dn && <p className="text-xs text-rose-600 mt-1">{errors.ten_dn}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mã số thuế / Mã ĐKKD <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ma_so_thue}
                    onChange={(e) => handleInputChange("ma_so_thue", e.target.value)}
                    placeholder="Ví dụ: 0312345678"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.ma_so_thue && <p className="text-xs text-rose-600 mt-1">{errors.ma_so_thue}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ ĐKKD chính thức <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dia_chi}
                  onChange={(e) => handleInputChange("dia_chi", e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.dia_chi && <p className="text-xs text-rose-600 mt-1">{errors.dia_chi}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: Representative Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 3: Người Đại Diện Pháp Lý</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên Người đại diện <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ho_ten}
                  onChange={(e) => handleInputChange("ho_ten", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ho_ten && <p className="text-xs text-rose-600 mt-1">{errors.ho_ten}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sdt}
                    onChange={(e) => handleInputChange("sdt", e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.sdt && <p className="text-xs text-rose-600 mt-1">{errors.sdt}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email liên hệ / Thông báo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số CCCD / CMND <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cccd}
                    onChange={(e) => handleInputChange("cccd", e.target.value)}
                    placeholder="079090123456"
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.cccd && <p className="text-xs text-rose-600 mt-1">{errors.cccd}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày sinh <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.ngay_sinh}
                    onChange={(e) => handleInputChange("ngay_sinh", e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.ngay_sinh && <p className="text-xs text-rose-600 mt-1">{errors.ngay_sinh}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gioi_tinh}
                    onChange={(e) => handleInputChange("gioi_tinh", e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                    <option value="Khac">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: License Document */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Bước 4: Đăng Tải Giấy Phép Kinh Doanh
              </h3>
              <p className="text-xs text-slate-500">
                Tải lên bản scan hoặc ảnh chụp rõ nét Giấy phép đăng ký kinh doanh còn hiệu lực (Định dạng JPG, PNG hoặc PDF, tối đa 10MB).
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-sm font-semibold text-slate-800">Tải lên tài liệu pháp lý</div>
                <div className="text-xs text-slate-500 mt-1">Kéo thả file vào đây hoặc bấm để chọn tệp</div>
                <input
                  type="file"
                  className="hidden"
                  id="license-upload"
                  onChange={() => setToastMessage("Tải lên bản xem trước thành công")}
                />
                <label
                  htmlFor="license-upload"
                  className="mt-4 inline-block px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                >
                  Chọn tệp từ máy tính
                </label>
              </div>

              {formData.giay_phep_kinh_doanh && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Xem trước bản ĐKKD:</div>
                  <img
                    src={formData.giay_phep_kinh_doanh}
                    alt="Giấy phép kinh doanh"
                    className="max-h-48 rounded-lg border border-slate-200 object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Initial Branch */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Bước 5: Khai Báo Chi Nhánh Đầu Tiên
              </h3>
              <p className="text-xs text-slate-500">
                Cung cấp địa chỉ điểm bán hàng/chi nhánh đầu tiên sẽ áp dụng các chương trình Voucher của bạn.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên chi nhánh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten_chi_nhanh}
                  onChange={(e) => handleInputChange("ten_chi_nhanh", e.target.value)}
                  placeholder="Ví dụ: Chi nhánh Nguyễn Huệ - Quận 1"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.ten_chi_nhanh && <p className="text-xs text-rose-600 mt-1">{errors.ten_chi_nhanh}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tỉnh / Thành Phố <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.khu_vuc}
                  onChange={(e) => handleInputChange("khu_vuc", e.target.value)}
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  {VIETNAM_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.khu_vuc && <p className="text-xs text-rose-600 mt-1">{errors.khu_vuc}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Địa chỉ chi nhánh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dia_chi_cn}
                  onChange={(e) => handleInputChange("dia_chi_cn", e.target.value)}
                  placeholder="Địa chỉ cụ thể của điểm bán hàng"
                  className="w-full px-3.5 py-2 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.dia_chi_cn && <p className="text-xs text-rose-600 mt-1">{errors.dia_chi_cn}</p>}
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Bước 6: Xem Lại & Xác Nhận Hồ Sơ</h3>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm border border-slate-200">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tài khoản đăng nhập:</span>
                  <span className="font-semibold text-slate-900">{formData.account_email || createdUser?.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tên doanh nghiệp:</span>
                  <span className="font-semibold text-slate-900">{formData.ten_dn || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Mã số thuế:</span>
                  <span className="font-semibold text-slate-900">{formData.ma_so_thue || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Người đại diện:</span>
                  <span className="font-semibold text-slate-900">{formData.ho_ten || "Chưa nhập"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">SĐT / Email người đại diện:</span>
                  <span className="font-semibold text-slate-900">
                    {formData.sdt} - {formData.email}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2">
                  <span className="text-slate-500">CCCD / Ngày sinh / Giới tính:</span>
                  <span className="font-semibold text-slate-900">
                    {formData.cccd || "Chưa nhập"} | {formData.ngay_sinh || "Chưa nhập"} | {formData.gioi_tinh === "Nu" ? "Nữ" : formData.gioi_tinh === "Nam" ? "Nam" : "Khác"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Chi nhánh đầu tiên:</span>
                  <span className="font-semibold text-slate-900">
                    {formData.ten_chi_nhanh} ({formData.khu_vuc})
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <span>⚠️</span>
                <span>
                  Bằng cách nhấn <strong>"Gửi yêu cầu xét duyệt"</strong>, bạn cam kết toàn bộ thông tin đã khai báo là chính xác. Quản trị viên hệ thống sẽ kiểm tra và phản hồi trong thời gian sớm nhất.
                </span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
              ← Quay lại
            </Button>

            {currentStep < 6 ? (
              <Button variant="primary" onClick={handleNext} loading={loading}>
                {currentStep === 1 && !createdUser ? "Tạo tài khoản & Tiếp tục →" : "Tiếp tục →"}
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} loading={loading}>
                ✓ Gửi yêu cầu xét duyệt
              </Button>
            )}
          </div>
        </Card>

        {/* Modal Xác Thực Mã OTP */}
        {showOtpModal && (
          <Modal
            isOpen={showOtpModal}
            onClose={() => setShowOtpModal(false)}
            title="Xác Thực Tài Khoản Đăng Ký Đối Tác"
            confirmText="Xác nhận mã OTP"
            confirmVariant="primary"
            onConfirm={handleVerifyOtp}
            cancelText="Hủy"
          >
            <div className="space-y-4 text-left">
              <p className="text-sm text-slate-700">
                Mã xác thực 6 chữ số đã được gửi đến email:{" "}
                <strong className="text-blue-600 font-mono">{formData.account_email}</strong>
              </p>

              {/* {demoOtpHint && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center justify-between">
                  <span>💡 Mã OTP gợi ý thử nghiệm:</span>
                  <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-blue-300">
                    {demoOtpHint}
                  </span>
                </div>
              )} */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nhập mã OTP 6 chữ số *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setOtpValue(val);
                    if (otpError) setOtpError("");
                  }}
                  placeholder="000000"
                  className="w-full text-center font-mono tracking-widest text-2xl font-bold py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                  autoFocus
                />
              </div>

              {otpError && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded border border-rose-200">
                  {otpError}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  {otpCountdown > 0 ? (
                    <>Mã hết hạn sau: <strong className="text-slate-900 font-mono">00:{otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}</strong></>
                  ) : (
                    <span className="text-rose-600 font-medium">Mã OTP đã hết hạn</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpCountdown > 0 || otpLoading}
                  className={`font-semibold transition-colors cursor-pointer ${
                    otpCountdown > 0 || otpLoading
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800 hover:underline"
                  }`}
                >
                  Gửi lại mã OTP
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            navigate("/login");
          }}
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate("/login");
          }}
          title="Gửi hồ sơ thành công!"
          confirmText="Đến trang Đăng nhập"
          cancelText="Đóng"
        >
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto font-bold">
              ✓
            </div>
            <p className="text-slate-700">
              Hồ sơ đăng ký đối tác của bạn đã được khởi tạo thành công và gửi tới Quản trị viên hệ thống. Trạng thái hiện tại là <strong>"Chờ duyệt"</strong>.
            </p>
            <p className="text-slate-500 text-sm">
              Vui lòng đăng nhập lại sau khi hồ sơ được phê duyệt để sử dụng đầy đủ chức năng.
            </p>
          </div>
        </Modal>

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      </div>
    </div>
  );
}

export default PartnerRegisterPage;