import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    userCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Lấy dữ liệu thống kê từ Supabase
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const [{ count: pendingCount }, { count: approvedCount }, { count: userCount }] =
        await Promise.all([
          supabase
            .from("pending_recruitments")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("recruitment_posts")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("users")
            .select("*", { count: "exact", head: true }),
        ]);

      setStats({
        pendingCount: pendingCount || 0,
        approvedCount: approvedCount || 0,
        userCount: userCount || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Chào mừng đến với Admin Dashboard</h2>

      {/* Thống kê tổng quan */}
      <div className="stat-grid">
        <div className="stat-box pending">
          <h4>Bài chờ duyệt</h4>
          <p className="stat-count">{loading ? "..." : stats.pendingCount}</p>
        </div>
        <div className="stat-box approved">
          <h4>Bài đã duyệt</h4>
          <p className="stat-count">{loading ? "..." : stats.approvedCount}</p>
        </div>
        <div className="stat-box users">
          <h4>Người dùng nội bộ</h4>
          <p className="stat-count">{loading ? "..." : stats.userCount}</p>
        </div>
      </div>

      {/* Hai card điều hướng */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "35px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Card Tuyển dụng */}
        <div className="card" style={{ flex: 1, minWidth: "250px" }}>
          <h3>Tuyển dụng</h3>
          <p>Quản lý bài đăng tuyển dụng (duyệt & từ chối).</p>
          <button
            className="btn-main"
            onClick={() => navigate("/manage-recruitment")}
          >
            Quản lý bài đăng
          </button>
        </div>

        {/* Card Quản lý user */}
        <div className="card" style={{ flex: 1, minWidth: "250px" }}>
          <h3>Quản lý người dùng</h3>
          <p>Thêm, sửa, xoá tài khoản nhân viên nội bộ.</p>
          <button
            className="btn-main"
            onClick={() => navigate("/manage-users")}
          >
            Quản lý User
          </button>
        </div>
      </div>

      <p style={{ marginTop: "40px", textAlign: "center" }}>
        Đang đăng nhập: <b>{user?.email}</b>
      </p>

      {/* Inline style */}
      <style>{`
        .dashboard-container {
          text-align: center;
          padding: 20px;
        }

        .stat-grid {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 25px;
          flex-wrap: wrap;
        }

        .stat-box {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 15px 25px;
          min-width: 180px;
          text-align: center;
          transition: 0.3s;
        }

        .stat-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-box h4 {
          margin-bottom: 8px;
          font-size: 16px;
        }

        .stat-count {
          font-size: 36px;
          font-weight: bold;
        }

        .pending { border-left: 6px solid #ff9800; }
        .approved { border-left: 6px solid #4caf50; }
        .users { border-left: 6px solid #2196f3; }

        .btn-main {
          background: #003366;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-main:hover {
          background: #0056b3;
        }

        .card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}
