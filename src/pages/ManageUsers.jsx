import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import "../assets/admin-style.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [loading, setLoading] = useState(false);

  // Lấy danh sách user
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setUsers(data);
  };

  // Thêm user mới
  const addUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("users").insert([
      {
        email: newEmail,
        name: newName,
        role: newRole,
      },
    ]);

    if (error) alert("❌ Lỗi khi thêm user: " + error.message);
    else {
      alert("✅ Thêm user thành công!");
      setNewEmail("");
      setNewName("");
      setNewRole("user");
      fetchUsers();
    }

    setLoading(false);
  };

  // Xóa user
  const deleteUser = async (id) => {
    if (!window.confirm("Xác nhận xóa user này?")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) alert("❌ Lỗi khi xóa user: " + error.message);
    else {
      alert("✅ Đã xóa user!");
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

return (
  <div className="admin-container">
    <h2 className="page-title">👥 Quản lý User</h2>

    <div className="user-form-card">
      <form className="user-form" onSubmit={addUser}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Tên hiển thị"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email user"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={loading} className="add-btn">
            {loading ? "Đang thêm..." : "➕ Thêm user"}
          </button>
        </div>
      </form>
    </div>

    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name || "-"}</td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`role-badge ${
                      u.role === "admin" ? "admin-role" : "user-role"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>{new Date(u.created_at).toLocaleString("vi-VN")}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u.id)}
                  >
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-data">
                Chưa có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default ManageUsers;
