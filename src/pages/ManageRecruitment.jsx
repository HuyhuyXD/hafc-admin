import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  // ✅ Lấy dữ liệu user từ Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error("Lỗi tải user:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="manage-users">
      <h2>👥 Quản lý User</h2>

      {/* Form thêm user ở đây */}
      <div className="user-form">
        {/* ... input form ... */}
      </div>

      {/* Bảng danh sách user */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Chưa có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
