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
          background: "#003366",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 30px",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "700", fontSize: "22px" }}>HAFC ADMIN</h2>
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
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "230px",
            background: "#003366",
            color: "#fff",
            padding: "25px 15px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "14px" }}>
                <NavLink
                  to="/dashboard"
                  style={({ isActive }) => ({
                    color: isActive ? "#00bfff" : "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                  })}
                >
                  Dashboard
                </NavLink>
              </li>
              <li style={{ marginBottom: "14px" }}>
                <NavLink
                  to="/manage-recruitment"
                  style={({ isActive }) => ({
                    color: isActive ? "#00bfff" : "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                  })}
                >
                  Tuyển dụng
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manage-users"
                  style={({ isActive }) => ({
                    color: isActive ? "#00bfff" : "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                    textDecoration: "none",
                  })}
                >
                  Quản lý User
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "50px 70px", background: "#f5f7fa" }}>
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
        }}
      >
        © 2025 HAFC Admin Panel
      </footer>
    </>
  );
}
