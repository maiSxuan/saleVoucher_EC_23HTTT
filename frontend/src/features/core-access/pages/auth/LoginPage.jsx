import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/auth-context";
import {
  loginApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../../../../shared/api/authApi";

export default function LoginPage() {
  // mode: 'login' | 'forgot-password' (Bước 1) | 'verify-otp' (Bước 2) | 'reset-password' (Bước 3)
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();
  const { persistSession } = useAuth();

  // Đếm ngược gửi lại OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleLoginSuccess = (payload) => {
    const accessToken = payload.accessToken || payload.token;
    const rfToken = payload.refreshToken || null;
    persistSession(accessToken, payload.user, rfToken);

    const userRole = payload.user?.role;
    if (userRole === "ADMIN") navigate("/admin");
    else if (userRole === "PARTNER_OWNER" || userRole === "PARTNER_STAFF")
      navigate("/partner");
    else navigate("/customer");
  };

  // Đăng nhập thường
  const handleLogin = async () => {
    setError("");
    setSuccessMsg("");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi({ username: email, password });
      handleLoginSuccess(res);
    } catch (err) {
      setError(err.message || "Đăng nhập không thành công.");
    } finally {
      setLoading(false);
    }
  };

  // UC-BUS-05 Bước 1-7: Yêu cầu gửi OTP quên mật khẩu
  const handleForgotPassword = async () => {
    setError("");
    setSuccessMsg("");
    if (!email.trim()) {
      setError("Vui lòng nhập email đã đăng ký.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email.trim());
      setSuccessMsg(res.message || "Mã OTP đã được gửi đến email của bạn.");
      if (res.data?.maskedEmail) {
        setMaskedEmail(res.data.maskedEmail);
      }
      setResendCountdown(60);
      setOtp("");
      setMode("verify-otp");
    } catch (err) {
      setError(
        err.message ||
          "Không thể thực hiện yêu cầu khôi phục mật khẩu. Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  };

  // UC-BUS-05 A11.2: Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email.trim());
      setSuccessMsg("Mã OTP mới đã được gửi lại qua email.");
      if (res.data?.maskedEmail) {
        setMaskedEmail(res.data.maskedEmail);
      }
      setResendCountdown(60);
    } catch (err) {
      setError(
        err.message || "Không thể gửi lại mã xác thực. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  // UC-BUS-05 Bước 9-11: Xác minh OTP
  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMsg("");
    if (!otp || otp.trim().length < 6) {
      setError("Vui lòng nhập đủ 6 chữ số mã xác thực.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtpApi({ email: email.trim(), otp: otp.trim() });
      setSuccessMsg("Mã xác thực hợp lệ! Vui lòng thiết lập mật khẩu mới.");
      setMode("reset-password");
    } catch (err) {
      setError(err.message || "Mã xác thực không chính xác hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  // UC-BUS-05 Bước 13-17: Đặt lại mật khẩu mới
  const handleResetPassword = async () => {
    setError("");
    setSuccessMsg("");
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      // Thành công -> chuyển về màn hình đăng nhập kèm thông báo
      setSuccessMsg(
        res.message ||
          "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại bằng mật khẩu mới.",
      );
      setMode("login");
      setPassword("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.message ||
          "Không thể cập nhật mật khẩu mới. Mật khẩu hiện tại vẫn được giữ nguyên.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-8 relative overflow-hidden transition-all duration-300">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Logo & Tiêu đề */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-200">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            EC Voucher
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login" && "Hệ thống Đăng nhập"}
            {mode === "forgot-password" && "Quên mật khẩu (Bước 1/3)"}
            {mode === "verify-otp" && "Xác thực mã OTP (Bước 2/3)"}
            {mode === "reset-password" && "Thiết lập mật khẩu mới (Bước 3/3)"}
          </p>
        </div>

        {/* Thanh tiến trình quy trình Quên mật khẩu */}
        {mode !== "login" && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span
                className={
                  mode === "forgot-password"
                    ? "text-indigo-600 font-bold"
                    : "text-gray-400"
                }
              >
                1. Nhập thông tin
              </span>
              <span
                className={
                  mode === "verify-otp"
                    ? "text-indigo-600 font-bold"
                    : "text-gray-400"
                }
              >
                2. Nhập OTP
              </span>
              <span
                className={
                  mode === "reset-password"
                    ? "text-indigo-600 font-bold"
                    : "text-gray-400"
                }
              >
                3. Đổi mật khẩu
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width:
                    mode === "forgot-password"
                      ? "33%"
                      : mode === "verify-otp"
                        ? "66%"
                        : "100%",
                }}
              />
            </div>
          </div>
        )}

        {/* Thông báo lỗi */}
        {error && (
          <div className="flex items-start gap-2.5 text-red-600 text-xs bg-red-50/90 border border-red-100 rounded-xl p-3.5 mb-5 animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Thông báo thành công */}
        {successMsg && (
          <div className="flex items-start gap-2.5 text-emerald-800 text-xs bg-emerald-50/90 border border-emerald-200 rounded-xl p-3.5 mb-5">
            <CheckCircle2
              size={16}
              className="shrink-0 mt-0.5 text-emerald-600"
            />
            <span className="leading-relaxed font-medium">{successMsg}</span>
          </div>
        )}

        {/* ======================= MÀN HÌNH ĐĂNG NHẬP ======================= */}
        {mode === "login" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Nhập email"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot-password");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-md shadow-indigo-100 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>

            <div className="pt-4 border-t border-gray-100 text-center space-y-2">
              <div className="text-xs text-gray-500">Chưa có tài khoản?</div>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <Link
                  to="/customer/register"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Đăng ký Khách hàng
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/partner/register"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Đăng ký Đối tác
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ======================= BƯỚC 1: QUÊN MẬT KHẨU ======================= */}
        {mode === "forgot-password" && (
          <div className="space-y-4">
            <div className="bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              Nhập địa chỉ Email đã đăng ký. Hệ thống sẽ kiểm tra và gửi mã xác
              thực (OTP 6 số) đến hộp thư của bạn.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email đã đăng ký
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                  placeholder="ví dụ: nguyenvana@gmail.com "
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-all shadow-md shadow-indigo-100 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              {loading ? "Đang xử lý..." : "Tiếp tục & Gửi mã OTP"}
            </button>

            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold py-2 transition-colors"
            >
              <ArrowLeft size={14} /> Quay lại đăng nhập
            </button>
          </div>
        )}

        {/* ======================= BƯỚC 2: XÁC THỰC MÃ OTP ======================= */}
        {mode === "verify-otp" && (
          <div className="space-y-4">
            <div className="bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
              Mã xác thực đã được gửi đến{" "}
              {maskedEmail ? (
                <strong className="text-indigo-700 font-bold">
                  {maskedEmail}
                </strong>
              ) : (
                "email đã đăng ký của bạn"
              )}
              . Mã có hiệu lực trong vòng{" "}
              <strong className="text-indigo-700">5 phút</strong>.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nhập mã xác thực (OTP 6 số)
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="Nhập 6 số OTP..."
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-base font-bold tracking-[0.25em] text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>Chưa nhận được mã?</span>
              {resendCountdown > 0 ? (
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <Clock size={13} /> Gửi lại sau {resendCountdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Gửi lại mã
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              {loading ? "Đang xác thực..." : "Xác nhận mã OTP"}
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot-password");
                  setError("");
                  setSuccessMsg("");
                }}
                disabled={loading}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
              >
                <ArrowLeft size={13} /> Nhập lại Email/SĐT
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        )}

        {/* ======================= BƯỚC 3: THIẾT LẬP MẬT KHẨU MỚI ======================= */}
        {mode === "reset-password" && (
          <div className="space-y-4">
            <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-center gap-2">
              <Sparkles size={16} className="shrink-0 text-emerald-600" />
              <span>
                Xác thực OTP thành công! Vui lòng tạo mật khẩu mới an toàn cho
                tài khoản.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mật khẩu mới (tối thiểu 6 ký tự)
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                >
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                >
                  {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw size={16} className="animate-spin" />}
              {loading ? "Đang cập nhật..." : "Cập nhật Mật khẩu mới"}
            </button>

            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold py-2 transition-colors"
            >
              <ArrowLeft size={14} /> Hủy và quay lại Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
