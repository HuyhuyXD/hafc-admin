import React from "react";
import "../assets/admin-style.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-page-wrapper">
      {children}
    </div>
  );
}
