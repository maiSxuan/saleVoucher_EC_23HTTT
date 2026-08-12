/**
 * Purpose: Entry point của frontend React.
 * File này render ứng dụng vào DOM và khởi tạo router/context.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/auth-context";
import { Toaster } from "sonner";
import router from "./app/router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="bottom-right" richColors closeButton />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
