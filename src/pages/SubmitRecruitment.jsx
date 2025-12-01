import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageRecruitment() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy danh sách bài đăng
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("recruitment_posts")
        .select("*")
        .order("id", { ascending: false });

      if (error) console.error("Lỗi tải bài:", error);
      else setPosts(data || []);
      setLoading(false);
    };

    fetchPosts();

    // Optional: lắng nghe realtime (tự cập nhật khi thêm / xoá)
    const channel = supabase
      .channel("recruitment-posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recruitment_posts" },
        () => fetchPosts()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ✅ Xoá bài viết
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá bài này không?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("recruitment_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Lỗi xoá bài:", error);
      alert("❌ Xoá bài thất bại!");
    } else {
      setPosts(posts.filter((p) => p.id !== postId));
      alert("✅ Đã xoá bài thành công!");
    }
  };

  return (
    <div className="manage-recruitment">
      <h2>📰 Quản lý bài tuyển dụng</h2>

      {loading ? (
        <p>Đang tải danh sách bài...</p>
      ) : posts.length === 0 ? (
        <p>Chưa có bài tuyển dụng nào</p>
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
            {posts.map((post) => (
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                  >
                    🗑 Xoá
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

        .delete-btn {
          background: #c0392b;
          border: none;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.25s;
        }

        .delete-btn:hover { background: #e74c3c; }
      `}</style>
    </div>
  );
}
