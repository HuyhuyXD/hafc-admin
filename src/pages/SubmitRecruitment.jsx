import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";
import { createClient } from "@supabase/supabase-js";
import "../../assests/user-style.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SubmitRecruitment = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "User";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (image) {
      const { data, error } = await supabase.storage
        .from("recruitment-images")
        .upload(`pending/${Date.now()}_${image.name}`, image);

      if (error) console.error(error);
      else imageUrl = data?.path || null;
    }

    const { error } = await supabase.from("pending_recruitments").insert([
      {
        title,
        content,
        image_url: imageUrl,
        author: userEmail,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    setLoading(false);
    if (error) {
      alert("Gửi thất bại, vui lòng thử lại!");
    } else {
      alert("Bài tuyển dụng đã được gửi cho admin duyệt!");
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="submit-recruitment">
      <UserHeader userEmail={userEmail} onLogout={handleLogout} />
      <main className="user-main">
        <h2>Đăng bài tuyển dụng</h2>
        <form className="recruitment-form" onSubmit={handleSubmit}>
          <label>Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Nội dung</label>
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <label>Ảnh (tuỳ chọn)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi cho admin duyệt"}
          </button>
        </form>
      </main>
      <UserFooter />
    </div>
  );
};

export default SubmitRecruitment;
