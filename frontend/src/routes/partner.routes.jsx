/**
 * Purpose: Định nghĩa route cho màn hình đối tác/người bán.
 * Dùng cho các trang chỉ seller/partner có thể truy cập.
 */
import PartnerLayout from "../../layouts/PartnerLayout";
import SellerScreen from "../../pages/seller";

export const partnerRoutes = [
  {
    path: "/partner",
    element: <PartnerLayout><SellerScreen /></PartnerLayout>,
  },
  {
    path: "/seller",
    element: <PartnerLayout><SellerScreen /></PartnerLayout>,
  },
];
