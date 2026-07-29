import React from "react";
import PartnerRegisterPage from "../features/partner-voucher/pages/partner/PartnerRegisterPage";
import PartnerProfilePage from "../features/partner-voucher/pages/partner/PartnerProfilePage";
import BranchManagementPage from "../features/partner-voucher/pages/partner/BranchManagementPage";
import VoucherListPage from "../features/partner-voucher/pages/partner/VoucherListPage";
import VoucherFormPage from "../features/partner-voucher/pages/partner/VoucherFormPage";
import VoucherDetailPage from "../features/partner-voucher/pages/partner/VoucherDetailPage";
import PartnerReportsPage from "../features/partner-voucher/pages/partner/PartnerReportsPage";
import StaffManagementPage from "../features/partner-voucher/pages/partner/StaffManagementPage";

export const partnerRoutes = [
  {
    path: "/partner/register",
    element: <PartnerRegisterPage />,
  },
  {
    path: "/partner/profile",
    element: <PartnerProfilePage />,
  },
  {
    path: "/partner/branches",
    element: <BranchManagementPage />,
  },
  {
    path: "partner/staffs",
    element: <StaffManagementPage />,
  },
  {
    path: "/partner/vouchers",
    element: <VoucherListPage />,
  },
  {
    path: "/partner/vouchers/new",
    element: <VoucherFormPage />,
  },
  {
    path: "/partner/vouchers/:id/edit",
    element: <VoucherFormPage />,
  },
  {
    path: "/partner/vouchers/:id",
    element: <VoucherDetailPage />,
  },
  {
    path: "/partner/reports",
    element: <PartnerReportsPage />,
  },
  {
    path: "/partner",
    element: <PartnerReportsPage />,
  },

];

export default partnerRoutes;
