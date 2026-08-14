import React, { lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Forbidden from "../shared/components/Forbidden";
import RegisterPage from "../features/customer-commerce/pages/customer/RegisterPage";
import LogoutPage from "../features/core-access/pages/auth/LogoutPage";
import LandingPage from "../features/core-access/pages/public/LandingPage";

// Các màn hình ngoài luồng mở đầu được tách chunk để Landing/Login không phải tải
// trước thư viện QR, biểu đồ và trình soạn thảo của toàn bộ portal.
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboardPage = lazy(() => import("../features/core-access/pages/admin/AdminDashboardPage"));
const PartnerManagementPage = lazy(() => import("../features/partner-voucher/pages/admin/PartnerManagementPage"));
const PartnerDetailPage = lazy(() => import("../features/partner-voucher/pages/admin/PartnerDetailPage"));
const VoucherApprovalListPage = lazy(() => import("../features/partner-voucher/pages/admin/VoucherApprovalListPage"));
const VoucherApprovalDetailPage = lazy(() => import("../features/partner-voucher/pages/admin/VoucherApprovalDetailPage"));
const UserListPage = lazy(() => import("../features/core-access/pages/admin/UserListPage"));
const PartnerVoucherLookupPage = lazy(() => import("../features/core-access/pages/partner/PartnerVoucherLookupPage"));
const ContentListPage = lazy(() => import("../features/content-feedback/pages/admin/ContentListPage"));
const AdminReviewsPage = lazy(() => import("../features/content-feedback/pages/admin/AdminReviewsPage"));
const PartnerRegisterPage = lazy(() => import("../features/partner-voucher/pages/partner/PartnerRegisterPage"));
const PartnerProfilePage = lazy(() => import("../features/partner-voucher/pages/partner/PartnerProfilePage"));
const BranchManagementPage = lazy(() => import("../features/partner-voucher/pages/partner/BranchManagementPage"));
const VoucherListPage = lazy(() => import("../features/partner-voucher/pages/partner/VoucherListPage"));
const VoucherFormPage = lazy(() => import("../features/partner-voucher/pages/partner/VoucherFormPage"));
const PartnerVoucherDetailPage = lazy(() => import("../features/partner-voucher/pages/partner/VoucherDetailPage"));
const PartnerReportsPage = lazy(() => import("../features/partner-voucher/pages/partner/PartnerReportsPage"));
const StaffManagementPage = lazy(() => import("../features/partner-voucher/pages/partner/StaffManagementPage"));
const AuditLogPage = lazy(() => import("../features/partner-voucher/pages/admin/AuditLogPage"));
const CustomerLayout = lazy(() => import("../layouts/CustomerLayout"));
const VoucherSearchPage = lazy(() => import("../features/customer-commerce/pages/customer/VoucherSearchPage"));
const VoucherDetailPage = lazy(() => import("../features/customer-commerce/pages/customer/VoucherDetailPage"));
const CartPage = lazy(() => import("../features/customer-commerce/pages/customer/CartPage"));
const CheckoutPage = lazy(() => import("../features/customer-commerce/pages/customer/CheckoutPage"));
const PaymentResultPage = lazy(() => import("../features/customer-commerce/pages/customer/PaymentResultPage"));
const CustomerOrdersPage = lazy(() => import("../features/customer-commerce/pages/customer/CustomerOrdersPage"));
const AdminOrdersPage = lazy(() => import("../features/customer-commerce/pages/admin/AdminOrdersPage"));
const ProfilePage = lazy(() => import("../features/customer-commerce/pages/customer/ProfilePage"));
const MyVoucherPage = lazy(() => import("../features/core-access/pages/customer/MyVoucherPage"));
const IssuedVoucherDetailPage = lazy(() => import("../features/core-access/pages/customer/IssuedVoucherDetailPage"));
const ArticleDetailPage = lazy(() => import("../features/content-feedback/pages/customer/ArticleDetailPage"));
const PolicyPage = lazy(() => import("../features/core-access/pages/public/PolicyPage"));

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

function PartnerOwnerOnlyRoute() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = currentUser.vai_tro_he_thong || currentUser.role;
    if (
      role === "Nhan vien quan ly voucher" ||
      role === "PARTNER_MANAGER" ||
      role === "VOUCHER_MANAGER"
    ) {
      return <Navigate to="/partner/reports" replace />;
    }
    if (role === "Nhan vien ban hang") {
      return <Navigate to="/partner/vouchers/lookup" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

const routes = [
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
    path: "/policy",
    element: <PolicyPage />,
  },
  {
    path: "/privacy-policy",
    element: <PolicyPage />,
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
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "vouchers/:id",
        element: <VoucherDetailPage publicView />,
      },

      {
        path: "/customer",
        element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
        children: [
          {
            element: <CustomerLayout />,
            children: [
              {
                index: true,
                element: <VoucherSearchPage />,
              },
              // BR-CUS-07: Static routes trước dynamic routes
              {
                path: "vouchers/my",
                element: <MyVoucherPage />,
              },
              {
                path: "vouchers/issued/:issuedId",
                element: <IssuedVoucherDetailPage />,
              },
              {
                path: "vouchers/:id",
                element: <VoucherDetailPage />,
              },
              {
                path: "articles/:id",
                element: <ArticleDetailPage />,
              },
              {
                path: "cart",
                element: <CartPage />,
              },
              {
                path: "checkout",
                element: <CheckoutPage />,
              },
              {
                path: "checkout/return",
                element: <PaymentResultPage />,
              },
              {
                path: "orders",
                element: <CustomerOrdersPage />,
              },
              {
                path: "profile",
                element: <ProfilePage />,
              },
            ],
          },
        ],
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
          { path: "vouchers", element: <VoucherListPage /> },
          { path: "vouchers/new", element: <VoucherFormPage /> },
          { path: "vouchers/:id/edit", element: <VoucherFormPage /> },
          { path: "vouchers/:id", element: <PartnerVoucherDetailPage /> },
          {
            element: <PartnerOwnerOnlyRoute />,
            children: [
              { path: "profile", element: <PartnerProfilePage /> },
              { path: "branches", element: <BranchManagementPage /> },
              { path: "staffs", element: <StaffManagementPage /> },
            ],
          },
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
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "users", element: <UserListPage /> },
          { path: "logs", element: <AuditLogPage /> },
          {
            path: "audit-logs",
            element: <Navigate to="/admin/logs" replace />,
          },
          { path: "contents", element: <ContentListPage /> },
          { path: "complaints", element: <Navigate to="/admin/orders" replace /> },
          { path: "reviews", element: <AdminReviewsPage /> },
        ],
      },
    ],
  },

  // Fallback -> /login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

const router = createBrowserRouter([
  {
    element: <App />,
    children: routes,
  },
]);

export default router;
