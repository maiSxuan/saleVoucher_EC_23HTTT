import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const OTP_RESEND_SECONDS = 60;

export default function RegisterPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
  const navigate = useNavigate();

  // step: 'form' -> nhập thông tin đăng ký | 'otp' -> nhập mã xác thực
  const [step, setStep] = useState("form");

  // form fields
  const [loginInfo, setLoginInfo] = useState(""); // email
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
    if (!loginInfo) errs.loginInfo = "Vui lòng nhập địa chỉ Email.";
    else if (!isEmail) errs.loginInfo = "Vui lòng nhập đúng định dạng email.";

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
      const res = await fetch(`${BASE_URL}/customer/register`, {
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
      const res = await fetch(`${BASE_URL}/customer/register/verify-otp`, {
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
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
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
      const res = await fetch(`${BASE_URL}/customer/register/resend-otp`, {
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white border border-sky-100 rounded-2xl shadow-xl shadow-sky-900/10 max-w-sm w-full p-6">
        <Link
          to="/"
          className="flex flex-col items-center group mb-5"
          aria-label="Về trang chủ Snow Voucher"
        >
          <img
            src="/snowflake.png"
            alt=""
            aria-hidden="true"
            className="w-12 h-12 object-contain mb-2 drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            Snow Voucher
          </span>
        </Link>

        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <h2 className="font-bold text-gray-900 text-lg">
                Đăng ký tài khoản
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tạo tài khoản khách hàng Snow Voucher
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
                Email<span className="text-red-500">*</span>
              </label>
              <input
                value={loginInfo}
                onChange={(e) => {
                  setLoginInfo(e.target.value);
                  clearErrors();
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.loginInfo ? "border-red-400" : "border-gray-300"}`}
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
              className="w-full bg-sky-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 transition-colors mt-1"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-sky-700 hover:text-sky-800 font-medium transition-colors">
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
                className={`w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${errors.otp ? "border-red-400" : "border-gray-300"}`}
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
                  className="text-xs text-sky-700 hover:text-sky-800 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Gửi lại mã
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-sky-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 transition-colors"
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
          className={`w-full border rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${error ? "border-red-400" : "border-gray-300"}`}
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
