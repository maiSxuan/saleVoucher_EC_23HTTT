import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("ec_auth_token");
    localStorage.removeItem("ec_auth_user");
    navigate("/login", { replace: true });
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case "Admin he thong":
        return (
          <span className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Quản trị hệ thống
          </span>
        );
      case "Admin kiem duyet":
        return (
          <span className="bg-fuchsia-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Quản trị kiểm duyệt
          </span>
        );
      case "Admin van hanh":
        return (
          <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Quản trị vận hành
          </span>
        );
      case "PARTNER_OWNER":
        return (
          <span className="bg-sky-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Partner Owner
          </span>
        );
      case "PARTNER_MANAGER":
        return (
          <span className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Partner Manager
          </span>
        );
      case "PARTNER_STAFF":
        return (
          <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Partner Staff
          </span>
        );
      case "CUSTOMER":
        return (
          <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Khách hàng
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1
          className="flex items-center gap-2 text-xl font-bold text-gray-900 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/snowflake.png"
            alt=""
            aria-hidden="true"
            className="w-8 h-8 object-contain drop-shadow-sm"
          />
          <span>Snow Voucher</span>
        </h1>
        {getRoleBadge()}
      </div>

      {user && (
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="hidden sm:block">
            Xin chào, <strong>{user.name || user.email}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="text-red-600 font-medium hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            {t("nav.logout", "Đăng xuất")}
          </button>
        </div>
      )}
    </header>
  );
}
