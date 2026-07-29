import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mockStore } from "../shared/store/mockDataStore";
import Badge from "../shared/components/Badge";

export function PartnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const activePartner = mockStore.getActivePartner();
  const allPartners = mockStore.getPartners();

  const handlePartnerSwitch = (e) => {
    const selectedId = e.target.value;
    mockStore.setActivePartnerId(selectedId);
    window.location.reload();
  };

  const navItems = [
    { label: "Báo cáo & Thống kê", path: "/partner/reports", icon: "📊" },
    { label: "Hồ sơ đối tác", path: "/partner/profile", icon: "🏢" },
    { label: "Quản lý chi nhánh", path: "/partner/branches", icon: "📍" },
    { label: "Danh sách Voucher", path: "/partner/vouchers", icon: "🎟️" },
    { label: "Tạo Voucher mới", path: "/partner/vouchers/new", icon: "➕" },
    { label: "Đăng ký doanh nghiệp mới", path: "/partner/register", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Đóng/Mở thanh điều hướng"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              PV
            </span>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">Partner Portal</h1>
              <p className="text-[11px] text-slate-500">Cổng Quản Lý Đối Tác</p>
            </div>
          </div>
        </div>

        {/* Top actions & Active partner switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Đối tác hiện tại:</span>
            <select
              value={activePartner ? activePartner.ma_hs : ""}
              onChange={handlePartnerSwitch}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {allPartners.map((p) => (
                <option key={p.ma_hs} value={p.ma_hs}>
                  {p.ten_dn} ({p.trang_thai})
                </option>
              ))}
            </select>
            {activePartner && <Badge status={activePartner.trang_thai} size="sm" />}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={() => navigate("/admin/partners")}
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            🔄 Chuyển sang Admin Portal
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-16" : "w-64"
          } bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0`}
        >
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Active Partner Mini Card in Sidebar */}
          {!collapsed && activePartner && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">Tài khoản doanh nghiệp:</div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{activePartner.ten_dn}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">MST: {activePartner.ma_so_thue}</div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

export default PartnerLayout;
