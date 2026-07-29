import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { adminRoutes } from "../routes/admin.routes";
import { partnerRoutes } from "../routes/partner.routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/partner/reports" replace />,
  },
  ...partnerRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Navigate to="/partner/reports" replace />,
  },
]);

export default router;
