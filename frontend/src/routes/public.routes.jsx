import React from "react";
import PublicLayout from "../layouts/PublicLayout";
import App from "../App";
import LoginPage from "../features/core-access/pages/auth/LoginPage";
import LogoutPage from "../features/core-access/pages/auth/LogoutPage";

export const publicRoutes = [
  {
    path: "/",
    element: <PublicLayout><App /></PublicLayout>,
  },
  {
    path: "/login",
    element: <PublicLayout><LoginPage /></PublicLayout>,
  },
  {
    path: "/logout",
    element: <PublicLayout><LogoutPage /></PublicLayout>,
  },
];

export default publicRoutes;
