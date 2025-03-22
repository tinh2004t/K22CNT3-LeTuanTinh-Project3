import { createContext, useState, useEffect } from "react";
import authService from "../api/authService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = authService.getCurrentUser();
    // Kiểm tra userData và userId hợp lệ
    if (userData && userData.userId && userData.userId !== 'undefined') {
      return userData;
    }
    return null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      const storedRole = localStorage.getItem("role");
      const storedUserId = localStorage.getItem("userId"); // ✅ Lấy userId trực tiếp
      
      
      if (storedUserId) { 
        setUser({ role: storedRole, userId: storedUserId }); // ✅ Đảm bảo userId không bị undefined
      }
    }
  }, [token]);

  const login = (token, userData) => {
    if (token && userData) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("userId", userData.userId); // ✅ Lưu userId đúng cách

      setUser({ role: userData.role, userId: userData.userId }); // ✅ Gán đúng userId
      setToken(token);
  
      console.log("DEBUG: userId =", userData.userId); // 🆕 Kiểm tra log
  
      window.location.reload();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId"); // ✅ Xóa userId khi logout
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
