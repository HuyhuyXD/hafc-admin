import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageRecruitment() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy danh sách bài chờ duyệt
  useEffect(() => {
    const fetchPendingPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pending_recruitments")
        .select("*")
        .eq("status", "pending")
        .order("id", { ascending: false });

      if (error) console.error("Lỗi tải bài pending:", error);
      else setPendingPosts(data);

      setLoading(false);
    };

    fetchPendingPosts();
  }, []);

  // ✅ Duyệt bài đăng
  const handleApprove = async (post) => {
    const confirmApprove = window.confirm(`Duyệt bài: "${post.title}" ?`);
    if (!confirmApprove) return;

    // 1️⃣ Thêm bài vào bảng recruitment_posts
    const { error: insertError } = await supabase.from("recruitment_posts").insert([
      {
        title: post.title,
        content: post.content,
        image_url: post.image_url,
        author_email: post.author_email,
      },
    ]);
    if (insertError) {
      console.error("Lỗi khi thêm bài:", insertError);
      alert("❌ Duyệt bài thất bại!");
      return;
    }

    // 2️⃣ Xoá bài khỏi bảng pending_recruitments
    const { error: deleteError } = await supabase
      .from("pending_recruitments")
      .delete()
      .eq("id", post.id);

    if (deleteError) {
      console.error("Lỗi khi xoá bài:", deleteError);
      alert("⚠️ Đã thêm bài mới nhưng chưa xoá được bản gốc.");
    } else {
      setPendingPosts(pendingPosts.filter((p) => p.id !== post.id));
      alert("✅ Đã duyệt bài thành công!");
    }
  };

  // ❌ Từ chối bài đăng
  const handleReject = async (post) => {
    const confirmReject = window.confirm(`Từ chối bài: "${post.title}" ?`);
    if (!confirmReject) return;

    const { error } = await supabase
      .from("pending_recruitments")
      .update({ status: "rejected" })
      .eq("id", post.id);

    if (error) {
      console.error("Lỗi từ chối bài:", error);
      alert("❌ Không thể từ chối bài!");
    } else {
      setPendingPosts(pendingPosts.filter((p) => p.id !== post.id));
      alert("🚫 Bài đã bị từ chối.");
    }
  };

  return (
    <div className="manage-recruitment">
      <h2>📰 Duyệt bài tuyển dụng</h2>

      {loading ? (
        <p>Đang tải danh sách bài chờ duyệt...</p>
      ) : pendingPosts.length === 0 ? (
        <p>Không có bài nào đang chờ duyệt ✅</p>
      ) : (
        <table className="recruit-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pendingPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author_email}</td>
                <td style={{ maxWidth: "400px" }}>{post.content}</td>
                <td>
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt="Ảnh tuyển dụng"
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <button className="approve-btn" onClick={() => handleApprove(post)}>
                    ✅ Duyệt
                  </button>
                  <button className="reject-btn" onClick={() => handleReject(post)}>
                    ❌ Từ chối
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <style>{`
        .recruit-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 15px;
        }

        .recruit-table th {
          background: #003366;
          color: #fff;
          text-align: left;
          padding: 10px 12px;
        }

        .recruit-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #eee;
          vertical-align: top;
        }

        .approve-btn, .reject-btn {
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 5px;
          color: #fff;
          font-weight: 500;
        }

        .approve-btn {
          background: #2e8b57;
          transition: 0.25s;
        }
        .approve-btn:hover { background: #1f6d44; }

        .reject-btn {
          background: #b22222;
          transition: 0.25s;
        }
        .reject-btn:hover { background: #8b0000; }
      `}</style>
    </div>
  );
}
