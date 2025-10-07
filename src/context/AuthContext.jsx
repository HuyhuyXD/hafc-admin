import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Thêm state loading để tránh lỗi reload trắng

  // Khi app load lần đầu
  useEffect(() => {
    const storedUser = localStorage.getItem("userEmail");
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false); // Đọc xong user => kết thúc loading
  }, []);

  // Hàm login
  const login = (email) => {
    localStorage.setItem("userEmail", email);
    setUser(email);
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
