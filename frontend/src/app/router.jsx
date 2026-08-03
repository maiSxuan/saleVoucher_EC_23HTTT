/**
 * FILE: router.jsx
 * PURPOSE: Khai báo toàn bộ routes của ứng dụng frontend.
 *
 * Tại sao cần file này?
 * - Một điểm duy nhất quản lý tất cả URL → component mapping.
 * - Route admin được bảo vệ kép: ProtectedRoute (kiểm tra token + role) + AdminLayout (sidebar/topbar).
 *
 * Luồng bảo vệ route admin:
 *   Truy cập /admin/* → ProtectedRoute kiểm tra localStorage → nếu không phải ADMIN → /forbidden
 *   Nếu hợp lệ → AdminLayout (render sidebar + topbar) → Outlet render trang cụ thể
 *
 * Cấu trúc route admin (BR-ADM-01):
 *   /admin           → AdminDashboardPage (tổng quan)
 *   /admin/users     → UserListPage (danh sách người dùng)
 *   /admin/logs      → AuditLogPage (nhật ký hệ thống)
 */
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Forbidden from "../shared/components/Forbidden";
import RegisterPage from "../features/customer-commerce/pages/customer/RegisterPage";

// Layout admin — sidebar + topbar, wrap tất cả trang admin
import AdminLayout from "../features/core-access/layouts/AdminLayout";

// Trang admin
import UserListPage from "../features/core-access/pages/admin/UserListPage";

// Customer
import CustomerLayout from "../features/customer-commerce/layouts/CustomerLayout";
import VoucherSearchPage from "../features/customer-commerce/pages/customer/VoucherSearchPage";
import VoucherDetailPage from "../features/customer-commerce/pages/customer/VoucherDetailPage";
import CartPage from "../features/customer-commerce/pages/customer/CartPage";

import { Home } from "lucide-react";

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
const PartnerScreen = () => (
  <div className="p-6 text-gray-700">Partner Dashboard — Đang phát triển</div>
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
        children: [
          {
            element: <CustomerLayout />,
            children: [
              {
                index: true,
                element: <VoucherSearchPage />,
              },
              {
                path: "vouchers/:id",
                element: <VoucherDetailPage />,
              },
              {
                path: "cart",
                element: <CartPage />,
              },
            ],
          },
        ],
      },

      // PARTNER ROUTES (cả 2 role đối tác)
      {
        path: "partner",
        element: (
          <ProtectedRoute allowedRoles={["PARTNER_OWNER", "PARTNER_STAFF"]} />
        ),
        children: [{ index: true, element: <PartnerScreen /> }],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // ADMIN ROUTES — Bảo vệ bởi ProtectedRoute(ADMIN) + AdminLayout
  //
  // Tại sao đặt admin ra ngoài "/" ?
  // - Admin dùng layout riêng (AdminLayout có sidebar) thay vì App (Header chung).
  // - Tách rõ UX cho admin vs user thông thường.
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
          // /admin/users → Quản lý người dùng (BR-ADM-01) — dùng data thật Supabase
          { path: "users", element: <UserListPage /> },
          // /admin/logs → Nhật ký hệ thống (BR-ADM-07) — placeholder
          { path: "logs", element: <AuditLogPage /> },
        ],
      },
    ],
  },
]);

export default router;
