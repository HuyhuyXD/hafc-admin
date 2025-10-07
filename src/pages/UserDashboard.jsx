import React from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import "../assets/user-style.css"; // ✅ Đúng đường dẫn (không dư ../)

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
          {/* ví dụ 2 nút chức năng */}
          <button onClick={() => navigate("/user/submit")}>Gửi bài tuyển dụng</button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      </main>
      <UserFooter />
    </div>
  );
};

export default UserDashboard;
