import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") { // 🔥 Kiểm tra dữ liệu hợp lệ
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Lỗi parse JSON:", error);
          localStorage.removeItem("user"); // 🔥 Xóa dữ liệu lỗi để tránh lặp lại
        }
      }
    }
  }, [token]);

  const login = (token, userData) => {
    if (token && userData) { // 🔥 Chỉ lưu khi có dữ liệu hợp lệ
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
