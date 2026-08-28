import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,  // Icon tổng quan
  Building2,        // Icon quản lý đối tác
  Ticket,           // Icon duyệt voucher
  Users,            // Icon quản lý người dùng
  ScrollText,       // Icon nhật ký hệ thống
  LogOut,           // Icon đăng xuất
  ChevronLeft,      // Icon thu gọn sidebar
  Menu,             // Icon mở sidebar mobile
  X,                // Icon đóng sidebar mobile
  Bell,             // Icon thông báo
  LayoutGrid,       // Icon quản lý nội dung
  ShoppingCart,     // Icon quản lý đơn hàng
  Star,             // Icon quản lý đánh giá
} from 'lucide-react';
import {
  ADMIN_PORTAL_ROLES,
  ADMIN_ROLES,
  getAdminRole,
  getAdminRoleConfig,
} from '../shared/constants/admin-roles';

// Danh sách menu được giới hạn theo đúng portal nghiệp vụ của từng Admin.
const NAV_ITEMS = [
  { path: '/admin/overview', label: 'Tổng quan', icon: LayoutDashboard, roles: ADMIN_PORTAL_ROLES },
  { path: '/admin/users', label: 'Quản lý người dùng', icon: Users, roles: [ADMIN_ROLES.SYSTEM] },
  { path: '/admin/logs', label: 'Nhật ký hệ thống', icon: ScrollText, roles: [ADMIN_ROLES.SYSTEM] },
  { path: '/admin/partners', label: 'Quản lý đối tác', icon: Building2, roles: [ADMIN_ROLES.MODERATION] },
  { path: '/admin/vouchers', label: 'Duyệt voucher', icon: Ticket, roles: [ADMIN_ROLES.MODERATION] },
  { path: '/admin/contents', label: 'Quản lý nội dung', icon: LayoutGrid, roles: [ADMIN_ROLES.MODERATION] },
  { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingCart, roles: [ADMIN_ROLES.OPERATION] },
  { path: '/admin/reviews', label: 'Quản lý đánh giá', icon: Star, roles: [ADMIN_ROLES.OPERATION] },
];

export function AdminLayout({ children }) {
  // State thu gọn / mở rộng sidebar (desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // State hiển thị / ẩn sidebar (mobile — overlay)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Để highlight menu item đang active

  // Lấy thông tin user từ localStorage (lưu khi login)
  const userStr = localStorage.getItem('user');
  let currentUser = { name: 'Quản trị viên', email: '' };
  try {
    const parsedUser = userStr ? JSON.parse(userStr) : null;
    if (parsedUser) {
      currentUser = { ...parsedUser };
      if (typeof currentUser.name === 'object' && currentUser.name !== null) {
        currentUser.name = currentUser.name.name || currentUser.name.ho_ten || JSON.stringify(currentUser.name);
      }
    }
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
  const adminRole = getAdminRole(currentUser);
  const adminRoleConfig = getAdminRoleConfig(currentUser);
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(adminRole));

  // Helper kiểm tra active route linh hoạt
  const isItemActive = (itemPath) => {
    if (location.pathname === itemPath) return true;
    if (itemPath === '/admin/overview') return false;
    if (location.pathname.startsWith(itemPath + '/')) return true;
    if (itemPath === '/admin/logs' && location.pathname.startsWith('/admin/audit-logs')) return true;
    return false;
  };

  // -----------------------------------------------------------------------
  // handleLogout — Xóa session và chuyển về trang login
  // -----------------------------------------------------------------------
  const handleLogout = () => {
    navigate('/logout', { replace: true });
  };

  // Lấy tên trang hiện tại từ nav items (dùng cho breadcrumb topbar)
  const currentNav = visibleNavItems.find(item => isItemActive(item.path));
  const currentPageLabel = currentNav?.label || adminRoleConfig?.label || 'Quản trị';

  return (
    <div className="theme-snow flex h-screen overflow-hidden bg-snow-50">
      {/* ---------------------------------------------------------------- */}
      {/* MOBILE OVERLAY — nền mờ khi sidebar mở trên mobile               */}
      {/* ---------------------------------------------------------------- */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SIDEBAR                                                           */}
      {/* ---------------------------------------------------------------- */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col bg-white border-r border-slate-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60' : 'w-16'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo + nút thu gọn */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200 min-h-[64px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Logo Snow Voucher */}
            <img
              src="/snowflake.png"
              alt=""
              aria-hidden="true"
              className="w-8 h-8 flex-shrink-0 object-contain drop-shadow-sm"
            />
            {/* Tên app — ẩn khi thu gọn sidebar */}
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">Snow Voucher</div>
                <div className="text-xs text-gray-500">Admin Portal</div>
              </div>
            )}
          </div>
          {/* Nút thu gọn (chỉ hiện trên desktop) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1 rounded hover:bg-gray-100 text-gray-400 ml-auto flex-shrink-0"
            title={sidebarOpen ? 'Thu gọn menu' : 'Mở rộng menu'}
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
            />
          </button>
          {/* Nút đóng (chỉ hiện trên mobile) */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Danh sách menu điều hướng */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-1 px-2">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                title={!sidebarOpen ? item.label : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${active
                    ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar: System Info + User */}
        {sidebarOpen && (
          <div className="p-3 border-t border-gray-100 bg-gray-50/70 text-xs text-gray-500">
            <div>Phiên bản: v1.0.4-Enterprise</div>
            <div className="text-[11px] text-gray-400 mt-0.5">RBAC: {adminRole}</div>
          </div>
        )}

        {/* Thông tin user + nút logout (cuối sidebar) */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            {/* Avatar chữ cái đầu */}
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-sky-700 font-semibold">
                {currentUser.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            {/* Tên + email (chỉ hiện khi sidebar mở) */}
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name || 'Quản trị viên'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {currentUser.email || ''}
                </div>
              </div>
            )}
            {/* Nút logout (chỉ hiện khi sidebar mở) */}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1 hover:bg-semantic-error-soft hover:text-semantic-error rounded text-gray-400 transition-colors"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* MAIN AREA = TOPBAR + CONTENT                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3 min-h-[64px] shadow-xs">
          {/* Nút mở sidebar (mobile) */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded hover:bg-gray-100 text-gray-500"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb: Cổng quản trị / Tên trang hiện tại */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400 font-medium">Cổng quản trị</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">{currentPageLabel}</span>
            </div>
          </div>

          {/* Phần bên phải: icon thông báo + thông tin user + logout */}
          <div className="flex items-center gap-3">
            {/* Icon chuông thông báo */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-600 rounded-full" />
            </button>

            {/* User info + logout (desktop) */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pl-3 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs">
                {currentUser.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="text-left">
                <span className="font-semibold text-xs text-gray-900 block leading-tight">
                  {currentUser.name || 'Quản trị viên'}
                </span>
                <span className="text-[10px] text-gray-400 block leading-tight">
                  {adminRoleConfig?.label || 'Quản trị viên'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1.5 hover:bg-semantic-error-soft hover:text-semantic-error rounded-lg text-gray-400 transition-colors ml-1"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung trang — Render children nếu được bọc trực tiếp, hoặc Outlet nếu là route layout */}
        <main className="flex-1 overflow-y-auto bg-snow-50 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
