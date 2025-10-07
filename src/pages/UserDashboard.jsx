import React from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import "../../assets/user-style.css";


const UserDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "User";

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="user-dashboard">
      <UserHeader userEmail={userEmail} onLogout={handleLogout} />
      <main className="user-main">
        <h2>Chào mừng {userEmail}</h2>
        <p>Chọn hành động bên dưới để tiếp tục:</p>
        <div className="user-actions">
          <button
            className="user-btn"
            onClick={() => navigate("/submit-recruitment")}
          >
            Đăng bài tuyển dụng
          </button>
        </div>
      </main>
      <UserFooter />
    </div>
  );
};

export default UserDashboard;
