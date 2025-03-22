import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationService from "../services/TempService";
import { Users, Home, DollarSign, Bell, Layout, LogOut, LogIn, UserPlus, Settings, Menu, X } from 'lucide-react';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
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
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getAllNotifications();
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
    setShowNotifications(false);
  };

  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

  return (
    <nav className="bg-white text-gray-800 p-4 fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white p-2 rounded-lg">
            <Home size={20} />
          </span>
          <h1 className="text-xl font-bold text-blue-600">HatechNo</h1>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="p-2 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 items-center">
          <li>
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
              <Home size={18} />
              <span>Trang chủ</span>
            </Link>
          </li>
          {isAdminOrManager && (
            <li>
              <Link to="/residents" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
                <Users size={18} />
                <span>Cư dân</span>
              </Link>
            </li>
          )}
          <li>
            <Link to="/apartments" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
              <Layout size={18} />
              <span>Căn hộ</span>
            </Link>
          </li>
          <li>
            <Link to="/services" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
              <Settings size={18} />
              <span>Dịch vụ</span>
            </Link>
          </li>
          <li>
            <Link to="/invoices" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
              <DollarSign size={18} />
              <span>{isAdminOrManager ? "Hóa đơn" : "Kiểm tra hóa đơn"}</span>
            </Link>
          </li>
          
          {user && (
            <li className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleNotifications}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
              >
                <Bell size={18} />
                <span>Thông báo</span>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200">
                  <Layout size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <LogIn size={18} />
                  <span>Đăng nhập</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <UserPlus size={18} />
                  <span>Đăng ký</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-40 border-t"
        >
          <ul className="flex flex-col py-2">
            <MobileNavItem to="/" icon={<Home size={18} />} label="Trang chủ" onClick={() => setIsMenuOpen(false)} />
            
            {isAdminOrManager && (
              <MobileNavItem to="/residents" icon={<Users size={18} />} label="Cư dân" onClick={() => setIsMenuOpen(false)} />
            )}
            
            <MobileNavItem to="/apartments" icon={<Layout size={18} />} label="Căn hộ" onClick={() => setIsMenuOpen(false)} />
            <MobileNavItem to="/services" icon={<Settings size={18} />} label="Dịch vụ" onClick={() => setIsMenuOpen(false)} />
            <MobileNavItem 
              to="/invoices" 
              icon={<DollarSign size={18} />} 
              label={isAdminOrManager ? "Hóa đơn" : "Kiểm tra hóa đơn"} 
              onClick={() => setIsMenuOpen(false)} 
            />
            
            {user && (
              <MobileNavItem to="/notifications" icon={<Bell size={18} />} label="Thông báo" onClick={() => setIsMenuOpen(false)} />
            )}
            
            {user ? (
              <>
                <MobileNavItem to="/dashboard" icon={<Layout size={18} />} label="Dashboard" onClick={() => setIsMenuOpen(false)} />
                <li className="py-3 px-4 border-b border-gray-100">
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="flex items-center space-x-2 w-full text-red-500"
                  >
                    <LogOut size={18} />
                    <span>Đăng xuất</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <MobileNavItem to="/login" icon={<LogIn size={18} />} label="Đăng nhập" onClick={() => setIsMenuOpen(false)} />
                <MobileNavItem to="/register" icon={<UserPlus size={18} />} label="Đăng ký" onClick={() => setIsMenuOpen(false)} />
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

// Component for mobile navigation items
function MobileNavItem({ to, icon, label, onClick }) {
  return (
    <li className="py-3 px-4 border-b border-gray-100">
      <Link 
        to={to} 
        className="flex items-center space-x-2 w-full"
        onClick={onClick}
      >
        <span className="text-blue-600">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default Navbar;