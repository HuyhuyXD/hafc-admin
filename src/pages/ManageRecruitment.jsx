import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../assets/admin-style.css";

export default function ManageRecruitment() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🟡 Load danh sách bài đăng
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("recruitment_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error(error);
    else setPosts(data);
  };

  // 🟢 Admin duyệt bài
  const handleApprove = async (id) => {
    setLoading(true);
    const { error } = await supabase
      .from("recruitment_posts")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) console.error(error);
    await fetchPosts();
    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h2 className="page-title">📰 Phê duyệt bài tuyển dụng</h2>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Ngày đăng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.anh ? (
                      <img
                        src={p.anh}
                        alt="post"
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{p.tieu_de}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status === "approved"
                          ? "status-approved"
                          : "status-pending"
                      }`}
                    >
                      {p.status === "approved"
                        ? "Đã duyệt"
                        : "Chờ phê duyệt"}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleString("vi-VN")}</td>
                  <td>
                    {p.status !== "approved" ? (
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                      >
                        ✅ Duyệt
                      </button>
                    ) : (
                      <button
                        className="update-btn"
                        onClick={() => handleApprove(p.id)}
                        disabled={loading}
                      >
                        🔄 Cập nhật duyệt lại
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  Chưa có bài tuyển dụng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
