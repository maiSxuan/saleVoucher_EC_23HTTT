import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

const OTP_RESEND_SECONDS = 60;

export default function RegisterPage() {
  const navigate = useNavigate();

  // step: 'form' -> nhập thông tin đăng ký | 'otp' -> nhập mã xác thực
  const [step, setStep] = useState("form");

  // form fields
  const [loginInfo, setLoginInfo] = useState(""); // email hoặc số điện thoại
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // otp fields
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(OTP_RESEND_SECONDS);

  // ui state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== "otp" || otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, otpTimer]);

  const setFieldError = (field, message) =>
    setErrors((e) => ({ ...e, [field]: message }));
  const clearErrors = () => setErrors({});

  // ---------- Validate phía client (giống NFR-05: báo lỗi rõ nguyên nhân) ----------
  const validateForm = () => {
    const errs = {};
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInfo);
    const isPhone = /^\d{10}$/.test(loginInfo);
    if (!loginInfo) errs.loginInfo = "Vui lòng nhập Email hoặc Số điện thoại.";
    else if (!isEmail && !isPhone)
      errs.loginInfo = "Email hoặc Số điện thoại không đúng định dạng.";

    if (!password) errs.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6)
      errs.password = "Mật khẩu phải có ít nhất 6 ký tự.";

    if (password !== confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------- Bước 1: gửi thông tin đăng ký, hệ thống phát hành OTP mô phỏng ----------
  const handleRegister = async () => {
    clearErrors();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginInfo, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // A6: thông tin đã tồn tại / A5: sai định dạng -> backend trả message tương ứng
        setFieldError("_global", data.message || "Đăng ký thất bại.");
        return;
      }

      setOtp("");
      setOtpTimer(OTP_RESEND_SECONDS);
      setStep("otp");
    } catch (err) {
      setFieldError(
        "_global",
        err.message === "Failed to fetch"
          ? "Không thể kết nối đến máy chủ. Hãy kiểm tra Backend."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- Bước 2: xác thực OTP -> tạo hồ sơ -> tự động đăng nhập ----------
  const handleVerifyOtp = async () => {
    clearErrors();
    if (!otp) {
      setFieldError("otp", "Vui lòng nhập mã OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/customer/register/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginInfo, otp }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // A12: OTP sai/hết hạn/quá 3 lần -> backend trả message tương ứng
        setFieldError("otp", data.message || "Xác thực OTP thất bại.");
        return;
      }

      // Đăng ký thành công -> tự động đăng nhập bằng chính thông tin vừa tạo
      const loginRes = await fetch(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginInfo, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        // Tạo tài khoản thành công nhưng auto-login lỗi -> vẫn cho về trang login
        navigate("/login");
        return;
      }

      localStorage.setItem("accessToken", loginData.data.token);
      localStorage.setItem("user", JSON.stringify(loginData.data.user));
      navigate("/customer");
    } catch (err) {
      setFieldError(
        "otp",
        err.message === "Failed to fetch"
          ? "Không thể kết nối đến máy chủ. Hãy kiểm tra Backend."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- Gửi lại OTP ----------
  const handleResendOtp = async () => {
    clearErrors();
    setLoading(true);
    try {
      const res = await fetch(`/customer/register/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginInfo }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFieldError("otp", data.message || "Không thể gửi lại mã.");
        return;
      }
      setOtp("");
      setOtpTimer(OTP_RESEND_SECONDS);
    } catch (err) {
      setFieldError("otp", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-0.5">{errors[field]}</p>
    ) : null;

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                <ShoppingBag size={22} className="text-orange-600" />
              </div>
              <h2 className="font-bold text-gray-900 text-lg">
                Đăng ký tài khoản
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tạo tài khoản khách hàng EC Voucher
              </p>
            </div>

            {errors._global && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-600 mb-3 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />{" "}
                {errors._global}
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Email / Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                value={loginInfo}
                onChange={(e) => {
                  setLoginInfo(e.target.value);
                  clearErrors();
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.loginInfo ? "border-red-400" : "border-gray-300"}`}
              />
              <Err field="loginInfo" />
            </div>

            <PwField
              label="Mật khẩu"
              value={password}
              onChange={(p) => {
                setPassword(p);
                clearErrors();
              }}
              show={showPw}
              onToggle={() => setShowPw((s) => !s)}
              error={errors.password}
              required
            />
            <PwField
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(p) => {
                setConfirmPassword(p);
                clearErrors();
              }}
              show={showPw}
              onToggle={() => setShowPw((s) => !s)}
              error={errors.confirmPassword}
              required
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 mt-1"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-orange-600 font-medium">
                Đăng nhập
              </Link>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              onClick={() => {
                setStep("form");
                clearErrors();
              }}
              className="flex items-center gap-1 text-sm text-gray-500 mb-4"
            >
              <ArrowLeft size={14} /> Quay lại
            </button>

            <h2 className="font-bold text-gray-900 mb-1">Xác thực OTP</h2>
            <p className="text-sm text-gray-500 mb-4">
              Mã xác thực mô phỏng đã được gửi đến <strong>{loginInfo}</strong>.
              <br />
              (Kiểm tra console log của Backend để lấy mã.)
            </p>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                Nhập mã OTP
              </label>
              <input
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  clearErrors();
                }}
                maxLength={6}
                className={`w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.otp ? "border-red-400" : "border-gray-300"}`}
              />
              <Err field="otp" />
            </div>

            <div className="flex items-center justify-between mb-4">
              {otpTimer > 0 ? (
                <p className="text-xs text-gray-400">Gửi lại sau {otpTimer}s</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-xs text-orange-600 flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Gửi lại mã
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Đang xác thực..." : "Xác nhận"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PwField({ label, value, onChange, show, onToggle, error, required }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600 block mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${error ? "border-red-400" : "border-gray-300"}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
