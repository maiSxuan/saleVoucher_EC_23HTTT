/**
 * Route tương thích cho module partner-voucher của Ngân.
 * Router chạy thật được hợp nhất tập trung tại src/app/router.jsx.
 */
import React from "react";
import PartnerManagementPage from "../features/partner-voucher/pages/admin/PartnerManagementPage";
import PartnerDetailPage from "../features/partner-voucher/pages/admin/PartnerDetailPage";
import VoucherApprovalListPage from "../features/partner-voucher/pages/admin/VoucherApprovalListPage";
import VoucherApprovalDetailPage from "../features/partner-voucher/pages/admin/VoucherApprovalDetailPage";
import AuditLogPage from "../features/partner-voucher/pages/admin/AuditLogPage";

export const adminRoutes = [
  {
    path: "/admin/partners",
    element: <PartnerManagementPage />,
  },
  {
    path: "/admin/partners/:id",
    element: <PartnerDetailPage />,
  },
  {
    path: "/admin/vouchers",
    element: <VoucherApprovalListPage />,
  },
  {
    path: "/admin/vouchers/:id",
    element: <VoucherApprovalDetailPage />,
  },
  {
    path: "/admin/audit-logs",
    element: <AuditLogPage />,
  },
  {
    path: "/admin",
    element: <PartnerManagementPage />,
  },
];

export default adminRoutes;
