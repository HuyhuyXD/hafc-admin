import React from "react";
import "../assets/admin-style.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          <img src="/logo.png" alt="HAFC Logo" />
          <h1>CÔNG TY CỔ PHẦN GIAO NHẬN VẬN TẢI HẢI AN</h1>
        </div>
        <div className="admin-user">
          <span>{localStorage.getItem("userEmail")}</span>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("userEmail");
              window.location.href = "/login";
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Body layout */}
      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
              <li>
                <a href="/manage-recruitment">Tuyển dụng</a>
              </li>
              <li>
                <a href="/manage-users">Quản lý User</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
