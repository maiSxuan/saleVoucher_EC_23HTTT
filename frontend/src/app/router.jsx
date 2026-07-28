import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Forbidden from "../shared/components/Forbidden";

// Dummy screens for now to avoid Vite errors
const AdminScreen = () => <div>Admin Dashboard</div>;
const CustomerScreen = () => <div>Customer Dashboard</div>;
const PartnerScreen = () => <div>Partner Dashboard</div>;

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
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/customer" replace />,
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [{ index: true, element: <AdminScreen /> }],
      },
      {
        path: "customer",
        element: <ProtectedRoute allowedRoles={['CUSTOMER']} />,
        children: [{ index: true, element: <CustomerScreen /> }],
      },
      {
        path: "partner",
        element: <ProtectedRoute allowedRoles={['PARTNER_OWNER', 'PARTNER_STAFF']} />,
        children: [{ index: true, element: <PartnerScreen /> }],
      },
    ],
  },
]);

export default router;
