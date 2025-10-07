import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header
        style={{
          position: "fixed", // ✅ Giữ cố định trên cùng
          top: 0,
          left: 0,
          right: 0,
          background: "#003366",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 25px",
          height: "65px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        {/* Góc trái: logo + tên công ty */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "4px",
              padding: "3px 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "45px",
            }}
          >
            <img
              src="/logo.png"
              alt="HAFC Logo"
              style={{
                height: "38px",
                width: "auto",
                display: "block",
              }}
            />
          </div>

          <h1
            style={{
              fontSize: "16px",
              fontWeight: "700",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              lineHeight: "1",
            }}
          >
            CÔNG TY CỔ PHẦN GIAO NHẬN VẬN TẢI HẢI AN
          </h1>
        </div>

        {/* Góc phải: email + đăng xuất */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "#00264d",
              border: "none",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#004080")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#00264d")
            }
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          marginTop: "65px", // ✅ Đẩy toàn bộ layout xuống dưới header
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "230px",
            background: "#003366",
            color: "#fff",
            padding: "25px 15px",
            display: "flex",
            flexDirection: "column",
            position: "fixed", // ✅ Sidebar cố định
            top: "65px", // ✅ Bắt đầu ngay dưới header
            bottom: 0,
            left: 0,
          }}
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: "14px" }}>
                <NavLink
                  to="/dashboard"
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: isActive ? "#0059b3" : "transparent",
                    color: "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                    transition: "0.2s ease",
                  })}
                >
                  Dashboard
                </NavLink>
              </li>

              <li style={{ marginBottom: "14px" }}>
                <NavLink
                  to="/manage-recruitment"
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: isActive ? "#0059b3" : "transparent",
                    color: "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                    transition: "0.2s ease",
                  })}
                >
                  Tuyển dụng
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/manage-users"
                  style={({ isActive }) => ({
                    display: "block",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    background: isActive ? "#0059b3" : "transparent",
                    color: "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                    transition: "0.2s ease",
                  })}
                >
                  Quản lý User
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main
          style={{
            flex: 1,
            padding: "50px 70px",
            background: "#f5f7fa",
            marginLeft: "230px", // ✅ Chừa chỗ cho sidebar cố định
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: "#003366",
          color: "white",
          textAlign: "center",
          padding: "15px 0",
          marginLeft: "230px", // ✅ Căn đều theo content
        }}
      >
        © 2025 HAFC Admin Panel
      </footer>
    </>
  );
}
