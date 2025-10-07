import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  // ✅ Hàm load toàn bộ user
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*").order("id", { ascending: true });
    if (error) console.error("Lỗi tải user:", error);
    else setUsers(data || []);
  };

  // ✅ Lấy danh sách user lần đầu & lắng nghe realtime thay đổi
  useEffect(() => {
    fetchUsers();

    // Đăng ký realtime channel
    const channel = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log("Realtime update:", payload);
          fetchUsers(); // reload lại danh sách user mỗi khi có thay đổi
        }
      )
      .subscribe();

    // Cleanup khi rời trang để tránh leak
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Thêm user mới
  const handleAddUser = async () => {
    if (!name || !email) return alert("Vui lòng nhập đầy đủ thông tin!");
    const { error } = await supabase.from("users").insert([{ name, email, role }]);
    if (error) {
      console.error("Lỗi thêm user:", error);
      alert("❌ Thêm user thất bại!");
    } else {
      alert("✅ Thêm user thành công!");
      setName("");
      setEmail("");
      setRole("user");
    }
  };

  return (
    <div className="manage-users">
      <h2>👥 Quản lý User</h2>

      {/* Form thêm user */}
      <div className="user-form">
        <input
          type="text"
          placeholder="Tên hiển thị"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleAddUser}>+ Thêm user</button>
      </div>

      {/* Bảng danh sách user */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Chưa có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* CSS nội bộ */}
      <style>{`
        .user-form {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .user-form input, .user-form select {
          padding: 8px 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
        }
        .user-form button {
          background: #003366;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.3s;
        }
        .user-form button:hover { background: #0056b3; }
        .user-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .user-table th {
          background: #003366;
          color: #fff;
          text-align: left;
          padding: 10px 12px;
        }
        .user-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e5e5;
        }
      `}</style>
    </div>
  );
}
