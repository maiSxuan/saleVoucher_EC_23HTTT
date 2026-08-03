import { useState } from "react";
import { User, Lock, Eye, EyeOff, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CustomerProfileData {
  fullName: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
}

interface Props {
  initialData: CustomerProfileData;
  onDataChange: (data: CustomerProfileData) => void;
}

type ProfileTab = 'info' | 'password';

function PwField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function CustomerProfile({ initialData, onDataChange }: Props) {
  const [tab, setTab] = useState<ProfileTab>('info');
  const [profile, setProfile] = useState<CustomerProfileData>(initialData);
  const [saving, setSaving] = useState(false);

  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const DEMO_PW = 'password123';

  const handleSaveProfile = () => {
    if (!profile.fullName.trim() || !profile.email.trim() || !profile.phone.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onDataChange(profile);
      setSaving(false);
      toast.success('Cập nhật hồ sơ thành công!');
    }, 700);
  };

  const handleChangePassword = () => {
    setPwError('');
    if (!oldPw || !newPw || !confirmPw) { setPwError('Vui lòng điền đầy đủ các trường.'); return; }
    if (oldPw !== DEMO_PW) { setPwError('Mật khẩu hiện tại không đúng.'); return; }
    if (newPw.length < 8) { setPwError('Mật khẩu mới phải từ 8 ký tự.'); return; }
    if (newPw !== confirmPw) { setPwError('Mật khẩu xác nhận không khớp.'); return; }

    setChangingPw(true);
    setTimeout(() => {
      setChangingPw(false);
      setOldPw(''); setNewPw(''); setConfirmPw('');
      toast.success('Đổi mật khẩu thành công! Mật khẩu demo vẫn là "password123".');
    }, 800);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Tài khoản của tôi</h1>

      {/* Tabs */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-5">
        <button onClick={() => setTab('info')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'info' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600'}`}>
          <User size={14} /> Hồ sơ cá nhân
        </button>
        <button onClick={() => setTab('password')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'password' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600'}`}>
          <Lock size={14} /> Đổi mật khẩu
        </button>
      </div>

      {tab === 'info' && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
              <User size={28} className="text-orange-500" />
            </div>
            <p className="text-sm font-semibold text-gray-900">{profile.fullName}</p>
            <p className="text-xs text-gray-400">{profile.email}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Họ và tên <span className="text-red-500">*</span></label>
            <input value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
            <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ngày sinh</label>
            <input type="date" value={profile.birthdate} onChange={e => setProfile(p => ({ ...p, birthdate: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Giới tính</label>
            <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
              <option value="">-- Chọn --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <button onClick={handleSaveProfile} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50 mt-2">
            <Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 mb-2">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">Demo: Mật khẩu hiện tại là <strong>password123</strong></p>
          </div>

          <PwField label="Mật khẩu hiện tại *" value={oldPw} onChange={setOldPw} placeholder="Nhập mật khẩu hiện tại" />
          <PwField label="Mật khẩu mới *" value={newPw} onChange={setNewPw} placeholder="Tối thiểu 8 ký tự" />
          <PwField label="Xác nhận mật khẩu mới *" value={confirmPw} onChange={setConfirmPw} placeholder="Nhập lại mật khẩu mới" />

          {pwError && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={12} /> {pwError}
            </div>
          )}

          <button onClick={handleChangePassword} disabled={changingPw}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 disabled:opacity-50">
            <Lock size={15} /> {changingPw ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
}
