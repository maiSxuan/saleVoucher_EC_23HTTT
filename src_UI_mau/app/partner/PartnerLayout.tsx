import { useState } from "react";
import {
  LayoutDashboard, Tag, Search, BarChart2, Building2, Users2, User,
  Menu, X, ChevronRight, Bell, LogOut, Store, ChevronDown
} from "lucide-react";

export type PartnerPage =
  | 'dashboard'
  | 'vouchers'
  | 'voucher-create'
  | 'code-lookup'
  | 'reports'
  | 'profile'
  | 'branches'
  | 'staff'
  | 'account';

export type PartnerMode = 'owner' | 'staff';

interface NavItem {
  id: PartnerPage;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  ownerOnly?: boolean;
}

interface PartnerLayoutProps {
  currentPage: PartnerPage;
  onNavigate: (page: PartnerPage) => void;
  mode: PartnerMode;
  onModeChange: (mode: PartnerMode) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const ownerNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: <LayoutDashboard size={18} /> },
  { id: 'vouchers', label: 'Voucher', icon: <Tag size={18} />, badge: 2 },
  { id: 'code-lookup', label: 'Tra cứu mã', icon: <Search size={18} /> },
  { id: 'reports', label: 'Báo cáo', icon: <BarChart2 size={18} /> },
  { id: 'profile', label: 'Hồ sơ doanh nghiệp', icon: <Building2 size={18} /> },
  { id: 'branches', label: 'Chi nhánh', icon: <Store size={18} />, badge: 1 },
  { id: 'staff', label: 'Nhân viên', icon: <Users2 size={18} /> },
];

const staffNavItems: NavItem[] = [
  { id: 'code-lookup', label: 'Tra cứu mã', icon: <Search size={18} /> },
  { id: 'account', label: 'Tài khoản', icon: <User size={18} /> },
];

const pageTitles: Record<PartnerPage, string> = {
  dashboard: 'Tổng quan',
  vouchers: 'Quản lý Voucher',
  'voucher-create': 'Tạo Voucher Mới',
  'code-lookup': 'Tra cứu Voucher Code',
  reports: 'Báo cáo',
  profile: 'Hồ sơ Doanh nghiệp',
  branches: 'Chi nhánh',
  staff: 'Nhân viên',
  account: 'Tài khoản',
};

export default function PartnerLayout({ currentPage, onNavigate, mode, onModeChange, onLogout, children }: PartnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navItems = mode === 'owner' ? ownerNavItems : staffNavItems;
  const currentBusiness = 'Sushi World Vietnam';
  const currentUser = mode === 'owner' ? 'Trần Minh Tú (Owner)' : 'Nguyễn Thị Mai (Nhân viên)';
  const currentBranch = mode === 'staff' ? 'Chi nhánh Lý Tự Trọng' : undefined;

  const notifications = [
    { id: 1, text: 'Voucher "Set Sashimi Premium" đã được Admin phê duyệt', time: '2 giờ trước', unread: true },
    { id: 2, text: 'Yêu cầu cập nhật chi nhánh Quận 3 đang chờ duyệt', time: '1 ngày trước', unread: false },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate max-w-[140px]">{currentBusiness}</p>
            <p className="text-xs text-emerald-600 font-medium">Partner Portal</p>
          </div>
        </div>
      </div>

      {/* Role switcher (demo) */}
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs text-gray-400 mb-1 px-1">Demo: Chuyển vai trò</p>
        <div className="flex gap-1">
          <button
            onClick={() => onModeChange('owner')}
            className={`flex-1 text-xs py-1 rounded font-medium transition-colors ${mode === 'owner' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >Owner</button>
          <button
            onClick={() => onModeChange('staff')}
            className={`flex-1 text-xs py-1 rounded font-medium transition-colors ${mode === 'staff' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >Nhân viên</button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <div className="flex items-center gap-3">
              <span className={currentPage === item.id ? 'text-emerald-600' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </div>
            {item.badge && (
              <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <User size={13} className="text-emerald-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{currentUser}</p>
            {currentBranch && <p className="text-xs text-gray-400 truncate">{currentBranch}</p>}
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-red-600 hover:bg-red-50">
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-56 bg-white shadow-2xl flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded hover:bg-gray-100">
              <Menu size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-900">{pageTitles[currentPage]}</h1>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="text-emerald-600 font-medium">{currentBusiness}</span>
                <ChevronRight size={12} />
                <span>{pageTitles[currentPage]}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentBranch && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded text-xs text-emerald-700 font-medium">
                <Store size={12} />
                {currentBranch}
                <ChevronDown size={12} />
              </div>
            )}

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100"
              >
                <Bell size={18} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">Thông báo</p>
                    <button onClick={() => setNotifOpen(false)}><X size={14} className="text-gray-400" /></button>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 ${n.unread ? 'bg-emerald-50/50' : ''}`}>
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={15} className="text-emerald-700" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
