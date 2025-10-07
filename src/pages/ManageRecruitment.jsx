import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageRecruitment() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // ✅ Lấy danh sách bài tuyển dụng
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("recruitment_posts").select("*").order("id", { ascending: false });
      if (error) console.error("Lỗi tải bài tuyển dụng:", error);
      else setPosts(data);
    };
    fetchPosts();
  }, []);

  // ✅ Thêm bài tuyển dụng
  const handleAddPost = async () => {
    if (!title || !content) return alert("Vui lòng nhập tiêu đề và nội dung!");
    const { data, error } = await supabase.from("recruitment_posts").insert([{ title, content }]);
    if (error) {
      console.error("Lỗi thêm bài:", error);
      alert("Không thể thêm bài!");
    } else {
      alert("Đăng bài thành công!");
      setPosts([...data, ...posts]);
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="manage-recruitment">
      <h2>📝 Quản lý bài tuyển dụng</h2>

      <div className="recruit-form">
        <input type="text" placeholder="Tiêu đề bài viết" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Nội dung" value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
        <button onClick={handleAddPost}>+ Đăng bài</button>
      </div>

      <table className="recruit-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.content}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                Chưa có bài nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>{`
        .recruit-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        .recruit-form input, .recruit-form textarea {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
        }
        .recruit-form button {
          align-self: flex-start;
          background: #003366;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }
        .recruit-form button:hover { background: #0056b3; }
        .recruit-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .recruit-table th {
          background: #003366;
          color: #fff;
          text-align: left;
          padding: 10px 12px;
        }
        .recruit-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
    </div>
  );
}
