import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,  // Icon dashboard
  Users,            // Icon người dùng
  ScrollText,       // Icon nhật ký
  Shield,           // Icon logo admin
  LogOut,           // Icon đăng xuất
  ChevronLeft,      // Icon thu gọn sidebar
  Menu,             // Icon mở sidebar mobile
  X,                // Icon đóng sidebar mobile
  Bell,             // Icon thông báo
  QrCode,           // Icon mã QR voucher
} from 'lucide-react';

// Danh sách menu sidebar — mỗi item là 1 link
// path: URL tương ứng (react-router)
// icon: icon từ lucide-react
// label: tên hiển thị
const NAV_ITEMS = [
  { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Người dùng', icon: Users },
  { path: '/admin/logs', label: 'Nhật ký hệ thống', icon: ScrollText },
  { path: '/admin/voucher-lookup', label: 'Đối soát Voucher (QR)', icon: QrCode },
];

export default function AdminLayout() {
  // State thu gọn / mở rộng sidebar (desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // State hiển thị / ẩn sidebar (mobile — overlay)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Để highlight menu item đang active

  // Lấy thông tin user từ localStorage (lưu khi login)
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : { name: 'Admin', email: '' };

  // -----------------------------------------------------------------------
  // handleLogout — Xóa session và chuyển về trang login
  // KHÔNG gọi API logout (vì JWT stateless — token tự hết hạn sau 1 ngày)
  // Skills.md §8: "Frontend tự xóa token khi logout, không cần backend"
  // -----------------------------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Xóa JWT token
    localStorage.removeItem('user');         // Xóa thông tin user
    navigate('/login', { replace: true });   // Chuyển về login, replace = không back được
  };

  // Lấy tên trang hiện tại từ nav items (dùng cho breadcrumb topbar)
  const currentNav = NAV_ITEMS.find(
    item => item.path === location.pathname || location.pathname.startsWith(item.path + '/')
  );
  const currentPageLabel = currentNav?.label || 'Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
          flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60' : 'w-16'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo + nút thu gọn */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200 min-h-[64px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Logo shield */}
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            {/* Tên app — ẩn khi thu gọn sidebar */}
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">EC Voucher</div>
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
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            // Active: đường dẫn hiện tại match với item
            // Riêng /admin: chỉ active khi đúng /admin (không phải /admin/users)
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname === item.path || location.pathname.startsWith(item.path + '/');

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                title={!sidebarOpen ? item.label : undefined} // Tooltip khi thu gọn
                className={`
                  flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {/* Label chỉ hiện khi sidebar mở rộng */}
                {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Thông tin user + nút logout (cuối sidebar) */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            {/* Avatar chữ cái đầu */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-blue-700 font-semibold">
                {currentUser.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            {/* Tên + email (chỉ hiện khi sidebar mở) */}
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {currentUser.name || 'Admin'}
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
                className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-400 transition-colors"
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
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3 min-h-[64px]">
          {/* Nút mở sidebar (mobile) */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded hover:bg-gray-100 text-gray-500"
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb: Admin / Tên trang hiện tại */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{currentPageLabel}</span>
            </div>
          </div>

          {/* Phần bên phải: icon thông báo + thông tin user + logout */}
          <div className="flex items-center gap-2">
            {/* Icon chuông thông báo (placeholder) */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User info + logout (desktop) */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pl-2 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs text-blue-700 font-semibold">
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="font-medium">{currentUser.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-400 transition-colors ml-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung trang — Outlet render trang con tương ứng với route */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
