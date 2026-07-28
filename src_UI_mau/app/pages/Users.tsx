import { useState, useEffect } from "react";
import { Search, X, ChevronRight, ArrowLeft, ShoppingBag, Clock, Eye } from "lucide-react";
import { toast } from "sonner";
import { mockUsers, roleLabels, type User, type UserRole, type UserStatus } from "../data/mockData";
import { StatusBadge, getUserStatusBadge } from "../components/ui/StatusBadge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import type { Page } from "../components/layout/AdminLayout";

interface UsersProps {
  initialFilters?: Record<string, unknown>;
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
}

const roleBadge: Record<UserRole, { label: string; variant: 'blue' | 'green' | 'amber' | 'purple' | 'gray' }> = {
  customer: { label: 'Khách hàng', variant: 'blue' },
  partner: { label: 'Đối tác', variant: 'green' },
  partner_staff: { label: 'Nhân viên ĐT', variant: 'amber' },
  admin: { label: 'Quản trị viên', variant: 'purple' },
};

export default function Users({ initialFilters, onNavigate }: UsersProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterRole, setFilterRole] = useState<string>(String(initialFilters?.role || ''));
  const [filterStatus, setFilterStatus] = useState<string>(String(initialFilters?.status || ''));
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  // Modal states
  const [lockModal, setLockModal] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('customer');

  useEffect(() => {
    if (initialFilters?.status) setFilterStatus(String(initialFilters.status));
  }, [initialFilters]);

  const filteredUsers = users.filter(u => {
    const matchName = !searchName || u.name.toLowerCase().includes(searchName.toLowerCase());
    const matchPhone = !searchPhone || u.phone.includes(searchPhone);
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchName && matchPhone && matchRole && matchStatus;
  });

  const handleLock = async (reason?: string) => {
    if (!selectedUser) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Khóa tài khoản', executor: 'Admin Hệ thống', before: 'Đang hoạt động', after: 'Bị khóa', reason };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'locked' as UserStatus, adminHistory: [...u.adminHistory, log] } : u));
    setSelectedUser(prev => prev ? { ...prev, status: 'locked', adminHistory: [...prev.adminHistory, log] } : null);
    setLockModal(false);
    toast.success('Đã khóa tài khoản thành công.', { description: `Xem nhật ký cho ${selectedUser.name}` });
  };

  const handleUnlock = async (reason?: string) => {
    if (!selectedUser) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Mở khóa tài khoản', executor: 'Admin Hệ thống', before: 'Bị khóa', after: 'Đang hoạt động', reason };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: 'active' as UserStatus, adminHistory: [...u.adminHistory, log] } : u));
    setSelectedUser(prev => prev ? { ...prev, status: 'active', adminHistory: [...prev.adminHistory, log] } : null);
    setUnlockModal(false);
    toast.success('Đã mở khóa tài khoản thành công.');
  };

  const handleUpdateRole = async (reason?: string) => {
    if (!selectedUser) return;
    const log = { timestamp: new Date().toLocaleString('vi-VN'), action: 'Cập nhật vai trò', executor: 'Admin Hệ thống', before: roleLabels[selectedUser.role], after: roleLabels[newRole], reason };
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole, adminHistory: [...u.adminHistory, log] } : u));
    setSelectedUser(prev => prev ? { ...prev, role: newRole, adminHistory: [...prev.adminHistory, log] } : null);
    setRoleModal(false);
    toast.success(`Vai trò đã được cập nhật thành "${roleLabels[newRole]}".`);
  };

  if (selectedUser) {
    const badge = getUserStatusBadge(selectedUser.status);
    const rb = roleBadge[selectedUser.role];
    return (
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => setSelectedUser(null)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <StatusBadge {...badge} />
                  <StatusBadge label={rb.label} variant={rb.variant} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setNewRole(selectedUser.role); setRoleModal(true); }}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cập nhật vai trò
              </button>
              {selectedUser.status === 'active' ? (
                <button
                  onClick={() => setLockModal(true)}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Khóa tài khoản
                </button>
              ) : (
                <button
                  onClick={() => setUnlockModal(true)}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mở khóa tài khoản
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4 bg-white rounded-t-xl border border-b-0 px-4">
          {['info', 'purchase', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab === 'info' ? 'Thông tin cá nhân' : tab === 'purchase' ? 'Lịch sử mua voucher' : 'Lịch sử quản trị'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Họ tên', value: selectedUser.name },
                { label: 'Email', value: selectedUser.email },
                { label: 'Số điện thoại', value: selectedUser.phone },
                { label: 'Vai trò', value: roleLabels[selectedUser.role] },
                { label: 'Trạng thái', value: selectedUser.status === 'active' ? 'Đang hoạt động' : 'Bị khóa' },
                { label: 'Ngày tham gia', value: selectedUser.createdAt },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'purchase' && (
            <div>
              {selectedUser.purchaseHistory.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-gray-400">
                  <ShoppingBag size={40} className="mb-2" />
                  <p className="text-sm">Chưa có lịch sử mua voucher.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedUser.purchaseHistory.map((p, i) => (
                    <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.voucherName}</p>
                        <p className="text-xs text-gray-500">{p.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{p.amount.toLocaleString('vi-VN')}đ</p>
                        <p className="text-xs text-gray-500">{p.codeStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {selectedUser.adminHistory.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-gray-400">
                  <Clock size={40} className="mb-2" />
                  <p className="text-sm">Chưa có lịch sử quản trị.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedUser.adminHistory.map((h, i) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-4 py-1">
                      <p className="text-sm font-medium text-gray-900">{h.action}</p>
                      <div className="text-xs text-gray-500 space-y-0.5 mt-1">
                        <p>Thời gian: {h.timestamp}</p>
                        <p>Người thực hiện: {h.executor}</p>
                        <p>Trước: {h.before} → Sau: {h.after}</p>
                        {h.reason && <p>Lý do: {h.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmModal
          open={lockModal}
          onClose={() => setLockModal(false)}
          onConfirm={handleLock}
          title="Khóa tài khoản"
          targetName={selectedUser.name}
          beforeStatus="Đang hoạt động"
          afterStatus="Bị khóa"
          warning="Tài khoản bị khóa sẽ không thể đăng nhập. Lịch sử mua voucher vẫn được giữ nguyên."
          requireReason
          reasonLabel="Lý do khóa tài khoản"
          confirmLabel="Xác nhận khóa"
          confirmVariant="danger"
        />

        <ConfirmModal
          open={unlockModal}
          onClose={() => setUnlockModal(false)}
          onConfirm={handleUnlock}
          title="Mở khóa tài khoản"
          targetName={selectedUser.name}
          beforeStatus="Bị khóa"
          afterStatus="Đang hoạt động"
          consequences={['Tài khoản sẽ có thể đăng nhập và sử dụng hệ thống.']}
          requireReason
          reasonLabel="Lý do mở khóa tài khoản"
          confirmLabel="Xác nhận mở khóa"
        />

        {/* Role update modal */}
        {roleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setRoleModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cập nhật vai trò</h3>
              <p className="text-sm text-gray-600 mb-2">Tài khoản: <strong>{selectedUser.name}</strong></p>
              <p className="text-sm text-gray-500 mb-1">Vai trò hiện tại: <strong>{roleLabels[selectedUser.role]}</strong></p>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">Vai trò mới</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as UserRole)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(roleLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-5">
                <button onClick={() => setRoleModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button
                  onClick={() => handleUpdateRole()}
                  disabled={newRole === selectedUser.role}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Xác nhận cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-sm text-gray-500 mt-1">Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Tìm theo họ tên..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              placeholder="Tìm theo số điện thoại..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            {Object.entries(roleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{filteredUsers.length} tài khoản</p>
          <button
            onClick={() => { setSearchName(''); setSearchPhone(''); setFilterRole(''); setFilterStatus(''); }}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Search size={40} className="mb-2" />
            <p className="text-sm font-medium">Không tìm thấy tài khoản phù hợp</p>
            <p className="text-xs mt-1">Hãy thử điều chỉnh điều kiện tìm kiếm</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Họ tên', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Hành động'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => {
                  const sb = getUserStatusBadge(user.status);
                  const rb = roleBadge[user.role];
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={rb.label} variant={rb.variant} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge {...sb} />
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
