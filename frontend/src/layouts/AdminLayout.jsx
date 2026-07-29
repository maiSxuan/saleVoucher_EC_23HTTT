import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Quản lý đối tác", path: "/admin/partners", icon: "👥" },
    { label: "Duyệt Voucher", path: "/admin/vouchers", icon: "📋" },
    { label: "Nhật ký hệ thống", path: "/admin/audit-logs", icon: "📜" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <header className="h-16 bg-slate-900 text-white sticky top-0 z-30 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Đóng/Mở thanh điều hướng"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              AD
            </span>
            <div>
              <h1 className="font-bold text-white text-sm leading-tight">Admin Portal</h1>
              <p className="text-[11px] text-slate-400">Hệ Thống Quản Trị Hệ Thống Voucher</p>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-medium">Vai trò:</span>
            <span className="font-bold text-blue-400">Super Admin</span>
          </div>

          <div className="h-6 w-px bg-slate-700" />

          <button
            onClick={() => navigate("/logout")}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors shadow-xs"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${collapsed ? "w-16" : "w-64"
            } bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0`}
        >
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {!collapsed && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-xs text-slate-500">
              <div>Phiên bản: v1.0.4-Enterprise</div>
              <div className="text-[11px] text-slate-400 mt-1">RBAC Active: ADMIN_ALL_PERMISSIONS</div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
