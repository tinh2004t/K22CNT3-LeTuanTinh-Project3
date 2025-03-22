// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationService from "../services/TempService";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const userRole = localStorage.getItem("role");
  
  // Fetch thông báo khi component mount
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Lấy tất cả thông báo thay vì lọc theo userId
      const data = await NotificationService.getAllNotifications();
      // Chỉ hiển thị 5 thông báo gần nhất trong dropdown
      setNotifications(data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setNotifications([]);
    navigate("/login");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
    setShowNotifications(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-200">HatechNo</Link>
        </h1>
        <ul className="flex space-x-6 items-center">
          <li><Link to="/" className="hover:text-gray-200">🏠 Trang chủ</Link></li>
          {userRole === "ADMIN" && (
            <li><Link to="/residents" className="hover:text-gray-200">👨‍👩‍👧 Cư dân</Link></li>
          )}
          <li><Link to="/apartments" className="hover:text-gray-200">🏡 Căn hộ</Link></li>
          <li><Link to="/services" className="hover:text-gray-200">Dịch vụ</Link></li>
          <li>
            <Link to="/invoices" className="hover:text-gray-200">
              {userRole === "ADMIN" ? "Hóa đơn" : "Kiểm tra hóa đơn"}
            </Link>
          </li>
          
          {user && (
            <li className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleNotifications}
                className="flex items-center hover:text-gray-200"
              >
                <span>🔔 Thông báo</span>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-1">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Dropdown thông báo */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                  <div className="py-2 px-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-gray-800 font-medium">Thông báo</h3>
                    <Link 
                      to="/notifications" 
                      onClick={() => setShowNotifications(false)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Xem tất cả
                    </Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-4 px-3 text-center text-gray-500">
                        Không có thông báo
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={handleNotificationClick}
                        >
                          <div className="py-3 px-3">
                            <div className="flex justify-between">
                              <h4 className="text-gray-800 font-medium">{notification.title}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </li>
          )}

          {user ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-gray-200">📊 Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-200">🚪 Đăng xuất</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-200">🔑 Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-200">📝 Đăng ký</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;