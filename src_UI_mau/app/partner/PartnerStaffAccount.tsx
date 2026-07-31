import { useState } from "react";
import { User, Lock, Eye, EyeOff, Save, AlertCircle, Building2, Badge } from "lucide-react";
import { toast } from "sonner";

const DEMO_STAFF = {
  fullName: 'Nguyễn Thị Mai',
  email: 'mai.nguyen@sushiworld.vn',
  phone: '0912345678',
  role: 'Nhân viên',
  branch: 'Chi nhánh Lý Tự Trọng',
  joinedAt: '01/03/2026',
  status: 'active' as const,
};

const DEMO_PASSWORD = '123456';

function PwField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function PartnerStaffAccount() {
  const [tab, setTab] = useState<'info' | 'password'>('info');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChangePassword = () => {
    setPwError('');
    if (!oldPw || !newPw || !confirmPw) { setPwError('Vui lòng điền đầy đủ các trường.'); return; }
    if (oldPw !== DEMO_PASSWORD) { setPwError('Mật khẩu hiện tại không đúng.'); return; }
    if (newPw.length < 8) { setPwError('Mật khẩu mới phải từ 8 ký tự.'); return; }
    if (newPw !== confirmPw) { setPwError('Mật khẩu xác nhận không khớp.'); return; }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOldPw(''); setNewPw(''); setConfirmPw('');
      toast.success('Đổi mật khẩu thành công!');
    }, 800);
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-gray-900 mb-4">Tài khoản của tôi</h1>

      {/* Tabs */}
      <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-5">
        <button onClick={() => setTab('info')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'info' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600'}`}>
          <User size={14} /> Thông tin
        </button>
        <button onClick={() => setTab('password')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'password' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600'}`}>
          <Lock size={14} /> Đổi mật khẩu
        </button>
      </div>

      {tab === 'info' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {/* Avatar header */}
          <div className="bg-emerald-50 p-5 flex items-center gap-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <User size={26} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{DEMO_STAFF.fullName}</p>
              <p className="text-sm text-emerald-600">{DEMO_STAFF.role}</p>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Đang hoạt động
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="divide-y divide-gray-50">
            <InfoRow icon={User} label="Họ và tên" value={DEMO_STAFF.fullName} />
            <InfoRow icon={AlertCircle} label="Email" value={DEMO_STAFF.email} />
            <InfoRow icon={AlertCircle} label="Số điện thoại" value={DEMO_STAFF.phone} />
            <InfoRow icon={Badge} label="Vai trò" value={DEMO_STAFF.role} />
            <InfoRow icon={Building2} label="Chi nhánh phụ trách" value={DEMO_STAFF.branch} highlight />
            <InfoRow icon={AlertCircle} label="Ngày gia nhập" value={DEMO_STAFF.joinedAt} />
          </div>

          <div className="p-4 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700 flex items-start gap-1.5">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
              Thông tin tài khoản được quản lý bởi chủ doanh nghiệp. Liên hệ Owner để cập nhật thông tin cá nhân.
            </p>
          </div>
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 mb-2">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">Demo: Mật khẩu hiện tại là <strong>123456</strong></p>
          </div>

          <PwField label="Mật khẩu hiện tại *" value={oldPw} onChange={setOldPw} placeholder="Nhập mật khẩu hiện tại" />
          <PwField label="Mật khẩu mới *" value={newPw} onChange={setNewPw} placeholder="Tối thiểu 8 ký tự" />
          <PwField label="Xác nhận mật khẩu mới *" value={confirmPw} onChange={setConfirmPw} placeholder="Nhập lại mật khẩu mới" />

          {pwError && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={12} /> {pwError}
            </div>
          )}

          <button onClick={handleChangePassword} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50">
            <Save size={15} /> {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }: {
  icon: any; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon size={14} className="text-gray-400 flex-shrink-0" />
      <span className="text-xs text-gray-500 w-36 flex-shrink-0">{label}</span>
      <span className={`text-sm flex-1 ${highlight ? 'font-medium text-emerald-700' : 'text-gray-800'}`}>{value}</span>
    </div>
  );
}
