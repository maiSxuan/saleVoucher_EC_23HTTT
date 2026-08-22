/**
 * Purpose: Entry point của frontend React.
 * File này render ứng dụng vào DOM và khởi tạo router/context.
 */
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./app/auth-context";
import { Toaster } from "sonner";
import router from "./app/router";
import { i18nReady } from "./shared/i18n/i18n";
import "./index.css";

async function bootstrap() {
  await i18nReady;

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <AuthProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <Suspense
          fallback={(
            <div className="min-h-screen bg-snow-50 flex items-center justify-center text-sm font-medium text-snow-500">
              Đang tải trang...
            </div>
          )}
        >
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </React.StrictMode>,
  );
}

bootstrap();
