import { useState, useEffect, useCallback } from 'react';
import { Search, X, ArrowLeft, Eye, Loader2, AlertCircle } from 'lucide-react';
import {
  fetchUsers,     // GET /admin/users — lấy danh sách
  lockUser,       // PATCH /admin/users/:id/lock — khóa tài khoản
  unlockUser,     // PATCH /admin/users/:id/unlock — mở khóa
  updateUserRole, // PATCH /admin/users/:id/role — đổi vai trò
} from '../../api/userApi';

// Mapping vai trò DB (lưu trong NGUOIDUNG.vai_tro) sang label hiển thị + màu badge
const ROLE_CONFIG = {
  'Admin': { label: 'Quản trị viên', badgeClass: 'bg-purple-100 text-purple-700 border border-purple-200' },
  'Nguoi dai dien': { label: 'Đối tác (Đại diện)', badgeClass: 'bg-green-100 text-green-700 border border-green-200' },
  'Nhan vien ban hang': { label: 'Nhân viên bán hàng', badgeClass: 'bg-amber-100 text-amber-700 border border-amber-200' },
  'Nhan vien quan ly voucher': { label: 'Nhân viên QL Voucher', badgeClass: 'bg-orange-100 text-orange-700 border border-orange-200' },
  'Khach hang': { label: 'Khách hàng', badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200' },
};

// Mapping trạng thái DB → label + màu
const STATUS_CONFIG = {
  'Dang hoat dong': { label: 'Đang hoạt động', dotClass: 'bg-green-500', textClass: 'text-green-700 bg-green-50 border border-green-200' },
  'Bi khoa': { label: 'Bị khóa', dotClass: 'bg-red-500', textClass: 'text-red-700 bg-red-50 border border-red-200' },
};

// Danh sách vai trò hợp lệ cho select input (cập nhật role)
// Đồng bộ với DB_ROLES ở backend/src/common/constants/roles.js
const VALID_ROLES = [
  { value: 'Khach hang', label: 'Khách hàng' },
  { value: 'Nguoi dai dien', label: 'Đối tác (Đại diện)' },
  { value: 'Nhan vien ban hang', label: 'Nhân viên bán hàng' },
  { value: 'Nhan vien quan ly voucher', label: 'Nhân viên QL Voucher' },
  { value: 'Admin', label: 'Quản trị viên' },
];

// -----------------------------------------------------------------------
// StatusBadge — Component hiển thị badge trạng thái (tái sử dụng trong file này)
// Tách thành component nhỏ để code gọn hơn
// -----------------------------------------------------------------------
function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, dotClass: 'bg-gray-400', textClass: 'text-gray-600 bg-gray-100 border border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.textClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

// RoleBadge — Component hiển thị badge vai trò
function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || { label: role, badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}>
      {config.label}
    </span>
  );
}

