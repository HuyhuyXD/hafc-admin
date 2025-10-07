import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageRecruitment from "./pages/ManageRecruitment";
import EditRecruitment from "./pages/EditRecruitment";
import ManageUsers from "./pages/ManageUsers";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import UserDashboard from "./pages/UserDashboard";
import SubmitRecruitment from "./pages/SubmitRecruitment";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ✅ Nếu đang khởi tạo context => hiển thị "Đang tải..."
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "100px", fontSize: "18px" }}>
        Đang tải...
      </div>
    );
  }

  // ✅ Nếu có user => cho phép truy cập, ngược lại => về login
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Các route cần đăng nhập */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="manage-recruitment" element={<ManageRecruitment />} />
        <Route path="edit-recruitment/:id" element={<EditRecruitment />} />
        <Route path="manage-users" element={<ManageUsers />} />
      </Route>

      {/* Khu user riêng */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/user/submit" element={<SubmitRecruitment />} />

      {/* Mặc định không khớp => chuyển về login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
