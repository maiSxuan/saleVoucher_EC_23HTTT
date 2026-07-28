import { useState } from "react";
import { Plus, User, X, Search, Lock, Unlock, Trash2, Edit2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { mockPartnerStaff, mockPartnerBranches, partnerRoleLabels, staffStatusLabels, type PartnerStaff } from "../data/partnerMockData";

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-700', label: 'Hoạt động' },
  locked: { color: 'bg-red-100 text-red-700', label: 'Bị khóa' },
  deleted: { color: 'bg-gray-100 text-gray-500', label: 'Đã vô hiệu hóa' },
};

export default function PartnerStaff() {
  const [staff, setStaff] = useState<PartnerStaff[]>(mockPartnerStaff);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<PartnerStaff | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'lock' | 'unlock' | 'delete'; staffId: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'staff' as 'manager' | 'staff', branchIds: [] as string[] });
  const [newStaffErrors, setNewStaffErrors] = useState<Record<string, string>>({});

  const filtered = staff.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || s.role === filterRole;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const activeBranches = mockPartnerBranches.filter(b => b.status === 'active');

  const validateNew = () => {
    const errors: Record<string, string> = {};
    if (!newStaff.name) errors.name = 'Vui lòng nhập họ tên.';
    if (!newStaff.email && !newStaff.phone) errors.email = 'Cần nhập Email hoặc SĐT.';
    if (newStaff.email && !newStaff.email.includes('@')) errors.email = 'Email không hợp lệ.';
    if (newStaff.role === 'staff' && !newStaff.branchIds.length) errors.branchIds = 'Nhân viên chi nhánh cần được gán ít nhất một chi nhánh.';
    if (staff.find(s => s.email === newStaff.email && s.status !== 'deleted')) errors.email = 'Email đã được sử dụng.';
    return errors;
  };

  const handleAddStaff = () => {
    const errors = validateNew();
    if (Object.keys(errors).length) { setNewStaffErrors(errors); return; }
    setProcessing(true);
    setTimeout(() => {
      const ns: PartnerStaff = {
        id: `PS${Date.now()}`,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        branchIds: newStaff.branchIds,
        status: 'active',
        createdAt: new Date().toLocaleDateString('vi-VN'),
        createdBy: 'Trần Minh Tú',
      };
      setStaff(s => [ns, ...s]);
      setShowAddForm(false);
      setNewStaff({ name: '', email: '', phone: '', role: 'staff', branchIds: [] });
      setNewStaffErrors({});
      setProcessing(false);
      toast.success(`Đã tạo tài khoản cho ${ns.name}. Thông tin đăng nhập mô phỏng đã được gửi.`);
    }, 800);
  };

  const handleSaveEdit = () => {
    if (!editingStaff) return;
    setProcessing(true);
    setTimeout(() => {
      setStaff(s => s.map(x => x.id === editingStaff.id ? editingStaff : x));
      setEditingStaff(null);
      setProcessing(false);
      toast.success('Đã cập nhật thông tin nhân viên.');
    }, 600);
  };

  const handleAction = () => {
    if (!confirmAction) return;
    setProcessing(true);
    setTimeout(() => {
      if (confirmAction.type === 'lock') {
        setStaff(s => s.map(x => x.id === confirmAction.staffId ? { ...x, status: 'locked' } : x));
        toast.success('Tài khoản nhân viên đã bị khóa. Phiên làm việc đã bị hủy.');
      } else if (confirmAction.type === 'unlock') {
        setStaff(s => s.map(x => x.id === confirmAction.staffId ? { ...x, status: 'active' } : x));
        toast.success('Đã mở khóa tài khoản nhân viên.');
      } else if (confirmAction.type === 'delete') {
        setStaff(s => s.map(x => x.id === confirmAction.staffId ? { ...x, status: 'deleted' } : x));
        toast.success('Tài khoản nhân viên đã bị vô hiệu hóa vĩnh viễn. Lịch sử được giữ lại.');
      }
      setConfirmAction(null);
      setProcessing(false);
    }, 700);
  };

  const confirmingStaff = confirmAction ? staff.find(s => s.id === confirmAction.staffId) : null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhân viên</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản nhân viên trong doanh nghiệp — chỉ Owner thực hiện</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700">
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-emerald-300 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Thêm nhân viên mới</h3>
            <button onClick={() => setShowAddForm(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700 mb-3">
            Thông tin đăng nhập ban đầu sẽ được tạo mô phỏng và gửi cho nhân viên.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StaffField label="Họ tên" required value={newStaff.name} onChange={v => setNewStaff(s => ({ ...s, name: v }))} error={newStaffErrors.name} />
            <StaffField label="Email" value={newStaff.email} onChange={v => setNewStaff(s => ({ ...s, email: v }))} error={newStaffErrors.email} />
            <StaffField label="Số điện thoại" value={newStaff.phone} onChange={v => setNewStaff(s => ({ ...s, phone: v }))} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vai trò <span className="text-red-500">*</span></label>
              <select value={newStaff.role} onChange={e => setNewStaff(s => ({ ...s, role: e.target.value as 'manager' | 'staff', branchIds: [] }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="manager">Quản lý vận hành</option>
                <option value="staff">Nhân viên chi nhánh</option>
              </select>
            </div>
          </div>
          {newStaff.role === 'staff' && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh phụ trách <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-2">
                {activeBranches.map(b => (
                  <label key={b.id} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={newStaff.branchIds.includes(b.id)} onChange={e => setNewStaff(s => ({ ...s, branchIds: e.target.checked ? [...s.branchIds, b.id] : s.branchIds.filter(id => id !== b.id) }))} className="rounded border-gray-300 text-emerald-600" />
                    <span className="text-sm text-gray-700">{b.name}</span>
                  </label>
                ))}
              </div>
              {newStaffErrors.branchIds && <p className="text-red-500 text-xs mt-1">{newStaffErrors.branchIds}</p>}
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Hủy</button>
            <button onClick={handleAddStaff} disabled={processing} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
              {processing ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-40">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, email..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">Tất cả vai trò</option>
          <option value="manager">Quản lý vận hành</option>
          <option value="staff">Nhân viên chi nhánh</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Bị khóa</option>
          <option value="deleted">Đã vô hiệu hóa</option>
        </select>
        <span className="px-2 py-2 text-sm text-gray-400">{filtered.length} kết quả</span>
      </div>

      {/* Staff table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <User size={36} className="mb-2" />
            <p className="text-sm">Không có nhân viên phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Họ tên', 'Email / SĐT', 'Vai trò', 'Chi nhánh phụ trách', 'Trạng thái', 'Ngày tạo', 'Hành động'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(s => {
                  const sCfg = statusConfig[s.status];
                  const branches = s.branchIds.map(bid => mockPartnerBranches.find(b => b.id === bid)?.name || bid);
                  return (
                    <tr key={s.id} className={`${s.status === 'deleted' ? 'opacity-50' : ''} hover:bg-gray-50`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <User size={12} className="text-emerald-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <p>{s.email}</p>
                        {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{partnerRoleLabels[s.role]}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px]">
                        {branches.length ? branches.join(', ') : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${sCfg.color}`}>{sCfg.label}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{s.createdAt}</td>
                      <td className="px-4 py-3">
                        {s.status !== 'deleted' && (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setEditingStaff({ ...s })} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Sửa"><Edit2 size={13} /></button>
                            {s.status === 'active' && (
                              <button onClick={() => setConfirmAction({ type: 'lock', staffId: s.id })} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600" title="Khóa"><Lock size={13} /></button>
                            )}
                            {s.status === 'locked' && (
                              <button onClick={() => setConfirmAction({ type: 'unlock', staffId: s.id })} className="p-1.5 rounded hover:bg-green-50 text-gray-400 hover:text-green-600" title="Mở khóa"><Unlock size={13} /></button>
                            )}
                            <button onClick={() => setConfirmAction({ type: 'delete', staffId: s.id })} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600" title="Vô hiệu hóa"><Trash2 size={13} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setEditingStaff(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Chỉnh sửa nhân viên</h3>
              <button onClick={() => setEditingStaff(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <StaffField label="Họ tên" value={editingStaff.name} onChange={v => setEditingStaff(s => s ? { ...s, name: v } : s)} />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vai trò</label>
                <select value={editingStaff.role} onChange={e => setEditingStaff(s => s ? { ...s, role: e.target.value as 'manager' | 'staff', branchIds: e.target.value === 'manager' ? [] : s.branchIds } : s)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="manager">Quản lý vận hành</option>
                  <option value="staff">Nhân viên chi nhánh</option>
                </select>
              </div>
              {editingStaff.role === 'staff' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh phụ trách <span className="text-red-500">*</span></label>
                  <div className="space-y-1">
                    {activeBranches.map(b => (
                      <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingStaff.branchIds.includes(b.id)} onChange={e => setEditingStaff(s => s ? { ...s, branchIds: e.target.checked ? [...s.branchIds, b.id] : s.branchIds.filter(id => id !== b.id) } : s)} className="rounded border-gray-300 text-emerald-600" />
                        <span className="text-sm text-gray-700">{b.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditingStaff(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">Hủy</button>
              <button onClick={handleSaveEdit} disabled={processing} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm action modal */}
      {confirmAction && confirmingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setConfirmAction(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2 mb-3">
              {confirmAction.type === 'delete' ? <AlertCircle size={20} className="text-red-600" /> : confirmAction.type === 'lock' ? <Lock size={20} className="text-red-600" /> : <Unlock size={20} className="text-green-600" />}
              <h3 className="font-bold text-gray-900">
                {confirmAction.type === 'lock' ? 'Khóa tài khoản' : confirmAction.type === 'unlock' ? 'Mở khóa tài khoản' : 'Vô hiệu hóa tài khoản'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {confirmAction.type === 'lock' && `Tài khoản của ${confirmingStaff.name} sẽ bị khóa. Phiên làm việc hiện tại sẽ bị hủy ngay.`}
              {confirmAction.type === 'unlock' && `Tài khoản của ${confirmingStaff.name} sẽ được mở khóa và có thể đăng nhập bình thường.`}
              {confirmAction.type === 'delete' && `Tài khoản của ${confirmingStaff.name} sẽ bị vô hiệu hóa vĩnh viễn. Lịch sử xác nhận voucher được giữ lại.`}
            </p>
            {confirmAction.type === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 mb-3">
                Thao tác này không thể hoàn tác trên giao diện.
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setConfirmAction(null)} disabled={processing} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm">Hủy</button>
              <button onClick={handleAction} disabled={processing}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60 ${confirmAction.type === 'unlock' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {processing ? 'Đang xử lý...' : confirmAction.type === 'lock' ? 'Xác nhận khóa' : confirmAction.type === 'unlock' ? 'Xác nhận mở khóa' : 'Xác nhận vô hiệu hóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffField({ label, value, onChange, required, error }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; error?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? 'border-red-400' : 'border-gray-300'}`} />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
