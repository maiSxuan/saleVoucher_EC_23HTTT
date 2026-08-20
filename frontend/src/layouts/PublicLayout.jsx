import React from "react";

function PublicLayout({ children }) {
  return (
    <div className="theme-snow min-h-screen bg-snow-50 font-sans text-snow-800">
      {children}
    </div>
  );
}

export default PublicLayout;
