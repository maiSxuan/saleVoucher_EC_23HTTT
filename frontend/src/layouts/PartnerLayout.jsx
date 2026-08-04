import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { mockStore } from "../shared/store/mockDataStore";
import Badge from "../shared/components/Badge";

export function PartnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Lấy thông tin user hiện tại từ localStorage
  const userStr = localStorage.getItem("user");
  let currentUser = null;
  try {
    currentUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    currentUser = null;
  }

  const userName =
    currentUser?.name ||
    currentUser?.ho_ten ||
    currentUser?.thong_tin_dang_nhap ||
    currentUser?.email ||
    "Đối tác";
  const userEmail = currentUser?.email || "";
  const userRole =
    currentUser?.vai_tro_he_thong ||
    (currentUser?.role === "PARTNER_STAFF"
      ? "Nhân viên bán hàng"
      : currentUser?.role === "PARTNER_OWNER"
        ? "Người đại diện"
        : "Đối tác");

  const activePartner = mockStore.getActivePartner();
  const allPartners = mockStore.getPartners();

  const handlePartnerSwitch = (e) => {
    const selectedId = e.target.value;
    mockStore.setActivePartnerId(selectedId);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Báo cáo", path: "/partner/reports", icon: "📊" },
    { label: "Tra cứu & Đổi Voucher", path: "/partner/vouchers/lookup", icon: "🔍" },
    { label: "Quản lý Voucher", path: "/partner/vouchers", icon: "🎟️" },
    { label: "Chi nhánh", path: "/partner/branches", icon: "📍" },
    { label: "Hồ sơ doanh nghiệp", path: "/partner/profile", icon: "🏢" },
    { label: "Nhân viên", path: "/partner/staffs", icon: "👥" },
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
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              PV
            </span>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">Partner Portal</h1>
              <p className="text-[11px] text-slate-500">Cổng Quản Lý Đối Tác</p>
            </div>
          </div>
        </div>

        {/* Top actions & User Info & Logout */}
        <div className="flex items-center gap-3">
          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>{userName}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 font-medium">
                  {userRole}
                </span>
              </div>
              {userEmail && (
                <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                  {userEmail}
                </div>
              )}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
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
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
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
          {/* {!collapsed && activePartner && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">Tài khoản doanh nghiệp:</div>
              <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{activePartner.ten_dn}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">MST: {activePartner.ma_so_thue}</div>
            </div>
          )} */}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

export default PartnerLayout;
