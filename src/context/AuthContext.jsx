import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// ✅ Khởi tạo Supabase client có lưu session
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 Thêm state loading

  useEffect(() => {
    const initAuth = async () => {
      // Kiểm tra session có sẵn trong localStorage
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
      setLoading(false); // ✅ Chỉ render app sau khi check xong
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // 🔥 Trong lúc đang kiểm tra session thì hiển thị tạm màn chờ
  if (loading) return <div style={{ textAlign: "center", marginTop: "20vh" }}>Đang tải...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
