import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageRecruitment from "./pages/ManageRecruitment";
import EditRecruitment from "./pages/EditRecruitment";
import ManageUsers from "./pages/ManageUsers";
import AdminLayout from "./layouts/AdminLayout";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-recruitment"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ManageRecruitment />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-recruitment/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <EditRecruitment />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-users"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
