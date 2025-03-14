import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Import icons (giả định sử dụng Lucide hoặc bạn có thể thay thế bằng bất kỳ thư viện icon nào)
import {
  Home,
  User,
  Settings,
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Search,
  ChevronDown,
  Activity
} from "lucide-react";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  );
};

const NotificationItem = ({ title, time, isNew }) => {
  return (
    <div className={`p-3 border-b hover:bg-gray-50 cursor-pointer flex items-start ${isNew ? 'bg-blue-50' : ''}`}>
      <div className="flex-grow">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      {isNew && <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>}
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Chuyển đổi vai trò từ mã sang tên người dùng có thể đọc được
  const getRoleName = (role) => {
    switch (role) {
      case "RESIDENT":
        return "Cư dân";
      case "BUILDING_MANAGER":
        return "Quản lý tòa nhà";
      case "STAFF":
        return "Nhân viên";
      default:
        return role;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-md ${sidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-gray-800">Quản lý Chung cư</h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-800">QL</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="px-2 py-4">
          <div 
            className={`space-y-1 ${sidebarOpen ? 'px-2' : 'px-0 flex flex-col items-center'}`}
          >
            <Link to="/dashboard" 
              className="flex items-center px-2 py-2 rounded-md bg-blue-50 text-blue-700 font-medium"
            >
              <Home size={20} />
              {sidebarOpen && <span className="ml-3">Tổng quan</span>}
            </Link>
            
            <Link to="/profile" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <User size={20} />
              {sidebarOpen && <span className="ml-3">Hồ sơ</span>}
            </Link>
            
            <Link to="/notifications" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Bell size={20} />
              {sidebarOpen && <span className="ml-3">Thông báo</span>}
            </Link>
            
            <Link to="/documents" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FileText size={20} />
              {sidebarOpen && <span className="ml-3">Tài liệu</span>}
            </Link>
            
            <Link to="/calendar" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Calendar size={20} />
              {sidebarOpen && <span className="ml-3">Lịch</span>}
            </Link>
            
            <Link to="/messages" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <MessageSquare size={20} />
              {sidebarOpen && <span className="ml-3">Tin nhắn</span>}
            </Link>
            
            <Link to="/settings" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Settings size={20} />
              {sidebarOpen && <span className="ml-3">Cài đặt</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        {/* Top Navigation */}
        <div className="bg-white shadow-sm h-16 fixed w-full z-10" style={{ width: sidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)' }}>
          <div className="px-6 h-full flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 border">
                    <div className="p-3 border-b flex justify-between items-center">
                      <h3 className="font-medium">Thông báo</h3>
                      <button className="text-xs text-blue-600">Đánh dấu tất cả đã đọc</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <NotificationItem 
                        title="Có thông báo mới về phí dịch vụ tháng 3" 
                        time="Vừa xong" 
                        isNew={true} 
                      />
                      <NotificationItem 
                        title="Lịch bảo trì hệ thống điện ngày 15/03" 
                        time="2 giờ trước" 
                        isNew={true} 
                      />
                      <NotificationItem 
                        title="Thông báo họp cư dân quý 1/2025" 
                        time="Hôm qua" 
                        isNew={false} 
                      />
                      <NotificationItem 
                        title="Cập nhật quy định mới về an ninh tòa nhà" 
                        time="3 ngày trước" 
                        isNew={false} 
                      />
                    </div>
                    <div className="p-2 text-center border-t">
                      <button className="text-sm text-blue-600">Xem tất cả thông báo</button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs font-medium mt-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded inline-block">
                        {getRoleName(user?.role)}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Hồ sơ cá nhân
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Cài đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="pt-20 px-6 pb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
            <p className="text-gray-600">Chào mừng trở lại, {user?.fullName || user?.username}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard 
              title="Thông báo mới" 
              value="3" 
              icon={<Bell size={24} className="text-white" />}
              color="bg-blue-500"
            />
            <DashboardCard 
              title="Tin nhắn chưa đọc" 
              value="5" 
              icon={<MessageSquare size={24} className="text-white" />}
              color="bg-green-500"
            />
            <DashboardCard 
              title="Sự kiện sắp tới" 
              value="2" 
              icon={<Calendar size={24} className="text-white" />}
              color="bg-purple-500"
            />
            <DashboardCard 
              title="Phí dịch vụ tháng 3" 
              value="1.200.000đ" 
              icon={<Activity size={24} className="text-white" />}
              color="bg-orange-500"
            />
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Hoạt động gần đây</h2>
              <button className="text-sm text-blue-600">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <Bell size={16} />
                </div>
                <div>
                  <p className="text-sm">Bạn đã nhận một thông báo mới về phí dịch vụ</p>
                  <p className="text-xs text-gray-500">Vừa xong</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-sm">Sự kiện "Họp cư dân quý 1/2025" đã được tạo</p>
                  <p className="text-xs text-gray-500">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm">Tài liệu "Quy định mới về an ninh tòa nhà" đã được cập nhật</p>
                  <p className="text-xs text-gray-500">Hôm qua</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="text-sm">Bạn có tin nhắn mới từ Ban quản lý</p>
                  <p className="text-xs text-gray-500">2 ngày trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <FileText className="text-blue-500 mb-2" size={24} />
                <span className="text-sm">Gửi yêu cầu</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <Bell className="text-orange-500 mb-2" size={24} />
                <span className="text-sm">Báo cáo sự cố</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <Calendar className="text-green-500 mb-2" size={24} />
                <span className="text-sm">Đặt lịch</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                <MessageSquare className="text-purple-500 mb-2" size={24} />
                <span className="text-sm">Liên hệ BQL</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;