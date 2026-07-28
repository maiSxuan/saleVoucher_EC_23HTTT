import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type AuthView = 'login' | 'register' | 'otp' | 'forgot' | 'forgot-otp' | 'reset' | 'temp_locked' | 'admin_locked';

interface CustomerAuthProps {
  onLoginSuccess: () => void;
}

// Demo credentials: any@demo.com + 123456 = success
// locked@demo.com -> admin_locked
// OTP always: 123456

const DEMO_OTP = '123456';

export default function CustomerAuth({ onLoginSuccess }: CustomerAuthProps) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [failedLogins, setFailedLogins] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if ((view === 'otp' || view === 'forgot-otp') && otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(s => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [view, otpTimer]);

  const startOtpTimer = () => { setOtpTimer(60); setOtp(''); setOtpAttempts(0); };

  const handleLogin = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Vui lòng nhập Email/SĐT.';
    if (!password) errs.password = 'Vui lòng nhập mật khẩu.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setProcessing(true);
    setTimeout(() => {
      if (email === 'locked@demo.com') { setView('admin_locked'); setProcessing(false); return; }
      if (password !== '123456') {
        const next = failedLogins + 1;
        setFailedLogins(next);
        if (next >= 5) { setView('temp_locked'); setProcessing(false); return; }
        setErrors({ _global: `Email/SĐT hoặc mật khẩu không đúng (${next}/5 lần thất bại).` });
        setProcessing(false);
        return;
      }
      setFailedLogins(0);
      setProcessing(false);
      onLoginSuccess();
    }, 800);
  };

  const handleRegister = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Vui lòng nhập Email/SĐT.';
    else if (!email.includes('@') && !/^\d{10}$/.test(email)) errs.email = 'Email hoặc SĐT không hợp lệ.';
    if (!password) errs.password = 'Vui lòng nhập mật khẩu.';
    else if (password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự.';
    if (password !== confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    if (email === 'existing@demo.com') errs.email = 'Email đã được đăng ký. Vui lòng đăng nhập.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setProcessing(true);
    setTimeout(() => {
      setPendingEmail(email);
      startOtpTimer();
      setView('otp');
      setProcessing(false);
      toast.success(`Mã OTP mô phỏng đã được gửi đến ${email}. Dùng: ${DEMO_OTP}`);
    }, 700);
  };

  const handleOtpSubmit = () => {
    if (!otp) { setErrors({ otp: 'Vui lòng nhập mã OTP.' }); return; }
    const next = otpAttempts + 1;
    setOtpAttempts(next);
    if (otp !== DEMO_OTP) {
      if (next >= 3) {
        setErrors({ otp: 'Quá 3 lần nhập sai. Vui lòng bắt đầu lại.' });
        setTimeout(() => setView('register'), 2000);
        return;
      }
      setErrors({ otp: `Mã OTP không đúng (${next}/3 lần).` });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onLoginSuccess();
      toast.success('Đăng ký thành công! Chào mừng bạn.');
    }, 700);
  };

  const handleForgotSubmit = () => {
    if (!email) { setErrors({ email: 'Vui lòng nhập Email/SĐT đã đăng ký.' }); return; }
    setProcessing(true);
    setTimeout(() => {
      setPendingEmail(email);
      startOtpTimer();
      setView('forgot-otp');
      setProcessing(false);
      toast.success(`OTP mô phỏng đã gửi tới ${email}. Dùng: ${DEMO_OTP}`);
    }, 700);
  };

  const handleForgotOtp = () => {
    if (!otp) { setErrors({ otp: 'Vui lòng nhập mã OTP.' }); return; }
    const next = otpAttempts + 1;
    setOtpAttempts(next);
    if (otp !== DEMO_OTP) {
      if (next >= 3) { setErrors({ otp: 'Quá 3 lần sai. Vui lòng thử lại từ đầu.' }); setTimeout(() => setView('forgot'), 2000); return; }
      setErrors({ otp: `Mã không đúng (${next}/3 lần).` }); return;
    }
    setView('reset');
  };

  const handleReset = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Nhập mật khẩu mới.';
    else if (password.length < 6) errs.password = 'Ít nhất 6 ký tự.';
    if (password !== confirmPassword) errs.confirmPassword = 'Không khớp.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setView('login');
      toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
    }, 700);
  };

  const reset = () => { setErrors({}); setOtp(''); };
  const Err = ({ field }: { field: string }) => errors[field] ? <p className="text-red-500 text-xs mt-0.5">{errors[field]}</p> : null;

  if (view === 'temp_locked') return (
    <AuthShell>
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <Lock size={24} className="text-red-600" />
        </div>
        <h2 className="font-bold text-gray-900 mb-1">Tài khoản tạm khóa</h2>
        <p className="text-sm text-gray-500 mb-4">Bạn đã nhập sai mật khẩu 5 lần. Vui lòng thử lại sau hoặc đặt lại mật khẩu.</p>
        <button onClick={() => { setView('forgot'); reset(); }} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">Đặt lại mật khẩu</button>
        <button onClick={() => { setView('login'); setFailedLogins(0); reset(); }} className="mt-2 w-full text-sm text-gray-500">Quay lại đăng nhập</button>
      </div>
    </AuthShell>
  );

  if (view === 'admin_locked') return (
    <AuthShell>
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={24} className="text-red-600" />
        </div>
        <h2 className="font-bold text-gray-900 mb-1">Tài khoản bị khóa</h2>
        <p className="text-sm text-gray-500 mb-4">Tài khoản của bạn đã bị Quản trị viên khóa. Vui lòng liên hệ bộ phận hỗ trợ để được giải quyết.</p>
        <button onClick={() => { setView('login'); reset(); setEmail(''); }} className="text-sm text-orange-600 hover:underline">Thử tài khoản khác</button>
      </div>
    </AuthShell>
  );

  if (view === 'otp' || view === 'forgot-otp') return (
    <AuthShell>
      <button onClick={() => { setView(view === 'otp' ? 'register' : 'forgot'); reset(); }} className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <ArrowLeft size={14} /> Quay lại
      </button>
      <h2 className="font-bold text-gray-900 mb-1">Xác thực OTP</h2>
      <p className="text-sm text-gray-500 mb-4">Mã mô phỏng đã được gửi đến <strong>{pendingEmail}</strong>. (Demo: <code className="bg-gray-100 px-1 rounded">123456</code>)</p>
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-1">Nhập mã OTP</label>
        <input value={otp} onChange={e => { setOtp(e.target.value); setErrors({}); }} maxLength={6}
          className={`w-full border rounded-lg px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.otp ? 'border-red-400' : 'border-gray-300'}`} />
        <Err field="otp" />
      </div>
      <div className="flex items-center justify-between mb-4">
        {otpTimer > 0
          ? <p className="text-xs text-gray-400">Gửi lại sau {otpTimer}s</p>
          : <button onClick={() => { startOtpTimer(); toast.success('Đã gửi OTP mới. Dùng: 123456'); }} className="text-xs text-orange-600 flex items-center gap-1"><RefreshCw size={12} /> Gửi lại mã</button>}
      </div>
      <button onClick={view === 'otp' ? handleOtpSubmit : handleForgotOtp} disabled={processing}
        className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
        {processing ? 'Đang xác thực...' : 'Xác nhận'}
      </button>
    </AuthShell>
  );

  if (view === 'reset') return (
    <AuthShell>
      <h2 className="font-bold text-gray-900 mb-4">Đặt lại mật khẩu</h2>
      <PwField label="Mật khẩu mới" value={password} onChange={p => { setPassword(p); setErrors({}); }} show={showPw} onToggle={() => setShowPw(s => !s)} error={errors.password} />
      <PwField label="Xác nhận mật khẩu" value={confirmPassword} onChange={p => { setConfirmPassword(p); setErrors({}); }} show={showPw} onToggle={() => setShowPw(s => !s)} error={errors.confirmPassword} />
      <button onClick={handleReset} disabled={processing} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 mt-2">
        {processing ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
      </button>
    </AuthShell>
  );

  if (view === 'forgot') return (
    <AuthShell>
      <button onClick={() => { setView('login'); reset(); }} className="flex items-center gap-1 text-sm text-gray-500 mb-4"><ArrowLeft size={14} /> Quay lại</button>
      <h2 className="font-bold text-gray-900 mb-4">Quên mật khẩu</h2>
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 block mb-1">Email / Số điện thoại đã đăng ký</label>
        <input value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`} />
        <Err field="email" />
      </div>
      <button onClick={handleForgotSubmit} disabled={processing} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
        {processing ? 'Đang gửi...' : 'Gửi mã xác thực'}
      </button>
    </AuthShell>
  );

  if (view === 'register') return (
    <AuthShell>
      <h2 className="font-bold text-gray-900 mb-4">Đăng ký tài khoản</h2>
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-600 block mb-1">Email / Số điện thoại <span className="text-red-500">*</span></label>
        <input value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`} />
        <Err field="email" />
      </div>
      <PwField label="Mật khẩu" value={password} onChange={p => { setPassword(p); setErrors({}); }} show={showPw} onToggle={() => setShowPw(s => !s)} error={errors.password} required />
      <PwField label="Xác nhận mật khẩu" value={confirmPassword} onChange={p => { setConfirmPassword(p); setErrors({}); }} show={showPw} onToggle={() => setShowPw(s => !s)} error={errors.confirmPassword} required />
      <button onClick={handleRegister} disabled={processing} className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 mt-1">
        {processing ? 'Đang xử lý...' : 'Đăng ký'}
      </button>
      <p className="text-center text-sm text-gray-500 mt-3">
        Đã có tài khoản? <button onClick={() => { setView('login'); reset(); }} className="text-orange-600 font-medium">Đăng nhập</button>
      </p>
    </AuthShell>
  );

  // Login (default)
  return (
    <AuthShell>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl">🛍️</span>
        </div>
        <h2 className="font-bold text-gray-900">Đăng nhập EC Voucher</h2>
        <p className="text-xs text-gray-400 mt-0.5">Demo: bất kỳ email + mật khẩu <code className="bg-gray-100 px-1 rounded">123456</code></p>
      </div>
      {errors._global && (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-600 mb-3 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" /> {errors._global}
        </div>
      )}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-600 block mb-1">Email / Số điện thoại</label>
        <input value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`} />
        <Err field="email" />
      </div>
      <PwField label="Mật khẩu" value={password} onChange={p => { setPassword(p); setErrors({}); }} show={showPw} onToggle={() => setShowPw(s => !s)} error={errors.password} />
      <div className="flex justify-end mb-3">
        <button onClick={() => { setView('forgot'); reset(); setEmail(''); }} className="text-xs text-orange-600 hover:underline">Quên mật khẩu?</button>
      </div>
      <button onClick={handleLogin} disabled={processing} className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
        {processing ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      <p className="text-center text-sm text-gray-500 mt-4">
        Chưa có tài khoản? <button onClick={() => { setView('register'); reset(); setEmail(''); setPassword(''); }} className="text-orange-600 font-medium">Đăng ký ngay</button>
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6">
        {children}
      </div>
    </div>
  );
}

function PwField({ label, value, onChange, show, onToggle, error, required }: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; error?: string; required?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-600 block mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${error ? 'border-red-400' : 'border-gray-300'}`} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

import type { ReactNode } from "react";
