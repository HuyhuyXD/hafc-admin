import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Chào mừng đến với Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "30px", marginTop: "35px", justifyContent: "center" }}>
        {/* Card Tuyển dụng */}
        <div className="card" style={{ flex: 1 }}>
          <h3>Tuyển dụng</h3>
          <p>Quản lý bài đăng tuyển dụng.</p>
          <button
            className="btn-main"
            onClick={() => navigate("/manage-recruitment")}
          >
            Quản lý bài đăng
          </button>
        </div>

        {/* Card Quản lý user */}
        <div className="card" style={{ flex: 1 }}>
          <h3>Quản lý người dùng</h3>
          <p>Phân quyền & thông tin admin.</p>
          <button
            className="btn-main"
            onClick={() => navigate("/manage-users")}
          >
            Quản lý User
          </button>
        </div>
      </div>

      <p style={{ marginTop: "40px" }}>
        Đang đăng nhập: <b>{user?.email}</b>
      </p>
    </div>
  );
}
