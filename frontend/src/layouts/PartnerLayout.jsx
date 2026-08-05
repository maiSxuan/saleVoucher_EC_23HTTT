import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Lock } from "lucide-react";
import Badge from "../shared/components/Badge";
import { getPartnerByIdApi } from "../shared/api/partnerApi";

export function PartnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [partnerInfo, setPartnerInfo] = useState(null);
  const [loadingPartner, setLoadingPartner] = useState(true);

  // Lấy thông tin user hiện tại từ localStorage
  const userStr = localStorage.getItem("user") || localStorage.getItem("ec_auth_user");
  let currentUser = null;
  try {
    currentUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    currentUser = null;
  }

  const getLoggedInPartnerId = () => {
    return (
      currentUser?.ma_hsdn ||
      currentUser?.ma_hs ||
      currentUser?.id ||
      currentUser?.ma_nguoi_dung ||
      "20000000-0000-0000-0000-000000000001"
    );
  };

  useEffect(() => {
    async function fetchPartner() {
      const pId = getLoggedInPartnerId();
      if (pId) {
        const data = await getPartnerByIdApi(pId);
        setPartnerInfo(data);
      }
      setLoadingPartner(false);
    }
    fetchPartner();
  }, []);

  const partnerStatus = partnerInfo?.trang_thai || "Cho duyet";
  const normStatus = (partnerStatus || "").toString().toLowerCase().trim();
  const isPartnerActive =
    normStatus === "dang hoat dong" ||
    normStatus === "đang hoạt động" ||
    normStatus === "hoat dong" ||
    normStatus === "hoạt động" ||
    normStatus === "danghoatdong" ||
    normStatus === "hoatdong" ||
    normStatus === "active";
  const isProfilePage = location.pathname === "/partner/profile";

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
          {/* Status Badge of Business Profile */}
          {partnerInfo && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Trạng thái tài khoản:</span>
              <Badge status={partnerStatus} size="sm" />
            </div>
          )}

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
              const isLockedItem = item.path !== "/partner/profile" && !isPartnerActive;

              if (isLockedItem) {
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate("/partner/profile")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-colors text-slate-400 bg-slate-50 opacity-75 hover:bg-slate-100 cursor-not-allowed`}
                    title="Tài khoản chưa ở trạng thái Hoạt động. Vui lòng vào Hồ sơ doanh nghiệp để gửi duyệt."
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                );
              }

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
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {!loadingPartner && !isPartnerActive && !isProfilePage ? (
            <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-amber-200 p-8 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                🔒
              </div>
              <div className="flex justify-center">
                <Badge status={partnerStatus} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Tài khoản doanh nghiệp chưa được kích hoạt
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Tài khoản đối tác hiện đang ở trạng thái{" "}
                <strong className="text-amber-800">
                  "{partnerStatus === "Cho duyet" ? "Chờ duyệt" : partnerStatus === "Tu choi" ? "Bị từ chối" : partnerStatus}"
                </strong>
                . Tất cả các chức năng Quản lý Voucher, Chi nhánh, Nhân viên và Báo cáo tạm thời bị vô hiệu hóa.
              </p>
              {partnerStatus === "Tu choi" && partnerInfo?.ly_do_tu_choi && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-800 text-left max-w-md mx-auto">
                  <strong>Lý do Admin từ chối:</strong> {partnerInfo.ly_do_tu_choi}
                </div>
              )}
              <p className="text-xs text-slate-500">
                Chỉ khi hồ sơ được Quản trị viên thẩm định và duyệt chuyển sang trạng thái <strong>Hoạt động</strong>, bạn mới có đầy đủ quyền sử dụng các chức năng.
              </p>
              <div className="pt-2">
                <Link
                  to="/partner/profile"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
                >
                  🏢 Đến Hồ sơ doanh nghiệp & Gửi duyệt
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default PartnerLayout;
