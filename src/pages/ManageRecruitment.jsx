import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageRecruitment() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

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

    // ✅ Lắng nghe realtime
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

  // ✅ Đăng bài mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }

    let image_url = null;

    if (image) {
      // 🔹 Lấy phần mở rộng file (jpg, png...)
      const fileExt = image.name.split(".").pop();
      const fileName = `recruit-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log("🔹 Đang upload ảnh vào bucket: recruitment-images");

      // 🔹 Upload ảnh lên đúng bucket (recruitment-images)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("recruitment-images")
        .upload(filePath, image, { upsert: true });

      if (uploadError) {
        console.error("❌ Lỗi upload ảnh:", uploadError);
        alert(`Không thể tải ảnh lên!\n\nChi tiết: ${uploadError.message}`);
        return;
      }

      console.log("✅ Upload thành công:", uploadData);

      // 🔹 Lấy đường dẫn công khai
      const {
        data: { publicUrl },
      } = supabase.storage.from("recruitment-images").getPublicUrl(filePath);

      image_url = publicUrl;
    }

    // ✅ Thêm bài mới vào bảng recruitment_posts
    const { error } = await supabase.from("recruitment_posts").insert([
      {
        title,
        content,
        image_url,
      },
    ]);

    if (error) {
      console.error("❌ Lỗi đăng bài:", error);
      alert("Đăng bài thất bại!");
    } else {
      alert("✅ Bài đăng thành công!");
      setTitle("");
      setContent("");
      setImage(null);
    }
  };

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
      <h2>📰 Đăng & quản lý bài tuyển dụng</h2>

      {/* 🧾 Form đăng bài */}
      <form className="recruit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Nội dung bài tuyển dụng"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" className="add-btn">
          📤 Đăng bài
        </button>
      </form>

      {/* 📋 Danh sách bài */}
      {loading ? (
        <p>Đang tải danh sách bài...</p>
      ) : posts.length === 0 ? (
        <p>Chưa có bài tuyển dụng nào</p>
      ) : (
        <table className="recruit-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nội dung</th>
              <th>Ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
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
        .recruit-form {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .recruit-form input, .recruit-form textarea {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 15px;
          resize: vertical;
        }
        .add-btn {
          background: #003366;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 14px;
          cursor: pointer;
          transition: 0.3s;
        }
        .add-btn:hover { background: #0055aa; }

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
