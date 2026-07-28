import { useState } from "react";
import {
  LayoutDashboard, Users, Building2, Tag, ShoppingCart,
  FileText, ScrollText, Bell, ChevronLeft, Menu, LogOut,
  Shield, X
} from "lucide-react";

export type Page = 'dashboard' | 'users' | 'partners' | 'vouchers' | 'orders' | 'content' | 'logs';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'users', label: 'Người dùng', icon: Users },
  { id: 'partners', label: 'Đối tác', icon: Building2, badge: 2 },
  { id: 'vouchers', label: 'Duyệt voucher', icon: Tag, badge: 2 },
  { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart, badge: 1 },
  { id: 'content', label: 'Nội dung', icon: FileText },
  { id: 'logs', label: 'Nhật ký hệ thống', icon: ScrollText },
];

interface AdminLayoutProps {
  currentPage: Page;
  onNavigate: (page: Page, filters?: Record<string, unknown>) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({ currentPage, onNavigate, onLogout, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentItem = navItems.find(i => i.id === currentPage);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60' : 'w-16'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center px-4 py-4 border-b border-gray-200 min-h-[64px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">EC Voucher</div>
                <div className="text-xs text-gray-500">Admin Portal</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1 rounded hover:bg-gray-100 text-gray-400 ml-auto flex-shrink-0"
          >
            <ChevronLeft size={16} className={`transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileSidebarOpen(false); }}
                title={!sidebarOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm
                  transition-colors relative
                  ${active
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!sidebarOpen && item.badge && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-amber-500 w-2 h-2 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-blue-700 font-semibold">AD</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Admin Hệ thống</div>
                <div className="text-xs text-gray-500 truncate">admin@ec-voucher.vn</div>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={onLogout} title="Đăng xuất" className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-400 transition-colors">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3 min-h-[64px]">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded hover:bg-gray-100 text-gray-500"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{currentItem?.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pl-2 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs text-blue-700 font-semibold">AD</span>
              </div>
              <span>Admin</span>
              <button onClick={onLogout} title="Đăng xuất" className="p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-400 transition-colors ml-1">
                <LogOut size={14} />
              </button>
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
