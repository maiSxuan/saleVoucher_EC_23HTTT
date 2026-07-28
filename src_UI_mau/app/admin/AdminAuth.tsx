import { useState } from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

interface Props {
  onLoginSuccess: () => void;
}

// Demo: admin@ec-voucher.vn / admin123
const DEMO_EMAIL = 'admin@ec-voucher.vn';
const DEMO_PASSWORD = 'admin123';

export default function AdminAuth({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!email || !password) { setError('Vui lòng nhập đầy đủ thông tin.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLoginSuccess();
      } else {
        setError('Email hoặc mật khẩu không đúng.');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-3 shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">EC Voucher</h1>
          <p className="text-sm text-gray-500">Admin Portal</p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email quản trị</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin@ec-voucher.vn"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
            <AlertCircle size={12} /> {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>

        <div className="mt-4 bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Tài khoản demo</p>
          <p className="text-xs text-gray-600 font-mono">admin@ec-voucher.vn</p>
          <p className="text-xs text-gray-600 font-mono">admin123</p>
        </div>
      </div>
    </div>
  );
}
