/**
 * FILE: router.jsx
 * PURPOSE: Khai báo toàn bộ routes của ứng dụng frontend.
 *
 * Cấu trúc routes:
 * - Public: /login, /forbidden, /customer/register
 * - Customer: /customer
 * - Partner: /partner, /partner/vouchers/lookup (BR-PAR-05, BR-PAR-06)
 * - Admin: /admin, /admin/users, /admin/logs, /admin/voucher-lookup
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Forbidden from "../shared/components/Forbidden";
import RegisterPage from "../features/customer-commerce/pages/customer/RegisterPage";

// Layout admin — sidebar + topbar, wrap tất cả trang admin
import AdminLayout from "../features/core-access/layouts/AdminLayout";

// Trang Admin & Partner
import UserListPage from "../features/core-access/pages/admin/UserListPage";
import PartnerVoucherLookupPage from "../features/core-access/pages/partner/PartnerVoucherLookupPage";

// Placeholder trang chưa làm
const AdminDashboardPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">
      Tổng quan hệ thống
    </h1>
    <p className="text-gray-500">Dashboard đang được phát triển...</p>
  </div>
);

const AuditLogPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nhật ký hệ thống</h1>
    <p className="text-gray-500">
      Trang nhật ký đang được phát triển (BR-ADM-07)...
    </p>
  </div>
);

// Placeholder cho customer
const CustomerScreen = () => (
  <div className="p-6 text-gray-700">Customer Dashboard — Đang phát triển</div>
);

const router = createBrowserRouter([
  // -----------------------------------------------------------------------
  // Route công khai — Không cần đăng nhập
  // -----------------------------------------------------------------------
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "/customer/register",
    element: <RegisterPage />,
  },
  // -----------------------------------------------------------------------
  // Route có layout App (Header chung) — dùng cho customer/partner
  // -----------------------------------------------------------------------
  {
    path: "/",
    element: <App />,
    children: [
      // Mặc định chuyển về /customer
      { index: true, element: <Navigate to="/customer" replace /> },

      // CUSTOMER ROUTES
      {
        path: "customer",
        element: <ProtectedRoute allowedRoles={["CUSTOMER"]} />,
        children: [{ index: true, element: <CustomerScreen /> }],
      },

      // PARTNER ROUTES (BR-PAR-05, BR-PAR-06: Tra cứu & Xác nhận sử dụng voucher)
      {
        path: "partner",
        element: (
          <ProtectedRoute allowedRoles={["PARTNER_OWNER", "PARTNER_STAFF"]} />
        ),
        children: [
          { index: true, element: <PartnerVoucherLookupPage /> },
          { path: "vouchers/lookup", element: <PartnerVoucherLookupPage /> },
        ],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // ADMIN ROUTES — Bảo vệ bởi ProtectedRoute(ADMIN) + AdminLayout
  // -----------------------------------------------------------------------
  {
    path: "/admin",
    element: (
      // Bước 1: Kiểm tra token + role ADMIN
      <ProtectedRoute allowedRoles={["ADMIN"]} />
    ),
    children: [
      {
        // Bước 2: Render AdminLayout (sidebar + topbar)
        element: <AdminLayout />,
        children: [
          // /admin → Dashboard
          { index: true, element: <AdminDashboardPage /> },
          // /admin/users → Quản lý người dùng (BR-ADM-01)
          { path: "users", element: <UserListPage /> },
          // /admin/logs → Nhật ký hệ thống (BR-ADM-07)
          { path: "logs", element: <AuditLogPage /> },
          // /admin/voucher-lookup → Tra cứu & đối soát voucher (BR-PAR-05, BR-PAR-06)
          { path: "voucher-lookup", element: <PartnerVoucherLookupPage /> },
        ],
      },
    ],
  },
]);

export default router;
