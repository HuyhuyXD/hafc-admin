import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../assets/admin-style.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userEmail = data.user?.email;

      const { data: adminData } = await supabase
        .from("admins")
        .select("role")
        .eq("email", userEmail)
        .single();

      if (adminData?.role?.toLowerCase() === "admin") {
        login(userEmail); // ✅ cập nhật context và localStorage
        navigate("/dashboard"); // ✅ điều hướng sau khi login
      } else {
        setErrorMsg("Tài khoản này không có quyền admin!");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img
          src="/logo.png"
          alt="HAFC Logo"
          style={{
            width: "120px",
            display: "block",
            margin: "0 auto",
            background: "white",
          }}
        />

        <h2 className="login-title">Đăng nhập Admin</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Email đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="error-text">{errorMsg}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
