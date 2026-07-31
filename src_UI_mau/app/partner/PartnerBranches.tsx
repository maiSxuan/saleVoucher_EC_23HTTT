import { useState } from "react";
import { Plus, Store, Clock, X, Edit2, Trash2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { mockPartnerBranches, branchRequestStatusLabels, type PartnerBranch } from "../data/partnerMockData";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Hoạt động', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Tạm ngưng', color: 'bg-orange-100 text-orange-700' },
  pending: { label: 'Chờ duyệt thêm', color: 'bg-amber-100 text-amber-700' },
  pending_update: { label: 'Chờ duyệt cập nhật', color: 'bg-blue-100 text-blue-700' },
  pending_delete: { label: 'Chờ duyệt xóa', color: 'bg-red-100 text-red-700' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-700' },
  need_info: { label: 'Yêu cầu bổ sung', color: 'bg-purple-100 text-purple-700' },
};

export default function PartnerBranches() {
  const [branches, setBranches] = useState<PartnerBranch[]>(mockPartnerBranches);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<PartnerBranch | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', region: '', address: '', phone: '', openTime: '08:00', closeTime: '22:00' });
  const [newBranchErrors, setNewBranchErrors] = useState<Record<string, string>>({});

  const validateBranch = (data: typeof newBranch) => {
    const errors: Record<string, string> = {};
    if (!data.name) errors.name = 'Vui lòng nhập tên chi nhánh.';
    if (!data.address) errors.address = 'Vui lòng nhập địa chỉ.';
    if (data.closeTime <= data.openTime) errors.closeTime = 'Giờ đóng phải sau giờ mở.';
    return errors;
  };

  const handleAddBranch = () => {
    const errors = validateBranch(newBranch);
    if (Object.keys(errors).length) { setNewBranchErrors(errors); return; }
    setProcessing(true);
    setTimeout(() => {
      const newB: PartnerBranch = {
        id: `PB${Date.now()}`,
        partnerId: 'P002',
        ...newBranch,
        status: 'active',
        pendingRequest: {
          type: 'add',
          status: 'pending',
          requestedAt: new Date().toLocaleDateString('vi-VN'),
          proposed: { name: newBranch.name, address: newBranch.address, phone: newBranch.phone },
        },
      };
      setBranches(b => [...b, newB]);
      setShowAddForm(false);
      setNewBranch({ name: '', region: '', address: '', phone: '', openTime: '08:00', closeTime: '22:00' });
      setNewBranchErrors({});
      setProcessing(false);
      toast.success('Yêu cầu thêm chi nhánh đã được gửi đến Admin.');
    }, 700);
  };

  const handleEditBranch = (branch: PartnerBranch) => {
    setProcessing(true);
    setTimeout(() => {
      setBranches(bs => bs.map(b => b.id === branch.id ? {
        ...b,
        pendingRequest: {
          type: 'edit',
          status: 'pending_update',
          requestedAt: new Date().toLocaleDateString('vi-VN'),
          current: { name: b.name, address: b.address, phone: b.phone, openTime: b.openTime, closeTime: b.closeTime },
          proposed: { name: branch.name, address: branch.address, phone: branch.phone, openTime: branch.openTime, closeTime: branch.closeTime },
        }
      } : b));
      setShowEditForm(null);
      setProcessing(false);
      toast.success('Yêu cầu cập nhật chi nhánh đã được gửi đến Admin.');
    }, 700);
  };

  const handleDeleteRequest = (branchId: string) => {
    setProcessing(true);
    setTimeout(() => {
      setBranches(bs => bs.map(b => b.id === branchId ? {
        ...b,
        pendingRequest: { type: 'delete', status: 'pending_delete', requestedAt: new Date().toLocaleDateString('vi-VN'), proposed: {} }
      } : b));
      setShowDeleteConfirm(null);
      setProcessing(false);
      toast.success('Yêu cầu xóa chi nhánh đã được gửi đến Admin.');
    }, 700);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi nhánh</h1>
          <p className="text-sm text-gray-500 mt-1">{branches.length} chi nhánh — mọi thay đổi cần Admin duyệt</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setShowEditForm(null); }}
          disabled={showAddForm}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          <Plus size={16} /> Thêm chi nhánh
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700 flex items-start gap-2">
        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
        <span>Thêm, sửa và xóa chi nhánh đều cần Admin phê duyệt. Chi nhánh chưa được duyệt không được dùng để tạo voucher.</span>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-emerald-300 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Thêm chi nhánh mới</h3>
            <button onClick={() => setShowAddForm(false)}><X size={16} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BranchField label="Tên chi nhánh" required value={newBranch.name} onChange={v => setNewBranch(b => ({ ...b, name: v }))} error={newBranchErrors.name} />
            <BranchField label="Khu vực" value={newBranch.region} onChange={v => setNewBranch(b => ({ ...b, region: v }))} placeholder="VD: TP.HCM - Quận 1" />
            <BranchField label="Địa chỉ" required value={newBranch.address} onChange={v => setNewBranch(b => ({ ...b, address: v }))} error={newBranchErrors.address} />
            <BranchField label="Số điện thoại" value={newBranch.phone} onChange={v => setNewBranch(b => ({ ...b, phone: v }))} />
            <BranchField label="Giờ mở cửa" type="time" value={newBranch.openTime} onChange={v => setNewBranch(b => ({ ...b, openTime: v }))} />
            <BranchField label="Giờ đóng cửa" type="time" value={newBranch.closeTime} onChange={v => setNewBranch(b => ({ ...b, closeTime: v }))} error={newBranchErrors.closeTime} />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
            <button onClick={handleAddBranch} disabled={processing} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
              {processing ? 'Đang gửi...' : 'Gửi yêu cầu thêm'}
            </button>
          </div>
        </div>
      )}

      {/* Branch list */}
      <div className="space-y-3">
        {branches.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Store size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{b.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusConfig[b.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                        {statusConfig[b.status]?.label || b.status}
                      </span>
                      {b.pendingRequest && (
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusConfig[b.pendingRequest.status]?.color || 'bg-amber-100 text-amber-700'}`}>
                          {statusConfig[b.pendingRequest.status]?.label || b.pendingRequest.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{b.region && `${b.region} — `}{b.address}</p>
                    <p className="text-sm text-gray-400">{b.phone && `📞 ${b.phone} · `}🕐 {b.openTime} – {b.closeTime}</p>
                  </div>
                </div>
                {!b.pendingRequest && b.status === 'active' && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setShowEditForm(b)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit2 size={14} /></button>
                    <button onClick={() => setShowDeleteConfirm(b.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>

              {/* Pending request diff */}
              {b.pendingRequest && b.pendingRequest.type === 'edit' && b.pendingRequest.current && (
                <div className="mt-3 border border-dashed border-blue-300 rounded-lg overflow-hidden">
                  <div className="bg-blue-50 px-3 py-1.5">
                    <p className="text-xs font-semibold text-blue-700">Yêu cầu cập nhật — đang chờ duyệt</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-1.5 text-left text-gray-500">Trường</th>
                        <th className="px-3 py-1.5 text-left text-gray-500">Hiện tại</th>
                        <th className="px-3 py-1.5 text-left text-blue-600">Đề nghị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(['openTime', 'closeTime', 'phone'] as const).filter(k => b.pendingRequest!.proposed[k] !== b.pendingRequest!.current?.[k]).map(k => (
                        <tr key={k}>
                          <td className="px-3 py-1.5 text-gray-500">{k === 'openTime' ? 'Giờ mở' : k === 'closeTime' ? 'Giờ đóng' : 'Số điện thoại'}</td>
                          <td className="px-3 py-1.5 text-gray-700">{String(b.pendingRequest!.current?.[k] || '—')}</td>
                          <td className="px-3 py-1.5 text-blue-700 font-medium">{String(b.pendingRequest!.proposed[k] || '—')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {b.pendingRequest && b.pendingRequest.type === 'add' && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <Clock size={12} /> Chi nhánh đang chờ Admin phê duyệt — chưa được dùng để tạo voucher
                </div>
              )}

              {b.pendingRequest && b.pendingRequest.type === 'delete' && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} /> Yêu cầu xóa đang chờ Admin — chi nhánh vẫn hoạt động cho đến khi được duyệt
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit form modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setShowEditForm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Cập nhật chi nhánh</h3>
              <button onClick={() => setShowEditForm(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-amber-600 bg-amber-50 rounded p-2 mb-4">Thay đổi sẽ được lưu riêng và chờ Admin duyệt. Dữ liệu hiện tại vẫn có hiệu lực.</p>
            <div className="grid grid-cols-2 gap-3">
              <BranchField label="Tên chi nhánh" value={showEditForm.name} onChange={v => setShowEditForm(b => b ? { ...b, name: v } : b)} />
              <BranchField label="Số điện thoại" value={showEditForm.phone} onChange={v => setShowEditForm(b => b ? { ...b, phone: v } : b)} />
              <BranchField label="Địa chỉ" value={showEditForm.address} onChange={v => setShowEditForm(b => b ? { ...b, address: v } : b)} />
              <BranchField label="Khu vực" value={showEditForm.region} onChange={v => setShowEditForm(b => b ? { ...b, region: v } : b)} />
              <BranchField label="Giờ mở" type="time" value={showEditForm.openTime} onChange={v => setShowEditForm(b => b ? { ...b, openTime: v } : b)} />
              <BranchField label="Giờ đóng" type="time" value={showEditForm.closeTime} onChange={v => setShowEditForm(b => b ? { ...b, closeTime: v } : b)} />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowEditForm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700">Hủy</button>
              <button onClick={() => handleEditBranch(showEditForm)} disabled={processing} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
                {processing ? 'Đang gửi...' : 'Gửi yêu cầu cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setShowDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-red-600" />
              <h3 className="font-bold text-gray-900">Yêu cầu xóa chi nhánh</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Yêu cầu xóa sẽ được gửi đến Admin. Chi nhánh vẫn hoạt động cho đến khi có quyết định.</p>
            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-600 mb-4">
              Chú ý: Không thể gửi yêu cầu xóa nếu có voucher đang bán gắn với chi nhánh này.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm">Hủy</button>
              <button onClick={() => handleDeleteRequest(showDeleteConfirm)} disabled={processing} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-60">
                {processing ? 'Đang gửi...' : 'Gửi yêu cầu xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BranchField({ label, value, onChange, placeholder, type = 'text', required, error }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${error ? 'border-red-400' : 'border-gray-300'}`} />
      {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
    </div>
  );
}
