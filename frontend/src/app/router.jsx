import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Forbidden from "../shared/components/Forbidden";
import RegisterPage from "../features/customer-commerce/pages/customer/RegisterPage";
import LogoutPage from "../features/core-access/pages/auth/LogoutPage";

// Admin Portal Pages & Layout
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../features/core-access/pages/admin/AdminDashboardPage";
import PartnerManagementPage from "../features/partner-voucher/pages/admin/PartnerManagementPage";
import PartnerDetailPage from "../features/partner-voucher/pages/admin/PartnerDetailPage";
import VoucherApprovalListPage from "../features/partner-voucher/pages/admin/VoucherApprovalListPage";
import VoucherApprovalDetailPage from "../features/partner-voucher/pages/admin/VoucherApprovalDetailPage";
import UserListPage from "../features/core-access/pages/admin/UserListPage";
import PartnerVoucherLookupPage from "../features/core-access/pages/partner/PartnerVoucherLookupPage";

// Partner Portal Pages
import PartnerRegisterPage from "../features/partner-voucher/pages/partner/PartnerRegisterPage";
import PartnerProfilePage from "../features/partner-voucher/pages/partner/PartnerProfilePage";
import BranchManagementPage from "../features/partner-voucher/pages/partner/BranchManagementPage";
import VoucherListPage from "../features/partner-voucher/pages/partner/VoucherListPage";
import VoucherFormPage from "../features/partner-voucher/pages/partner/VoucherFormPage";
import VoucherDetailPage from "../features/partner-voucher/pages/partner/VoucherDetailPage";
import PartnerReportsPage from "../features/partner-voucher/pages/partner/PartnerReportsPage";
import StaffManagementPage from "../features/partner-voucher/pages/partner/StaffManagementPage";

// Audit log page
import AuditLogPage from "../features/partner-voucher/pages/admin/AuditLogPage";

// Placeholder customer screen
const CustomerScreen = () => (
  <div className="p-6 text-gray-700 font-semibold">Trang Khách Hàng (Customer Commerce) — Đang phát triển</div>
);

function PartnerHome() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.vai_tro_he_thong === "Nhan vien ban hang") {
      return <Navigate to="/partner/vouchers/lookup" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to="/partner/reports" replace />;
}

function PartnerManagementAccess() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.vai_tro_he_thong === "Nhan vien ban hang") {
      return <Navigate to="/partner/vouchers/lookup" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/customer/register",
    element: <RegisterPage />,
  },
  {
    path: "/partner/register",
    element: <PartnerRegisterPage />,
  },

  {
    path: "/",
    element: <App />,
    children: [
      // Mở ứng dụng tại trang đăng nhập
      { index: true, element: <Navigate to="/login" replace /> },

      // CUSTOMER ROUTES
      {
        path: "customer",
        element: <ProtectedRoute allowedRoles={["CUSTOMER", "Khach hang"]} />,
        children: [{ index: true, element: <CustomerScreen /> }],
      },
    ],
  },

  {
    path: "/partner",
    element: (
      <ProtectedRoute
        allowedRoles={[
          "PARTNER_OWNER",
          "PARTNER_STAFF",
          "Nguoi dai dien",
          "Nhan vien quan ly voucher",
        ]}
      />
    ),
    children: [
      { index: true, element: <PartnerHome /> },
      { path: "vouchers/lookup", element: <PartnerVoucherLookupPage /> },
      {
        element: <PartnerManagementAccess />,
        children: [
          { path: "reports", element: <PartnerReportsPage /> },
          { path: "profile", element: <PartnerProfilePage /> },
          { path: "branches", element: <BranchManagementPage /> },
          { path: "staffs", element: <StaffManagementPage /> },
          { path: "vouchers", element: <VoucherListPage /> },
          { path: "vouchers/new", element: <VoucherFormPage /> },
          { path: "vouchers/:id/edit", element: <VoucherFormPage /> },
          { path: "vouchers/:id", element: <VoucherDetailPage /> },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["ADMIN", "Admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/overview" replace /> },
          { path: "overview", element: <AdminDashboardPage /> },
          { path: "partners", element: <PartnerManagementPage /> },
          { path: "partners/:id", element: <PartnerDetailPage /> },
          { path: "vouchers", element: <VoucherApprovalListPage /> },
          { path: "vouchers/:id", element: <VoucherApprovalDetailPage /> },
          { path: "users", element: <UserListPage /> },
          { path: "logs", element: <AuditLogPage /> },
          { path: "audit-logs", element: <Navigate to="/admin/logs" replace /> },
        ],
      },
    ],
  },

  // Fallback -> /login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
