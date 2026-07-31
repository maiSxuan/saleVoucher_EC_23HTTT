import { useState } from "react";
import { Store, Eye, EyeOff, ArrowLeft, ArrowRight, Check, AlertCircle, Clock, Upload } from "lucide-react";
import { toast } from "sonner";

type AuthView = 'login' | 'register' | 'forgot' | 'otp' | 'reset' | 'waiting' | 'rejected' | 'locked';

interface PartnerAuthProps {
  onLoginSuccess: (role: 'owner' | 'staff') => void;
}

const CATEGORIES = ['Ẩm thực', 'Spa & Làm đẹp', 'Du lịch', 'Giáo dục', 'Giải trí', 'Sức khỏe', 'Mua sắm'];
const STEPS = ['Tài khoản', 'Doanh nghiệp', 'Chi nhánh & Đại diện', 'Xác nhận'];

export default function PartnerAuth({ onLoginSuccess }: PartnerAuthProps) {
  const [view, setView] = useState<AuthView>('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // OTP
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [otpPurpose, setOtpPurpose] = useState<'register' | 'forgot'>('register');

  // Register
  const [regData, setRegData] = useState({
    email: '', phone: '', password: '', confirmPassword: '',
    businessName: '', taxCode: '', businessType: '', mainAddress: '', categories: [] as string[],
    branchName: '', branchRegion: '', branchAddress: '', branchPhone: '', openTime: '08:00', closeTime: '22:00',
    repName: '', repTitle: '', repCccd: '', repPhone: '', repEmail: '',
  });
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Forgot / Reset
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleLogin = () => {
    setLoginError('');
    if (!loginEmail || !loginPassword) { setLoginError('Vui lòng nhập đầy đủ thông tin.'); return; }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      if (loginEmail === 'waiting@demo.com') { setView('waiting'); return; }
      if (loginEmail === 'rejected@demo.com') { setView('rejected'); return; }
      if (loginEmail === 'locked@demo.com') { setView('locked'); return; }
      if (loginEmail === 'staff@demo.com' && loginPassword === '123456') { onLoginSuccess('staff'); return; }
      if (loginPassword === '123456') { onLoginSuccess('owner'); return; }
      setLoginError('Email/SĐT hoặc mật khẩu không đúng.');
    }, 800);
  };

  const handleOtp = () => {
    if (otp !== '123456') { setOtpError('Mã OTP không đúng. Vui lòng thử lại.'); return; }
    if (otpPurpose === 'register') { setRegisterStep(2); setView('register'); }
    else { setView('reset'); }
    setOtp(''); setOtpError('');
  };

  const handleRegisterNext = () => {
    const errors: Record<string, string> = {};
    if (registerStep === 1) {
      if (!regData.email) errors.email = 'Vui lòng nhập email.';
      if (!regData.password) errors.password = 'Vui lòng nhập mật khẩu.';
      if (regData.password && regData.password.length < 8) errors.password = 'Mật khẩu tối thiểu 8 ký tự.';
      if (regData.password !== regData.confirmPassword) errors.confirmPassword = 'Mật khẩu không khớp.';
      if (!Object.keys(errors).length) { setOtpPurpose('register'); setView('otp'); setOtpCountdown(60); }
    } else if (registerStep === 2) {
      if (!regData.businessName) errors.businessName = 'Vui lòng nhập tên doanh nghiệp.';
      if (!regData.taxCode) errors.taxCode = 'Vui lòng nhập mã số thuế.';
      if (!regData.businessType) errors.businessType = 'Vui lòng chọn loại hình.';
      if (!regData.mainAddress) errors.mainAddress = 'Vui lòng nhập địa chỉ.';
      if (!regData.categories.length) errors.categories = 'Chọn ít nhất một danh mục.';
      if (!Object.keys(errors).length) setRegisterStep(3);
    } else if (registerStep === 3) {
      if (!regData.branchName) errors.branchName = 'Vui lòng nhập tên chi nhánh.';
      if (!regData.branchAddress) errors.branchAddress = 'Vui lòng nhập địa chỉ chi nhánh.';
      if (!regData.repName) errors.repName = 'Vui lòng nhập họ tên người đại diện.';
      if (!regData.repCccd) errors.repCccd = 'Vui lòng nhập CCCD.';
      if (!Object.keys(errors).length) setRegisterStep(4);
    } else if (registerStep === 4) {
      toast.success('Hồ sơ đã được gửi thành công. Vui lòng chờ Admin xét duyệt.');
      setView('waiting');
    }
    setRegErrors(errors);
  };

  const handleForgot = () => {
    if (!forgotEmail) return;
    setOtpPurpose('forgot'); setView('otp'); setOtpCountdown(60);
    toast.info('Mã OTP mô phỏng đã được gửi (nhập 123456 để thử).');
  };

  const handleReset = () => {
    if (!newPassword || newPassword !== confirmNewPassword) return;
    toast.success('Mật khẩu đã được cập nhật thành công.');
    setView('login');
  };

  const toggleCategory = (c: string) =>
    setRegData(d => ({ ...d, categories: d.categories.includes(c) ? d.categories.filter(x => x !== c) : [...d.categories, c] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* LOGIN */}
          {view === 'login' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Store size={22} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Đăng nhập Partner Portal</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý voucher & chi nhánh của bạn</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-700">
                <strong>Demo:</strong> Mật khẩu <code className="bg-amber-100 px-1 rounded">123456</code> với bất kỳ email (owner). Dùng <code className="bg-amber-100 px-1 rounded">staff@demo.com</code> / <code className="bg-amber-100 px-1 rounded">123456</code> cho nhân viên.
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email / Số điện thoại</label>
                  <input
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="email@doanhnghiep.vn"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2.5 top-2.5 text-gray-400">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
                    <AlertCircle size={14} /> {loginError}
                  </div>
                )}
                <button onClick={handleLogin} disabled={loginLoading}
                  className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 disabled:opacity-60">
                  {loginLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <div className="flex items-center justify-between text-sm">
                  <button onClick={() => setView('forgot')} className="text-emerald-600 hover:underline">Quên mật khẩu?</button>
                  <button onClick={() => { setView('register'); setRegisterStep(1); }} className="text-emerald-600 hover:underline">Đăng ký đối tác</button>
                </div>
              </div>
            </div>
          )}

          {/* OTP */}
          {view === 'otp' && (
            <div>
              <button onClick={() => setView(otpPurpose === 'register' ? 'register' : 'forgot')} className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800">
                <ArrowLeft size={14} /> Quay lại
              </button>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Xác thực OTP</h2>
              <p className="text-sm text-gray-500 mb-4">Mã xác thực mô phỏng. Nhập <strong>123456</strong> để tiếp tục.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP (6 chữ số)</label>
                  <input value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} placeholder="______"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                {otpError && <p className="text-red-600 text-sm flex items-center gap-1"><AlertCircle size={13} /> {otpError}</p>}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1"><Clock size={13} /> {otpCountdown}s</span>
                  <button onClick={() => { setOtpCountdown(60); toast.info('Đã gửi lại OTP mô phỏng.'); }} className="text-emerald-600 hover:underline">Gửi lại mã</button>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-600">Gửi OTP là mô phỏng — không gửi email/SMS thật.</div>
                <button onClick={handleOtp} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700">Xác nhận</button>
              </div>
            </div>
          )}

          {/* REGISTER */}
          {view === 'register' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setView('login')} className="text-gray-400 hover:text-gray-700"><ArrowLeft size={16} /></button>
                <h2 className="text-lg font-bold text-gray-900">Đăng ký Đối tác</h2>
              </div>
              <div className="flex items-center mb-6">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i + 1 < registerStep ? 'bg-emerald-600 text-white' : i + 1 === registerStep ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                      {i + 1 < registerStep ? <Check size={13} /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i + 1 < registerStep ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mb-4">Bước {registerStep}: {STEPS[registerStep - 1]}</p>

              <div className="space-y-3">
                {registerStep === 1 && (
                  <>
                    <FieldInput label="Email *" placeholder="email@doanhnghiep.vn" value={regData.email} onChange={v => setRegData(d => ({ ...d, email: v }))} error={regErrors.email} />
                    <FieldInput label="Số điện thoại" placeholder="09xxxxxxxx" value={regData.phone} onChange={v => setRegData(d => ({ ...d, phone: v }))} />
                    <FieldInput label="Mật khẩu *" type="password" value={regData.password} onChange={v => setRegData(d => ({ ...d, password: v }))} error={regErrors.password} />
                    <FieldInput label="Xác nhận mật khẩu *" type="password" value={regData.confirmPassword} onChange={v => setRegData(d => ({ ...d, confirmPassword: v }))} error={regErrors.confirmPassword} />
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs text-gray-500">
                      CAPTCHA mô phỏng — <span className="text-emerald-600 font-medium">Tôi không phải robot ✓</span>
                    </div>
                  </>
                )}
                {registerStep === 2 && (
                  <>
                    <FieldInput label="Tên doanh nghiệp *" value={regData.businessName} onChange={v => setRegData(d => ({ ...d, businessName: v }))} error={regErrors.businessName} />
                    <FieldInput label="Mã số thuế *" placeholder="10 chữ số" value={regData.taxCode} onChange={v => setRegData(d => ({ ...d, taxCode: v }))} error={regErrors.taxCode} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình doanh nghiệp *</label>
                      <select value={regData.businessType} onChange={e => setRegData(d => ({ ...d, businessType: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Chọn loại hình...</option>
                        <option>Công ty TNHH</option>
                        <option>Công ty Cổ phần</option>
                        <option>Doanh nghiệp tư nhân</option>
                        <option>Hộ kinh doanh</option>
                      </select>
                      {regErrors.businessType && <p className="text-red-500 text-xs mt-0.5">{regErrors.businessType}</p>}
                    </div>
                    <FieldInput label="Địa chỉ cơ sở chính *" value={regData.mainAddress} onChange={v => setRegData(d => ({ ...d, mainAddress: v }))} error={regErrors.mainAddress} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục kinh doanh *</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(c => (
                          <button key={c} type="button" onClick={() => toggleCategory(c)}
                            className={`px-2 py-1 rounded text-xs border transition-colors ${regData.categories.includes(c) ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                      {regErrors.categories && <p className="text-red-500 text-xs mt-0.5">{regErrors.categories}</p>}
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 hover:border-emerald-400 cursor-pointer">
                      <Upload size={18} className="mx-auto mb-1 text-gray-400" />
                      <p>Giấy phép kinh doanh *</p>
                      <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG — tối đa 10MB (mô phỏng)</p>
                    </div>
                  </>
                )}
                {registerStep === 3 && (
                  <>
                    <p className="text-sm font-semibold text-gray-700">Chi nhánh đầu tiên</p>
                    <FieldInput label="Tên chi nhánh *" value={regData.branchName} onChange={v => setRegData(d => ({ ...d, branchName: v }))} error={regErrors.branchName} />
                    <FieldInput label="Khu vực" placeholder="VD: TP.HCM - Quận 1" value={regData.branchRegion} onChange={v => setRegData(d => ({ ...d, branchRegion: v }))} />
                    <FieldInput label="Địa chỉ chi nhánh *" value={regData.branchAddress} onChange={v => setRegData(d => ({ ...d, branchAddress: v }))} error={regErrors.branchAddress} />
                    <FieldInput label="Số điện thoại chi nhánh" value={regData.branchPhone} onChange={v => setRegData(d => ({ ...d, branchPhone: v }))} />
                    <div className="grid grid-cols-2 gap-2">
                      <FieldInput label="Giờ mở cửa" type="time" value={regData.openTime} onChange={v => setRegData(d => ({ ...d, openTime: v }))} />
                      <FieldInput label="Giờ đóng cửa" type="time" value={regData.closeTime} onChange={v => setRegData(d => ({ ...d, closeTime: v }))} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 pt-2">Người đại diện pháp lý</p>
                    <FieldInput label="Họ tên *" value={regData.repName} onChange={v => setRegData(d => ({ ...d, repName: v }))} error={regErrors.repName} />
                    <FieldInput label="Chức vụ" value={regData.repTitle} onChange={v => setRegData(d => ({ ...d, repTitle: v }))} />
                    <FieldInput label="CCCD *" placeholder="12 số" value={regData.repCccd} onChange={v => setRegData(d => ({ ...d, repCccd: v }))} error={regErrors.repCccd} />
                    <div className="grid grid-cols-2 gap-2">
                      <FieldInput label="SĐT đại diện" value={regData.repPhone} onChange={v => setRegData(d => ({ ...d, repPhone: v }))} />
                      <FieldInput label="Email đại diện" value={regData.repEmail} onChange={v => setRegData(d => ({ ...d, repEmail: v }))} />
                    </div>
                  </>
                )}
                {registerStep === 4 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Vui lòng xem lại thông tin trước khi gửi hồ sơ:</p>
                    <ReviewSection title="Tài khoản" items={[['Email', regData.email || '(chưa nhập)'], ['SĐT', regData.phone || '(chưa nhập)']]} />
                    <ReviewSection title="Doanh nghiệp" items={[['Tên', regData.businessName || '(chưa nhập)'], ['MST', regData.taxCode || '(chưa nhập)'], ['Loại hình', regData.businessType || '(chưa nhập)'], ['Danh mục', regData.categories.join(', ') || '(chưa chọn)']]} />
                    <ReviewSection title="Chi nhánh" items={[['Tên CN', regData.branchName || '(chưa nhập)'], ['Địa chỉ', regData.branchAddress || '(chưa nhập)'], ['Giờ hoạt động', `${regData.openTime} – ${regData.closeTime}`]]} />
                    <ReviewSection title="Người đại diện" items={[['Họ tên', regData.repName || '(chưa nhập)'], ['CCCD', regData.repCccd || '(chưa nhập)'], ['Email', regData.repEmail || '(chưa nhập)']]} />
                    <p className="text-xs text-gray-500">Bằng cách gửi hồ sơ, bạn đồng ý với điều khoản và chính sách của nền tảng.</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {registerStep > 1 && (
                    <button onClick={() => setRegisterStep(s => s - 1)} className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                      <ArrowLeft size={14} /> Quay lại
                    </button>
                  )}
                  <button onClick={handleRegisterNext} className="flex-1 flex items-center justify-center gap-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700">
                    {registerStep === 4 ? 'Gửi hồ sơ đăng ký' : <><span>Tiếp tục</span><ArrowRight size={14} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FORGOT */}
          {view === 'forgot' && (
            <div>
              <button onClick={() => setView('login')} className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800"><ArrowLeft size={14} /> Quay lại đăng nhập</button>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Quên mật khẩu</h2>
              <p className="text-sm text-gray-500 mb-4">Nhập email/SĐT đã đăng ký để nhận mã OTP đặt lại mật khẩu.</p>
              <div className="space-y-3">
                <FieldInput label="Email / Số điện thoại" value={forgotEmail} onChange={setForgotEmail} placeholder="email@doanhnghiep.vn" />
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-600">Gửi OTP là mô phỏng — không gửi email/SMS thật.</div>
                <button onClick={handleForgot} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700">Gửi OTP mô phỏng</button>
              </div>
            </div>
          )}

          {/* RESET */}
          {view === 'reset' && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Đặt mật khẩu mới</h2>
              <div className="space-y-3">
                <FieldInput label="Mật khẩu mới" type="password" value={newPassword} onChange={setNewPassword} />
                <FieldInput label="Xác nhận mật khẩu mới" type="password" value={confirmNewPassword} onChange={setConfirmNewPassword} />
                {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                  <p className="text-red-500 text-sm">Mật khẩu không khớp.</p>
                )}
                <button onClick={handleReset} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700">Cập nhật mật khẩu</button>
              </div>
            </div>
          )}

          {/* WAITING */}
          {view === 'waiting' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Clock size={28} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hồ sơ đang được xét duyệt</h2>
              <p className="text-gray-500 text-sm mb-4">Quản trị viên đang kiểm tra thông tin doanh nghiệp của bạn. Thời gian xét duyệt thường trong 1–3 ngày làm việc.</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left text-sm text-amber-700 mb-4">
                <p className="font-medium mb-1">Hồ sơ: Sushi World Vietnam</p>
                <p>Gửi lúc: 16/07/2026 09:15</p>
                <p>Trạng thái: <span className="font-semibold">Chờ duyệt</span></p>
              </div>
              <button onClick={() => setView('login')} className="text-sm text-emerald-600 hover:underline">Quay lại trang đăng nhập</button>
            </div>
          )}

          {/* REJECTED */}
          {view === 'rejected' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hồ sơ bị từ chối</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm mb-4">
                <p className="font-medium text-red-700 mb-1">Lý do từ chối:</p>
                <p className="text-red-600">Thông tin giấy phép kinh doanh không hợp lệ. Vui lòng kiểm tra lại và liên hệ hỗ trợ để được hướng dẫn nộp lại hồ sơ.</p>
              </div>
              <p className="text-xs text-gray-400 mb-4">Liên hệ: support@ecvoucher.vn</p>
              <button onClick={() => setView('login')} className="text-sm text-emerald-600 hover:underline">Quay lại đăng nhập</button>
            </div>
          )}

          {/* LOCKED */}
          {view === 'locked' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tài khoản Tạm khóa</h2>
              <p className="text-gray-500 text-sm mb-4">Tài khoản doanh nghiệp của bạn đã Tạm khóa bởi Quản trị viên. Vui lòng liên hệ hỗ trợ để được giải quyết.</p>
              <p className="text-xs text-gray-400 mb-4">Liên hệ: support@ecvoucher.vn | 1900 xxxx</p>
              <button onClick={() => setView('login')} className="text-sm text-emerald-600 hover:underline">Quay lại đăng nhập</button>
            </div>
          )}

        </div>
        <p className="text-center text-xs text-gray-400 mt-4">EC Voucher Marketplace — Partner Portal v2.0</p>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', error }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? 'border-red-400' : 'border-gray-300'}`} />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}

function ReviewSection({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map(([k, v]) => (
          <div key={k} className="px-3 py-1.5 flex justify-between text-sm">
            <span className="text-gray-500">{k}</span>
            <span className="text-gray-900 font-medium text-right max-w-[200px] break-all">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
