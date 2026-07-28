/**
 * Purpose: Định nghĩa route cho màn hình khách hàng.
 * Dùng cho các trang chỉ customer có thể truy cập.
 */
import CustomerLayout from "../../layouts/CustomerLayout";
import CustomerScreen from "../../pages/customer";

export const customerRoutes = [
  {
    path: "/customer",
    element: <CustomerLayout><CustomerScreen /></CustomerLayout>,
  },
];
