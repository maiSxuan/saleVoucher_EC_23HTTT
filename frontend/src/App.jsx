import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./shared/components/Header";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
