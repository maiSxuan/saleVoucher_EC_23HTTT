import React, { useState } from "react";
import { Shield, Eye, EyeOff, AlertCircle, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/auth-context";

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot-password' | 'enter-otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { persistSession } = useAuth();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const handleLoginSuccess = (data) => {
    persistSession(data.data.accessToken || data.data.token, data.data.user);

    const userRole = data.data.user.role;
    if (userRole === 'ADMIN') navigate('/admin');
    else if (userRole === 'PARTNER_OWNER' || userRole === 'PARTNER_STAFF') navigate('/partner');
    else navigate('/customer');
  };

  const handleLogin = async () => {
    setError(''); setSuccessMsg('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Đăng nhập thất bại');

      handleLoginSuccess(data);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Không thể kết nối đến máy chủ. Hãy kiểm tra Backend.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(''); setSuccessMsg('');
    if (!email) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Yêu cầu thất bại');

      // Hiển thị thông báo kiểm tra email
      setSuccessMsg(data.message || 'Mã OTP đã được gửi đến email của bạn.');
      setMode('enter-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithOTP = async () => {
    setError(''); setSuccessMsg('');
    if (!otp) {
      setError('Vui lòng nhập mã OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login-with-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Đăng nhập thất bại');

      handleLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-3 shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">EC Voucher</h1>
          <p className="text-sm text-gray-500">
            {mode === 'login' && 'Hệ thống Đăng nhập'}
            {mode === 'forgot-password' && 'Quên mật khẩu'}
            {mode === 'enter-otp' && 'Xác thực OTP'}
          </p>
        </div>

        {/* Thông báo */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 text-green-700 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
            <Mail size={14} className="shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* FORMS */}
        {mode === 'login' && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Nhập email hoặc SĐT của bạn"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <button type="button" onClick={() => { setMode('forgot-password'); setError(''); setSuccessMsg(''); }} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Quên mật khẩu?
                </button>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>

            <div className="text-center mt-3 space-y-2">
              <div>
              <Link to="/customer/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Đăng kí khách hàng
              </Link>
                 </div>
              <div>
                <Link to="/partner/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Đăng kí đối tác
                </Link>
              </div>
            </div>
          </div>
        )}

        {mode === 'forgot-password' && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                placeholder="Nhập email của bạn"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
            >
              <ArrowLeft size={16} /> Quay lại đăng nhập
            </button>
          </div>
        )}

        {mode === 'enter-otp' && (
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mã OTP (6 số)</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleLoginWithOTP()}
                  placeholder="Nhập 6 số..."
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <button
              onClick={handleLoginWithOTP}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Đang xác thực...' : 'Xác nhận Đăng nhập'}
            </button>
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
            >
              <ArrowLeft size={16} /> Hủy và quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
