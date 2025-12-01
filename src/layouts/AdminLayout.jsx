import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/admin-style.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem("userEmail");

  // ✅ Nếu chưa đăng nhập → tự động chuyển về trang login
  React.useEffect(() => {
    if (!userEmail && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [userEmail, location, navigate]);

  // ✅ Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          <img src="/logo.png" alt="HAFC Logo" />
          <h1>CÔNG TY CỔ PHẦN GIAO NHẬN VẬN TẢI HẢI AN</h1>
        </div>
        <div className="admin-user">
          <span>{userEmail}</span>
          <button className="logout-btn" onClick={handleLogout}>
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
                <a
                  href="/dashboard"
                  className={location.pathname === "/dashboard" ? "active" : ""}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/manage-recruitment"
                  className={
                    location.pathname === "/manage-recruitment" ? "active" : ""
                  }
                >
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
