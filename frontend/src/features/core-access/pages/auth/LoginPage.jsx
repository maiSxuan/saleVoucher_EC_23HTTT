import React, { useState } from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    
    setLoading(true);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
      
      // Save token and user info
      localStorage.setItem('accessToken', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect based on role
      const userRole = data.data.user.role;
      if (userRole === 'ADMIN') navigate('/admin');
      else if (userRole === 'PARTNER_OWNER' || userRole === 'PARTNER_STAFF') navigate('/partner');
      else navigate('/customer');
      
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Không thể kết nối đến máy chủ. Hãy kiểm tra Backend.' : err.message);
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
          <p className="text-sm text-gray-500">Hệ thống Đăng nhập</p>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email / Số điện thoại</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Nhập email của bạn"
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
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            <AlertCircle size={14} className="shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
      </div>
    </div>
  );
}
