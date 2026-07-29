import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/auth-context";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ Tên đăng nhập/Email và Mật khẩu!");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(username, password);
      setLoading(false);

      // Redirect based on user role
      if (res.user.vai_tro === "Admin") {
        navigate("/admin/partners");
      } else {
        navigate("/partner/reports");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

  const handleQuickFill = (demoEmail, demoPass = "Demo@123") => {
    setUsername(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-md">
            EC
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Voucher Marketplace Portal</h1>
          <p className="text-xs text-slate-500">Đăng nhập tài khoản Quản trị viên (Admin) hoặc Đối tác (Partner)</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-slate-200">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 flex items-start gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đăng nhập hoặc Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="admin@ec.local hoặc owner.amthuc@ec.local"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border rounded-lg text-sm border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 justify-center font-bold text-sm"
              loading={loading || authLoading}
            >
              🔐 Đăng Nhập
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full py-2.5 justify-center font-bold text-sm"
              onClick={() => navigate("/partner/register")}
            >
              📝 Đăng ký doanh nghiệp
            </Button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Tài khoản mẫu Backend (Mật khẩu: Demo@123):
            </span>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@ec.local")}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-300 transition-colors text-xs flex justify-between items-center cursor-pointer"
              >
                <div>
                  <strong className="text-slate-900 block">👑 Admin Portal</strong>
                  <span className="text-slate-500">admin@ec.local</span>
                </div>
                <span className="text-blue-600 font-bold">Chọn ➔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("owner.amthuc@ec.local")}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-left hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-xs flex justify-between items-center cursor-pointer"
              >
                <div>
                  <strong className="text-slate-900 block">🏢 Đối Tác (Đang hoạt động)</strong>
                  <span className="text-slate-500">owner.amthuc@ec.local</span>
                </div>
                <span className="text-emerald-600 font-bold">Chọn ➔</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("owner.spa@ec.local")}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-left hover:bg-amber-50 hover:border-amber-300 transition-colors text-xs flex justify-between items-center cursor-pointer"
              >
                <div>
                  <strong className="text-slate-900 block">⏳ Đối Tác (Chờ duyệt)</strong>
                  <span className="text-slate-500">owner.spa@ec.local</span>
                </div>
                <span className="text-amber-600 font-bold">Chọn ➔</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
