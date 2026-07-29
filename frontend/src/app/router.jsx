import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { publicRoutes } from "../routes/public.routes";
import { adminRoutes } from "../routes/admin.routes";
import { partnerRoutes } from "../routes/partner.routes";

const router = createBrowserRouter([
  ...publicRoutes,
  ...partnerRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
