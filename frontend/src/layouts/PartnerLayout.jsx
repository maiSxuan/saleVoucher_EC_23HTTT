import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Lock,
  ShieldAlert,
  ArrowRight,
  Building,
  BarChart3,
  QrCode,
  Ticket,
  Store,
  Building2,
  Users,
} from "lucide-react";
import Badge from "../shared/components/Badge";
import { getPartnerByIdApi } from "../shared/api/partnerApi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../shared/components/LanguageSwitcher";

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

  const partnerStatus =
    partnerInfo?.trang_thai ||
    currentUser?.trang_thai ||
    currentUser?.trang_thai_hs ||
    currentUser?.trang_thai_tai_khoan ||
    "Dang hoat dong";

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

  let userName =
    currentUser?.name ||
    currentUser?.ho_ten ||
    currentUser?.thong_tin_dang_nhap ||
    currentUser?.email ||
    "Đối tác";

  if (typeof userName === "object" && userName !== null) {
    userName = userName.name || userName.ho_ten || JSON.stringify(userName);
  }

  const userEmail = currentUser?.email || "";

  let userRole =
    currentUser?.vai_tro_he_thong ||
    (currentUser?.role === "PARTNER_STAFF"
      ? "Nhân viên bán hàng"
      : currentUser?.role === "PARTNER_MANAGER"
        ? "Nhân viên quản lý voucher"
        : currentUser?.role === "PARTNER_OWNER"
          ? "Người đại diện"
          : "Đối tác");

  if (typeof userRole === "object" && userRole !== null) {
    userRole = userRole.name || userRole.ten_vai_tro || JSON.stringify(userRole);
  }

  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    navigate("/login", { replace: true });
  };

  const allNavItems = [
    { label: t("Báo cáo"), path: "/partner/reports", icon: BarChart3 },
    { label: t("Tra cứu & Đổi Voucher"), path: "/partner/vouchers/lookup", icon: QrCode },
    { label: t("Quản lý Voucher"), path: "/partner/vouchers", icon: Ticket },
    { label: t("Chi nhánh"), path: "/partner/branches", icon: Store },
    { label: t("Hồ sơ doanh nghiệp"), path: "/partner/profile", icon: Building2 },
    { label: t("Nhân viên"), path: "/partner/staffs", icon: Users },
  ];

  const isVoucherManager =
    currentUser?.vai_tro_he_thong === "Nhan vien quan ly voucher" ||
    currentUser?.role === "PARTNER_MANAGER" ||
    currentUser?.role === "VOUCHER_MANAGER";

  const navItems = isVoucherManager
    ? allNavItems.filter((item) =>
        ["/partner/reports", "/partner/vouchers/lookup", "/partner/vouchers"].includes(item.path)
      )
    : allNavItems;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title={t("Đóng/Mở thanh điều hướng")}
          >
            ☰
          </button>
          <Link to="/" className="flex items-center gap-2 group" aria-label="Về trang chủ Snow Voucher">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-500 text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform">
              ❄️
            </span>
            <div>
              <h1 className="font-bold text-slate-900 text-sm leading-tight">Snow Voucher</h1>
              <p className="text-[11px] text-slate-500">{t("Cổng Quản Lý Đối Tác")}</p>
            </div>
          </Link>
        </div>

        {/* Top actions & User Info & Logout */}
        <div className="flex items-center gap-3">
          {/* Status Badge of Business Profile */}
          {partnerInfo && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">{t("Trạng thái tài khoản:")}</span>
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
                  {t(userRole)}
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

          <LanguageSwitcher className="[&_button]:!bg-slate-100 [&_button]:!text-slate-700 [&_button]:!border-slate-200 hover:[&_button]:!bg-slate-200" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-semibold rounded-xl transition-colors shadow-xs cursor-pointer"
            title={t("Đăng xuất khỏi hệ thống")}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t("Đăng xuất")}</span>
          </button>
        </div>
      </header>

      {/* Modern Sleek Status Warning Banner */}
      {!loadingPartner && !isPartnerActive && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs py-2.5 px-6 flex items-center justify-between gap-4 shadow-sm sticky top-16 z-20">
          <div className="flex items-center gap-2 font-medium truncate">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              {t("Tài khoản doanh nghiệp chưa ở trạng thái")} <strong>{t("Hoạt động")}</strong> ({t("Hiện tại:")} <strong>{partnerStatus === "Cho duyet" ? t("Chờ duyệt") : partnerStatus === "Tu choi" ? t("Bị từ chối") : t(partnerStatus)}</strong>). {t("Một số tính năng bị tạm khóa.")}
            </span>
          </div>
          <Link
            to="/partner/profile"
            className="shrink-0 bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg transition-colors text-[11px] border border-white/30"
          >
            {t("Hồ sơ doanh nghiệp & Gửi duyệt →")}
          </Link>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-16" : "w-64"
          } bg-white border-r border-slate-200 transition-all duration-200 flex flex-col shrink-0`}
        >
          <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isLockedItem = item.path !== "/partner/profile" && !isPartnerActive;
              const IconComponent = item.icon;

              if (isLockedItem) {
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate("/partner/profile")}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-slate-400 bg-slate-50/50 hover:bg-amber-50/60 hover:text-amber-700 cursor-pointer group`}
                    title={t("Tài khoản chưa kích hoạt. Vào Hồ sơ doanh nghiệp để xem thông tin & gửi duyệt.")}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-amber-600 transition-colors" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />}
                  </button>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-bold shadow-2xs border border-emerald-200/50"
                      : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {!loadingPartner && !isPartnerActive && !isProfilePage ? (
            <div className="max-w-xl mx-auto my-8 bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-amber-500/5 text-center space-y-5 transition-all">
              <div className="w-16 h-16 bg-gradient-to-tr from-amber-500/10 to-amber-500/20 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200/50 shadow-xs">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-semibold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{t("Trạng thái:")} {partnerStatus === "Cho duyet" ? t("Chờ duyệt") : partnerStatus === "Tu choi" ? t("Bị từ chối") : t(partnerStatus)}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t("Tài khoản doanh nghiệp chưa được kích hoạt")}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {t("Tất cả các chức năng Quản lý Voucher, Chi nhánh, Nhân viên và Báo cáo tạm thời bị vô hiệu hóa cho tới khi hồ sơ được phê duyệt.")}
                </p>
              </div>

              {partnerStatus === "Tu choi" && partnerInfo?.ly_do_tu_choi && (
                <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 text-left max-w-md mx-auto space-y-1">
                  <span className="font-bold block">{t("Lý do Admin từ chối:")}</span>
                  <p>{partnerInfo.ly_do_tu_choi}</p>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to="/partner/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg transform active:scale-95"
                >
                  <Building className="w-4 h-4" />
                  <span>{t("Hồ sơ doanh nghiệp & Gửi duyệt")}</span>
                  <ArrowRight className="w-4 h-4" />
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
