import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageRecruitment from "./pages/ManageRecruitment";
import EditRecruitment from "./pages/EditRecruitment";
import ManageUsers from "./pages/ManageUsers"; // ✅ thêm import
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import UserDashboard from "./user/pages/UserDashboard";
import SubmitRecruitment from "./user/pages/SubmitRecruitment";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Các route yêu cầu đăng nhập */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Quản lý bài tuyển dụng */}
        <Route path="manage-recruitment" element={<ManageRecruitment />} />

        {/* Chỉnh sửa bài */}
        <Route path="edit/:id" element={<EditRecruitment />} />

        {/* ✅ Quản lý người dùng */}
        <Route path="manage-users" element={<ManageUsers />} />
      </Route>

      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/submit-recruitment" element={<SubmitRecruitment />} />

      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
