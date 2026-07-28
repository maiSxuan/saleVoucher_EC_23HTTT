/**
 * Purpose: Cấu hình router cho frontend.
 * File này sẽ gom các route theo vai trò và điều hướng giữa các màn hình.
 */
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminScreen from "../pages/admin";
import CustomerScreen from "../pages/customer";
import SellerScreen from "../pages/seller";
import StaffScreen from "../pages/staff";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminScreen />,
  },
  {
    path: "/customer",
    element: <CustomerScreen />,
  },
  {
    path: "/seller",
    element: <SellerScreen />,
  },
  {
    path: "/staff",
    element: <StaffScreen />,
  },
]);

export default router;
