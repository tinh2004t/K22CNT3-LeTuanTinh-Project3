import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar({ setNotifications }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Gọi hàm logout trong AuthContext
    localStorage.removeItem("userId"); // Xóa userId
    setNotifications([]); // Reset thông báo
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <nav className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-200">HatechNo</Link>
        </h1>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-gray-200">🏠 Trang chủ</Link></li>
          <li><Link to="/residents" className="hover:text-gray-200">👨‍👩‍👧 Cư dân</Link></li>
          <li><Link to="/apartments" className="hover:text-gray-200">🏡 Căn hộ</Link></li>
          <li><Link to="/services" className="hover:text-gray-200">Dịch vụ</Link></li>
          <li><Link to="/invoices" className="hover:text-gray-200">Hóa đơn</Link></li>
          <li><Link to="/notifications" className="hover:text-gray-200">Thông báo</Link></li>

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
