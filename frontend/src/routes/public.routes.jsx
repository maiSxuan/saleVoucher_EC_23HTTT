/**
 * Purpose: Định nghĩa route cho màn hình công khai.
 * Dùng cho các trang không cần xác thực: login, register, home.
 */
import PublicLayout from "../../layouts/PublicLayout";
import App from "../../App";

export const publicRoutes = [
  {
    path: "/",
    element: <PublicLayout><App /></PublicLayout>,
  },
];
