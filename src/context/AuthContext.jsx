import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user từ localStorage khi app khởi động
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUser({ email: savedEmail });
    }
    setLoading(false);
  }, []);

  // ✅ Hàm đăng nhập: gọi từ Login.jsx
  const login = (email) => {
    localStorage.setItem("userEmail", email);
    setUser({ email });
  };

  // ✅ Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("userEmail");
    setUser(null);
    window.location.href = "/login"; // reload về login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
