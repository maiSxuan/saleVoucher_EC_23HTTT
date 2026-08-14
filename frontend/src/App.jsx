import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteFooter from "./shared/components/SiteFooter";

function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      {!isAdminRoute ? <SiteFooter /> : null}
    </div>
  );
}

export default App;
