import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/user-style.css";

const UserHeader = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="user-header">
      <div
        className="user-header-left"
        onClick={() => navigate("/user-dashboard")}
      >
        <img src="/logo.png" alt="HAFC Logo" className="user-logo" />
        <h1 className="user-title">HAFC - User Dashboard</h1>
      </div>
      <div className="user-header-right">
        <span className="user-email">{userEmail}</span>
        <button className="logout-btn" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default UserHeader;
