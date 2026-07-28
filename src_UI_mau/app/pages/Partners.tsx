import { useState, useEffect } from "react";
import { Search, X, ArrowLeft, Building2, MapPin, Phone, Mail, FileText, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { mockPartners, profileStatusLabels, type Partner, type PartnerProfileStatus } from "../data/mockData";
import { StatusBadge, getProfileStatusBadge } from "../components/ui/StatusBadge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { Page } from "../components/layout/AdminLayout";

interface PartnersProps {
  initialFilters?: Record<string, unknown>;
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
}

export default function Partners({ initialFilters, onNavigate }: PartnersProps) {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [searchName, setSearchName] = useState('');
  const [searchTax, setSearchTax] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>(String(initialFilters?.profileStatus || ''));
  const [hasPending, setHasPending] = useState(false);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [lockModal, setLockModal] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);
  const [branchReqModal, setBranchReqModal] = useState<{ open: boolean; reqId: string; action: 'approve' | 'reject' }>({ open: false, reqId: '', action: 'approve' });

  useEffect(() => {
    if (initialFilters?.profileStatus) setFilterStatus(String(initialFilters.profileStatus));
  }, [initialFilters]);

  const filtered = partners.filter(p => {
    const matchName = !searchName || p.businessName.toLowerCase().includes(searchName.toLowerCase());
    const matchTax = !searchTax || p.taxCode.includes(searchTax);
    const matchStatus = !filterStatus || p.profileStatus === filterStatus;
    const matchPending = !hasPending || p.branchRequests.some(r => r.status === 'pending');
    return matchName && matchTax && matchStatus && matchPending;
  });

  const doApprove = async (reason?: string) => {
    if (!selected) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Duyệt hồ sơ đối tác', executor: 'Admin Hệ thống', before: 'Chờ duyệt', after: 'Đã duyệt', reason: reason || '' };
    setPartners(prev => prev.map(p => p.id === selected.id ? { ...p, profileStatus: 'approved' as PartnerProfileStatus, adminHistory: [...p.adminHistory, log] } : p));
    setSelected(prev => prev ? { ...prev, profileStatus: 'approved', adminHistory: [...prev.adminHistory, log] } : null);
    setApproveModal(false);
    toast.success('Hồ sơ đối tác đã được duyệt.', { description: 'Đối tác có thể tạo và bán voucher.' });
  };

  const doReject = async (reason?: string) => {
    if (!selected) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Từ chối hồ sơ đối tác', executor: 'Admin Hệ thống', before: 'Chờ duyệt', after: 'Bị từ chối', reason: reason || '' };
    setPartners(prev => prev.map(p => p.id === selected.id ? { ...p, profileStatus: 'rejected' as PartnerProfileStatus, adminHistory: [...p.adminHistory, log] } : p));
    setSelected(prev => prev ? { ...prev, profileStatus: 'rejected', adminHistory: [...prev.adminHistory, log] } : null);
    setRejectModal(false);
    toast.success('Đã từ chối hồ sơ đối tác.', { description: `Lý do đã được ghi nhận.` });
  };

  const doLock = async (reason?: string) => {
    if (!selected) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Khóa đối tác', executor: 'Admin Hệ thống', before: 'Hoạt động', after: 'Bị khóa', reason: reason || '' };
    setPartners(prev => prev.map(p => p.id === selected.id ? { ...p, profileStatus: 'locked' as PartnerProfileStatus, adminHistory: [...p.adminHistory, log] } : p));
    setSelected(prev => prev ? { ...prev, profileStatus: 'locked', adminHistory: [...prev.adminHistory, log] } : null);
    setLockModal(false);
    toast.success('Đã khóa đối tác.');
  };

  const doUnlock = async (reason?: string) => {
    if (!selected) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Mở khóa đối tác', executor: 'Admin Hệ thống', before: 'Bị khóa', after: 'Hoạt động', reason: reason || '' };
    setPartners(prev => prev.map(p => p.id === selected.id ? { ...p, profileStatus: 'approved' as PartnerProfileStatus, adminHistory: [...p.adminHistory, log] } : p));
    setSelected(prev => prev ? { ...prev, profileStatus: 'approved', adminHistory: [...prev.adminHistory, log] } : null);
    setUnlockModal(false);
    toast.success('Đã mở khóa đối tác.');
  };

  const doBranchReq = async (action: 'approve' | 'reject', reqId: string, reason?: string) => {
    if (!selected) return;
    setPartners(prev => prev.map(p => p.id === selected.id ? {
      ...p,
      branchRequests: p.branchRequests.map(r => r.id === reqId ? { ...r, status: action === 'approve' ? 'approved' as const : 'rejected' as const, reason } : r)
    } : p));
    setSelected(prev => prev ? {
      ...prev,
      branchRequests: prev.branchRequests.map(r => r.id === reqId ? { ...r, status: action === 'approve' ? 'approved' as const : 'rejected' as const, reason } : r)
    } : null);
    setBranchReqModal({ open: false, reqId: '', action: 'approve' });
    toast.success(action === 'approve' ? 'Đã duyệt yêu cầu thay đổi chi nhánh.' : 'Đã từ chối yêu cầu thay đổi chi nhánh.');
  };

  if (selected) {
    const badge = getProfileStatusBadge(selected.profileStatus);
    const pendingRequests = selected.branchRequests.filter(r => r.status === 'pending');
    const currentBranchReq = branchReqModal.open ? selected.branchRequests.find(r => r.id === branchReqModal.reqId) : null;

    return (
      <div className="p-6 max-w-6xl mx-auto">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 size={22} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.businessName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge {...badge} />
                  <span className="text-xs text-gray-400">MST: {selected.taxCode}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selected.profileStatus === 'pending' && (
                <>
                  <button onClick={() => setApproveModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <CheckCircle size={14} /> Duyệt hồ sơ
                  </button>
                  <button onClick={() => setRejectModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <XCircle size={14} /> Từ chối
                  </button>
                </>
              )}
              {selected.profileStatus === 'approved' && (
                <button onClick={() => setLockModal(true)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Khóa đối tác
                </button>
              )}
              {selected.profileStatus === 'locked' && (
                <button onClick={() => setUnlockModal(true)} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Mở khóa
                </button>
              )}
              <button
                onClick={() => onNavigate('vouchers', { partnerId: selected.id })}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xem voucher
              </button>
            </div>
          </div>
        </div>

        {/* Pending branch alert */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <p className="text-sm text-amber-700">{pendingRequests.length} yêu cầu thay đổi chi nhánh đang chờ xử lý.</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl border border-b-0 px-4 overflow-x-auto">
          {[
            { id: 'info', label: 'Thông tin' },
            { id: 'branches', label: `Chi nhánh (${selected.branches.length})` },
            { id: 'requests', label: `Yêu cầu chi nhánh${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}` },
            { id: 'history', label: 'Lịch sử xử lý' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Thông tin doanh nghiệp</h4>
                {[
                  { label: 'Tên doanh nghiệp', value: selected.businessName },
                  { label: 'Mã số thuế', value: selected.taxCode },
                  { label: 'Địa chỉ', value: selected.address, icon: MapPin },
                  { label: 'Ngày đăng ký', value: selected.createdAt },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400">{f.label}</p>
                    <p className="text-sm text-gray-900">{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Người đại diện & Liên hệ</h4>
                {[
                  { label: 'Người đại diện', value: selected.representative },
                  { label: 'Số điện thoại', value: selected.phone, icon: Phone },
                  { label: 'Email', value: selected.email, icon: Mail },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400">{f.label}</p>
                    <p className="text-sm text-gray-900">{f.value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tài liệu pháp lý</p>
                  {selected.documents.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      <FileText size={13} /> {d}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="space-y-3">
              {selected.branches.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MapPin size={36} className="mx-auto mb-2" />
                  <p className="text-sm">Chưa có chi nhánh nào.</p>
                </div>
              ) : (
                selected.branches.map(b => (
                  <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{b.name}</h5>
                      <StatusBadge
                        label={b.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                        variant={b.status === 'active' ? 'green' : 'red'}
                        dot
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {b.address}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {b.phone}</span>
                      <span className="text-xs">Phạm vi: {b.voucherScope}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              {selected.branchRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CheckCircle size={36} className="mx-auto mb-2" />
                  <p className="text-sm">Không có yêu cầu thay đổi chi nhánh.</p>
                </div>
              ) : (
                selected.branchRequests.map(req => (
                  <div key={req.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          label={req.type === 'add' ? 'Thêm chi nhánh' : req.type === 'edit' ? 'Sửa chi nhánh' : 'Xóa chi nhánh'}
                          variant={req.type === 'add' ? 'green' : req.type === 'edit' ? 'blue' : 'red'}
                        />
                        <span className="text-xs text-gray-500">Yêu cầu {req.requestedAt}</span>
                      </div>
                      <StatusBadge
                        label={req.status === 'pending' ? 'Chờ xử lý' : req.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối'}
                        variant={req.status === 'pending' ? 'amber' : req.status === 'approved' ? 'green' : 'red'}
                        dot
                      />
                    </div>

                    {req.type === 'edit' && req.current && (
                      <div className="overflow-x-auto mb-3">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-3 py-1.5 text-left text-xs text-gray-500">Trường</th>
                              <th className="border border-gray-200 px-3 py-1.5 text-left text-xs text-gray-500">Hiện tại</th>
                              <th className="border border-gray-200 px-3 py-1.5 text-left text-xs text-gray-500">Đề nghị thay đổi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.keys(req.proposed).map(key => (
                              <tr key={key} className={req.current && req.current[key as keyof typeof req.current] !== req.proposed[key as keyof typeof req.proposed] ? 'bg-amber-50' : ''}>
                                <td className="border border-gray-200 px-3 py-1.5 text-gray-600 capitalize">{key}</td>
                                <td className="border border-gray-200 px-3 py-1.5 text-gray-700">{String(req.current?.[key as keyof typeof req.current] || '-')}</td>
                                <td className="border border-gray-200 px-3 py-1.5 text-blue-700 font-medium">{String(req.proposed[key as keyof typeof req.proposed] || '-')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {req.type === 'add' && (
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        {Object.entries(req.proposed).map(([k, v]) => (
                          <div key={k}>
                            <p className="text-xs text-gray-400">{k}</p>
                            <p className="text-gray-800">{String(v)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {req.reason && <p className="text-xs text-gray-500 mb-3">Ghi chú: {req.reason}</p>}

                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setBranchReqModal({ open: true, reqId: req.id, action: 'approve' })}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle size={13} /> Duyệt
                        </button>
                        <button
                          onClick={() => setBranchReqModal({ open: true, reqId: req.id, action: 'reject' })}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <XCircle size={13} /> Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {selected.adminHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Chưa có lịch sử xử lý.</p>
                </div>
              ) : (
                selected.adminHistory.map((h, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-4 py-1">
                    <p className="text-sm font-medium text-gray-900">{h.action}</p>
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                      <p>{h.timestamp} — {h.executor}</p>
                      <p>Trước: {h.before} → Sau: {h.after}</p>
                      {h.reason && <p>Lý do: {h.reason}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmModal open={approveModal} onClose={() => setApproveModal(false)} onConfirm={doApprove}
          title="Duyệt hồ sơ đối tác" targetName={selected.businessName}
          beforeStatus="Chờ duyệt" afterStatus="Đã duyệt"
          consequences={['Đối tác được phép hoạt động trên sàn.', 'Chi nhánh hợp lệ có thể áp dụng voucher.', 'Portal đối tác nhận trạng thái mới.']}
          requireReason reasonLabel="Lý do duyệt" confirmLabel="Xác nhận duyệt" />

        <ConfirmModal open={rejectModal} onClose={() => setRejectModal(false)} onConfirm={doReject}
          title="Từ chối hồ sơ đối tác" targetName={selected.businessName}
          beforeStatus="Chờ duyệt" afterStatus="Bị từ chối"
          warning="Đối tác sẽ không được tạo hoặc bán voucher."
          requireReason reasonLabel="Lý do từ chối" confirmLabel="Xác nhận từ chối" confirmVariant="danger" />

        <ConfirmModal open={lockModal} onClose={() => setLockModal(false)} onConfirm={doLock}
          title="Khóa đối tác" targetName={selected.businessName}
          beforeStatus="Hoạt động" afterStatus="Bị khóa"
          consequences={['Chi nhánh của đối tác không được dùng cho voucher mới.', 'Nhân viên đối tác bị ảnh hưởng quyền vận hành.']}
          requireReason reasonLabel="Lý do khóa" confirmLabel="Xác nhận khóa" confirmVariant="danger" />

        <ConfirmModal open={unlockModal} onClose={() => setUnlockModal(false)} onConfirm={doUnlock}
          title="Mở khóa đối tác" targetName={selected.businessName}
          beforeStatus="Bị khóa" afterStatus="Hoạt động"
          requireReason reasonLabel="Lý do mở khóa" confirmLabel="Xác nhận mở khóa" />

        {branchReqModal.open && currentBranchReq && (
          <ConfirmModal
            open={branchReqModal.open}
            onClose={() => setBranchReqModal({ open: false, reqId: '', action: 'approve' })}
            onConfirm={reason => doBranchReq(branchReqModal.action, branchReqModal.reqId, reason)}
            title={branchReqModal.action === 'approve' ? 'Duyệt yêu cầu chi nhánh' : 'Từ chối yêu cầu chi nhánh'}
            targetName={selected.businessName}
            requireReason={branchReqModal.action === 'reject'}
            reasonLabel="Lý do từ chối"
            confirmLabel={branchReqModal.action === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
            confirmVariant={branchReqModal.action === 'reject' ? 'danger' : 'primary'}
            consequences={branchReqModal.action === 'approve' ? ['Danh sách chi nhánh chính thức sẽ được cập nhật.'] : ['Yêu cầu sẽ bị từ chối, danh sách chi nhánh giữ nguyên.']}
          />
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đối tác</h1>
        <p className="text-sm text-gray-500 mt-1">Kiểm tra, duyệt và quản lý hồ sơ đối tác.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchName} onChange={e => setSearchName(e.target.value)} placeholder="Tên doanh nghiệp..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchTax} onChange={e => setSearchTax(e.target.value)} placeholder="Mã số thuế..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(profileStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={hasPending} onChange={e => setHasPending(e.target.checked)} className="rounded" />
            Có yêu cầu chi nhánh chờ xử lý
          </label>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filtered.length} đối tác</p>
          <button onClick={() => { setSearchName(''); setSearchTax(''); setFilterStatus(''); setHasPending(false); }} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Building2 size={40} className="mb-2" />
            <p className="text-sm">Không tìm thấy đối tác phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Tên doanh nghiệp', 'Mã số thuế', 'Người đại diện', 'Chi nhánh', 'Trạng thái hồ sơ', 'Yêu cầu chờ', 'Hành động'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => {
                  const badge = getProfileStatusBadge(p.profileStatus);
                  const pendingCount = p.branchRequests.filter(r => r.status === 'pending').length;
                  return (
                    <tr key={p.id} onClick={() => setSelected(p)} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Building2 size={14} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{p.businessName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.taxCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.representative}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.branches.length}</td>
                      <td className="px-4 py-3"><StatusBadge {...badge} /></td>
                      <td className="px-4 py-3">
                        {pendingCount > 0 ? (
                          <StatusBadge label={`${pendingCount} yêu cầu`} variant="amber" dot />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                          <Eye size={14} /> Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
