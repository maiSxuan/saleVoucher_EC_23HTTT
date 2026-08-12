import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