// -----------------------------------------------------------------------
// ConfirmModal — Modal xác nhận hành động khóa/mở khóa/đổi role
// Tại sao tự viết? → Frontend không dùng thư viện UI từ src_UI_mau (khác project)
// -----------------------------------------------------------------------
function ConfirmModal({ open, onClose, onConfirm, title, targetName, beforeStatus, afterStatus, warning, requireReason = false, reasonLabel = 'Lý do', confirmLabel = 'Xác nhận', isDanger = false, children }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Reset form mỗi lần modal mở
  useEffect(() => {
    if (open) { setReason(''); setError(''); setProcessing(false); }
  }, [open]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (requireReason && !reason.trim()) {
      setError(`${reasonLabel} là bắt buộc.`);
      return;
    }
    setProcessing(true);
    try {
      await onConfirm(reason.trim() || undefined);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay nền mờ */}
      <div className="absolute inset-0 bg-black/50" onClick={() => !processing && onClose()} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
            <AlertCircle size={18} className={isDanger ? 'text-red-600' : 'text-blue-600'} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {targetName && <p className="text-sm text-gray-500">{targetName}</p>}
          </div>
        </div>
        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Hiển thị thay đổi trạng thái */}
          {(beforeStatus || afterStatus) && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
              {beforeStatus && <div className="flex gap-2"><span className="text-gray-500 w-32">Trạng thái hiện tại:</span><span className="font-medium">{beforeStatus}</span></div>}
              {afterStatus && <div className="flex gap-2"><span className="text-gray-500 w-32">Trạng thái sau:</span><span className="text-blue-700 font-medium">{afterStatus}</span></div>}
            </div>
          )}
          {warning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">{warning}</div>
          )}
          {/* Nội dung tuỳ biến (ví dụ: select role) */}
          {children}
          {/* Trường nhập lý do */}
          {requireReason && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {reasonLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => { setReason(e.target.value); setError(''); }}
                rows={3}
                placeholder={`Nhập ${reasonLabel.toLowerCase()}...`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
          )}
          {error && !requireReason && <p className="text-sm text-red-600">{error}</p>}
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} disabled={processing} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Hủy</button>
          <button
            onClick={handleConfirm}
            disabled={processing}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium disabled:opacity-60 ${isDanger ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {processing && <Loader2 size={14} className="animate-spin" />}
            {processing ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// UserDetailPanel — Hiển thị chi tiết người dùng (phần tab Info)
// Tách ra component riêng để UserListPage gọn hơn
// -----------------------------------------------------------------------
function UserDetailPanel({ user, onLock, onUnlock, onRoleUpdate, onBack }) {
  const [activeTab, setActiveTab] = useState('info');
  const [lockModal, setLockModal] = useState(false);
  const [unlockModal, setUnlockModal] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState(user.role);
  const [roleReason, setRoleReason] = useState('');
  const [roleError, setRoleError] = useState('');
  const [roleProcessing, setRoleProcessing] = useState(false);

  const isActive = user.status === 'Dang hoat dong';

  const handleRoleUpdate = async () => {
    if (selectedNewRole === user.role) {
      setRoleError('Vai trò mới giống vai trò hiện tại.');
      return;
    }
    setRoleProcessing(true);
    try {
      await onRoleUpdate(user.id, selectedNewRole, roleReason.trim() || undefined);
      setRoleModal(false);
    } catch (err) {
      setRoleError(err.message);
    } finally {
      setRoleProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Nút quay lại */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
        <ArrowLeft size={16} /> Quay lại danh sách
      </button>

      {/* Header thông tin user */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Avatar chữ cái đầu */}
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <StatusBadge status={user.status} />
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setSelectedNewRole(user.role); setRoleReason(''); setRoleError(''); setRoleModal(true); }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cập nhật vai trò
            </button>
            {isActive ? (
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
        {['info'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Thông tin cá nhân
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Họ tên', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Số điện thoại', value: user.phone || '—' },
              { label: 'Vai trò', value: ROLE_CONFIG[user.role]?.label || user.role },
              { label: 'Trạng thái', value: STATUS_CONFIG[user.status]?.label || user.status },
              { label: 'Ngày tham gia', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—' },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs text-gray-500 mb-0.5">{f.label}</p>
                <p className="text-sm font-medium text-gray-900">{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal khóa tài khoản */}
      <ConfirmModal
        open={lockModal}
        onClose={() => setLockModal(false)}
        onConfirm={async (reason) => { await onLock(user.id, reason); setLockModal(false); }}
        title="Khóa tài khoản"
        targetName={user.name}
        beforeStatus="Đang hoạt động"
        afterStatus="Bị khóa"
        warning="Tài khoản bị khóa sẽ không thể đăng nhập. Lịch sử giao dịch vẫn được giữ nguyên."
        requireReason
        reasonLabel="Lý do khóa tài khoản"
        confirmLabel="Xác nhận khóa"
        isDanger
      />

      {/* Modal mở khóa tài khoản */}
      <ConfirmModal
        open={unlockModal}
        onClose={() => setUnlockModal(false)}
        onConfirm={async (reason) => { await onUnlock(user.id, reason); setUnlockModal(false); }}
        title="Mở khóa tài khoản"
        targetName={user.name}
        beforeStatus="Bị khóa"
        afterStatus="Đang hoạt động"
        requireReason
        reasonLabel="Lý do mở khóa"
        confirmLabel="Xác nhận mở khóa"
      />

      {/* Modal cập nhật vai trò */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !roleProcessing && setRoleModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Cập nhật vai trò</h3>
            <p className="text-sm text-gray-600 mb-1">Tài khoản: <strong>{user.name}</strong></p>
            <p className="text-sm text-gray-500 mb-4">Vai trò hiện tại: <strong>{ROLE_CONFIG[user.role]?.label || user.role}</strong></p>

            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò mới <span className="text-red-500">*</span></label>
            <select
              value={selectedNewRole}
              onChange={e => { setSelectedNewRole(e.target.value); setRoleError(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            >
              {VALID_ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Lý do thay đổi (tuỳ chọn)</label>
            <textarea
              value={roleReason}
              onChange={e => setRoleReason(e.target.value)}
              rows={2}
              placeholder="Nhập lý do..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
            />
            {roleError && <p className="text-sm text-red-600 mb-3">{roleError}</p>}

            <div className="flex justify-end gap-2">
              <button onClick={() => setRoleModal(false)} disabled={roleProcessing} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button
                onClick={handleRoleUpdate}
                disabled={roleProcessing || selectedNewRole === user.role}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {roleProcessing && <Loader2 size={14} className="animate-spin" />}
                {roleProcessing ? 'Đang xử lý...' : 'Xác nhận cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------
// UserListPage — Component chính (export)
// Tại sao không lấy data từ mockData?
//   → Theo yêu cầu task_X.md bước 3: "lấy data thật từ Supabase"
//   → Gọi qua userApi.js → backend → Supabase
// -----------------------------------------------------------------------
export default function UserListPage() {
  // --- State quản lý danh sách và UI ---
  const [users, setUsers] = useState([]);            // Danh sách user từ API
  const [loading, setLoading] = useState(false);     // Trạng thái đang tải
  const [error, setError] = useState('');            // Lỗi khi gọi API
  const [selectedUser, setSelectedUser] = useState(null); // User đang xem chi tiết

  // --- State bộ lọc tìm kiếm ---
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // --- State phân trang ---
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  // -----------------------------------------------------------------------
  // loadUsers — Hàm tải dữ liệu từ API backend
  // Được wrap bằng useCallback để tránh re-render không cần thiết
  // Dependency array = các bộ lọc: khi user thay đổi filter thì tải lại
  // -----------------------------------------------------------------------
  const loadUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      // Gọi userApi.fetchUsers — API sẽ query Supabase qua backend
      const result = await fetchUsers({
        page,
        limit: 20,
        name: searchName.trim() || undefined,
        phone: searchPhone.trim() || undefined,
        role: filterRole || undefined,
        status: filterStatus || undefined,
      });
      // result = { success: true, data: User[], pagination: {...} }
      setUsers(result.data || []);
      setPagination(result.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      // Hiển thị lỗi thay vì crash app
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [searchName, searchPhone, filterRole, filterStatus]); // Reload khi filter thay đổi

  // Tải dữ liệu lần đầu khi component mount và khi filter thay đổi
  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  // -----------------------------------------------------------------------
  // handleLock — Gọi API khóa tài khoản rồi cập nhật state local
  // -----------------------------------------------------------------------
  const handleLock = async (userId, reason) => {
    await lockUser(userId, reason); // Gọi API thật — backend ghi log + update DB
    // Cập nhật state local để UI phản ánh ngay không cần reload lại trang
    setUsers(prev => prev.map(u =>
      u.ma_nguoi_dung === userId || u.id === userId
        ? { ...u, trang_thai: 'Bi khoa', status: 'Bi khoa' }
        : u
    ));
    // Nếu đang xem chi tiết user đó, cập nhật luôn
    if (selectedUser && (selectedUser.id === userId || selectedUser.ma_nguoi_dung === userId)) {
      setSelectedUser(prev => ({ ...prev, status: 'Bi khoa', trang_thai: 'Bi khoa' }));
    }
  };

  // -----------------------------------------------------------------------
  // handleUnlock — Gọi API mở khóa tài khoản
  // -----------------------------------------------------------------------
  const handleUnlock = async (userId, reason) => {
    await unlockUser(userId, reason);
    setUsers(prev => prev.map(u =>
      u.ma_nguoi_dung === userId || u.id === userId
        ? { ...u, trang_thai: 'Dang hoat dong', status: 'Dang hoat dong' }
        : u
    ));
    if (selectedUser && (selectedUser.id === userId || selectedUser.ma_nguoi_dung === userId)) {
      setSelectedUser(prev => ({ ...prev, status: 'Dang hoat dong', trang_thai: 'Dang hoat dong' }));
    }
  };

  // -----------------------------------------------------------------------
  // handleRoleUpdate — Gọi API cập nhật vai trò
  // -----------------------------------------------------------------------
  const handleRoleUpdate = async (userId, newRole, reason) => {
    await updateUserRole(userId, newRole, reason);
    setUsers(prev => prev.map(u =>
      u.ma_nguoi_dung === userId || u.id === userId
        ? { ...u, vai_tro: newRole, role: newRole }
        : u
    ));
    if (selectedUser && (selectedUser.id === userId || selectedUser.ma_nguoi_dung === userId)) {
      setSelectedUser(prev => ({ ...prev, role: newRole, vai_tro: newRole }));
    }
  };

  // -----------------------------------------------------------------------
  // Normalize user — Chuẩn hóa field names từ API (backend trả camelCase từ UserModel)
  // UserModel: { id, name, email, phone, role, status, createdAt, branchId }
  // -----------------------------------------------------------------------
  const normalizeUser = (u) => ({
    id: u.id || u.ma_nguoi_dung,
    name: u.name || u.ho_ten,
    email: u.email,
    phone: u.phone || u.sdt,
    role: u.role || u.vai_tro,
    status: u.status || u.trang_thai,
    createdAt: u.createdAt || u.ngay_tao,
  });

  // Nếu đang xem chi tiết user → hiển thị UserDetailPanel
  if (selectedUser) {
    const normalized = normalizeUser(selectedUser);
    return (
      <UserDetailPanel
        user={normalized}
        onLock={handleLock}
        onUnlock={handleUnlock}
        onRoleUpdate={handleRoleUpdate}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  // -----------------------------------------------------------------------
  // Render danh sách (List View)
  // -----------------------------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tiêu đề trang */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Xem, tìm kiếm và quản lý tài khoản người dùng trong hệ thống. Dữ liệu thật từ Supabase.
        </p>
      </div>

      {/* Khu vực bộ lọc tìm kiếm */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tìm theo tên */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Tìm theo họ tên..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Tìm theo SĐT */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchPhone}
              onChange={e => setSearchPhone(e.target.value)}
              placeholder="Tìm theo số điện thoại..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Lọc theo vai trò */}
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            {VALID_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          {/* Lọc theo trạng thái */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Dang hoat dong">Đang hoạt động</option>
            <option value="Bi khoa">Bị khóa</option>
          </select>
        </div>
        {/* Thông tin + nút đặt lại */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-500">{pagination.total} tài khoản</p>
          <button
            onClick={() => { setSearchName(''); setSearchPhone(''); setFilterRole(''); setFilterStatus(''); }}
            className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1"
          >
            <X size={14} /> Đặt lại
          </button>
        </div>
      </div>

      {/* Nội dung chính: loading / error / empty / table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* UI State: Loading */}
        {loading && (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Loader2 size={36} className="animate-spin mb-3 text-blue-500" />
            <p className="text-sm">Đang tải danh sách người dùng...</p>
          </div>
        )}

        {/* UI State: Error */}
        {!loading && error && (
          <div className="flex flex-col items-center py-16 text-red-500">
            <AlertCircle size={36} className="mb-3" />
            <p className="text-sm font-medium">Lỗi tải dữ liệu</p>
            <p className="text-xs text-gray-500 mt-1 mb-4">{error}</p>
            <button
              onClick={() => loadUsers(1)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* UI State: Empty */}
        {!loading && !error && users.length === 0 && (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <Search size={40} className="mb-2" />
            <p className="text-sm font-medium">Không tìm thấy tài khoản phù hợp</p>
            <p className="text-xs mt-1">Hãy thử điều chỉnh điều kiện tìm kiếm</p>
          </div>
        )}

        {/* UI State: Success — Bảng danh sách người dùng */}
        {!loading && !error && users.length > 0 && (
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
                {users.map(rawUser => {
                  const user = normalizeUser(rawUser);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(rawUser)} // Lưu rawUser để detail panel normalize
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Avatar chữ cái đầu */}
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                      <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
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

            {/* Phân trang */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Trang {pagination.page} / {pagination.totalPages} ({pagination.total} tài khoản)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadUsers(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => loadUsers(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
