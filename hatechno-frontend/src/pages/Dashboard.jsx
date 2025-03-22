import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getApartments } from "../api/apartmentApi";
import { getResidents } from "../api/residentApi";
import { getInvoices } from "../api/invoiceApi";
import NotificationService from "../services/TempService";

// Import icons
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
  Activity,
  BarChart2,
  Inbox,
  AlertTriangle,
  DollarSign,
  Users,
  Clock
} from "lucide-react";

const DashboardCard = ({ title, value, icon, color, linkTo }) => {
  return (
    <Link to={linkTo || "#"} className="block">
      <div className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 ${color} flex items-start justify-between hover:shadow-md transition-shadow duration-200`}>
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-xl md:text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 md:p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
    </Link>
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

const ActivityItem = ({ icon, title, time, color }) => {
  return (
    <div className="flex items-start mb-4">
      <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center mr-3 flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon, title, onClick, color }) => {
  return (
    <button 
      onClick={onClick} 
      className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center transition-colors duration-200"
    >
      <div className={color}>{icon}</div>
      <span className="text-sm text-center mt-2">{title}</span>
    </button>
  );
};

const StatItem = ({ label, value, percentage, color }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    residents: 0,
    apartments: 0,
    unpaidBills: 0,
    maintRequests: 0
  });
  const [apartmentStats, setApartmentStats] = useState([
    { status: "Trống", count: 0, color: "bg-green-500" },
    { status: "Đã có chủ", count: 0, color: "bg-blue-500" },
    { status: "Cho thuê", count: 0, color: "bg-yellow-500" },
    { status: "Không khả dụng", count: 0, color: "bg-red-500" }
  ]);

  // Kiểm tra nếu người dùng có role là ADMIN hoặc MANAGER
  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MANAGER";

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch apartments data
      const apartmentsData = await getApartments();
      const residentsData = await getResidents();
      
      // Fetch invoices data chỉ khi là ADMIN hoặc MANAGER
      let unpaidInvoicesCount = 0;
      if (isAdminOrManager) {
        const invoicesData = await getInvoices();
        // Count unpaid invoices
        unpaidInvoicesCount = invoicesData.filter(
          invoice => invoice.status === "CHUA_THANH_TOAN"
        ).length;
      }
      
      // Calculate apartment statistics
      const statsMap = {
        "Trống": 0,
        "Đã có chủ": 0,
        "Cho thuê": 0,
        "Không khả dụng": 0
      };
      
      // Count apartments by status
      apartmentsData.forEach(apt => {
        if (statsMap[apt.status] !== undefined) {
          statsMap[apt.status]++;
        }
      });
      
      // Update apartment stats
      setApartmentStats([
        { status: "Trống", count: statsMap["Trống"], color: "bg-green-500" },
        { status: "Đã có chủ", count: statsMap["Đã có chủ"], color: "bg-blue-500" },
        { status: "Cho thuê", count: statsMap["Cho thuê"], color: "bg-yellow-500" },
        { status: "Không khả dụng", count: statsMap["Không khả dụng"], color: "bg-red-500" }
      ]);
      
      // Update dashboard data with real counts
      setStats({
        residents: residentsData.length,
        apartments: apartmentsData.length,
        unpaidBills: unpaidInvoicesCount,
        maintRequests: 7 // Temporary hardcoded value for maintenance requests
      });
      
      // Fetch notifications after other data is loaded
      await fetchNotifications();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    navigate("/login");
  };

  // Chuyển đổi vai trò từ mã sang tên người dùng có thể đọc được
  const getRoleName = (role) => {
    switch (role) {
      case "USER":
        return "Cư dân";
      case "ADMIN":
        return "Quản lý tòa nhà";
      case "MANAGER":
        return "Quản lý";
      default:
        return role;
    }
  };

  // Đóng dropdown và notifications khi click ngoài
  const closeDropdowns = () => {
    if (dropdownOpen) setDropdownOpen(false);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md fixed h-screen z-30 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64 left-0' : '-left-64 md:left-0 md:w-20'} md:fixed`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-blue-600">HatechNo</h1>
          ) : (
            <h1 className="hidden md:block text-xl font-bold text-blue-600">HN</h1>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} className="hidden md:block" />}
          </button>
        </div>

        <div className="px-2 py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div 
            className={`space-y-1 ${sidebarOpen ? 'px-2' : 'md:px-0 md:flex md:flex-col md:items-center'}`}
          >
            <Link to="/dashboard" 
              className="flex items-center px-2 py-2 rounded-md bg-blue-50 text-blue-700 font-medium transition-colors duration-200"
            >
              <Home size={20} />
              {sidebarOpen && <span className="ml-3">Tổng quan</span>}
            </Link>
            
            <Link to="/" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Home size={20} />
              {sidebarOpen && <span className="ml-3">Trang chủ</span>}
            </Link>
            
            <Link to="/profile" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <User size={20} />
              {sidebarOpen && <span className="ml-3">Hồ sơ</span>}
            </Link>
            
            <Link to="/apartments" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Home size={20} />
              {sidebarOpen && <span className="ml-3">Căn hộ</span>}
            </Link>
            
            {isAdminOrManager && (
              <Link to="/residents" 
                className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <Users size={20} />
                {sidebarOpen && <span className="ml-3">Cư dân</span>}
              </Link>
            )}
            
            <Link to="/notifications" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Bell size={20} />
              {sidebarOpen && <span className="ml-3">Thông báo</span>}
            </Link>
            
            <Link to="/services" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings size={20} />
              {sidebarOpen && <span className="ml-3">Dịch vụ</span>}
            </Link>
            
            <Link to="/invoices" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <DollarSign size={20} />
              {sidebarOpen && <span className="ml-3">{isAdminOrManager ? "Hóa đơn" : "Kiểm tra hóa đơn"}</span>}
            </Link>
            
            {isAdminOrManager && (
              <Link to="/reports" 
                className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <BarChart2 size={20} />
                {sidebarOpen && <span className="ml-3">Báo cáo</span>}
              </Link>
            )}
            
            <Link to="/settings" 
              className="flex items-center px-2 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings size={20} />
              {sidebarOpen && <span className="ml-3">Cài đặt</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className="flex-1 overflow-y-auto"
        onClick={closeDropdowns}
      >
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16 sticky top-0 z-10 flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
              >
                <Menu size={20} />
              </button>
              
              <div className="relative max-w-md w-full hidden md:block">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsOpen(!notificationsOpen);
                    setDropdownOpen(false);
                  }}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none relative"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-md shadow-lg z-20 border" onClick={(e) => e.stopPropagation()}>
                    <div className="p-3 border-b flex justify-between items-center">
                      <h3 className="font-medium">Thông báo</h3>
                      <button className="text-xs text-blue-600 hover:underline">Đánh dấu tất cả đã đọc</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 px-3 text-center text-gray-500">
                          Không có thông báo
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <NotificationItem 
                            key={notification.id || index}
                            title={notification.title || "Thông báo mới"} 
                            time={notification.time || "Vừa xong"} 
                            isNew={notification.isNew || index < 2} 
                          />
                        ))
                      )}
                    </div>
                    <div className="p-2 text-center border-t">
                      <Link to="/notifications" className="text-sm text-blue-600 hover:underline">Xem tất cả thông báo</Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium">{user?.fullName || user?.username}</span>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border" onClick={(e) => e.stopPropagation()}>
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
        </header>

        {/* Dashboard Content */}
        <main className="px-4 py-6 md:px-6 md:py-8 md:ml-20 lg:ml-20">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
                <p className="text-gray-600">Chào mừng trở lại, {user?.fullName || user?.username}!</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <DashboardCard 
                  title="Cư dân" 
                  value={stats.residents} 
                  icon={<Users size={20} className="text-blue-600" />}
                  color="border-blue-600"
                  linkTo="/residents"
                />
                <DashboardCard 
                  title="Căn hộ" 
                  value={stats.apartments} 
                  icon={<Home size={20} className="text-green-600" />}
                  color="border-green-600"
                  linkTo="/apartments"
                />
                {isAdminOrManager && (
                  <DashboardCard 
                    title="Hóa đơn chưa thanh toán" 
                    value={stats.unpaidBills} 
                    icon={<DollarSign size={20} className="text-yellow-600" />}
                    color="border-yellow-600"
                    linkTo="/invoices"
                  />
                )}
                <DashboardCard 
                  title="Yêu cầu bảo trì" 
                  value={stats.maintRequests} 
                  icon={<AlertTriangle size={20} className="text-red-600" />}
                  color="border-red-600"
                  linkTo="/maintenance"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100 lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Hoạt động gần đây</h2>
                    <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
                  </div>
                  <div className="space-y-1">
                    <ActivityItem 
                      icon={<Bell size={16} />}
                      title="Có thông báo mới về phí dịch vụ tháng 3"
                      time="Vừa xong"
                      color="bg-blue-100 text-blue-600"
                    />
                    <ActivityItem 
                      icon={<Calendar size={16} />}
                      title="Lịch bảo trì hệ thống điện ngày 15/03"
                      time="2 giờ trước"
                      color="bg-green-100 text-green-600"
                    />
                    <ActivityItem 
                      icon={<FileText size={16} />}
                      title="Tài liệu 'Quy định mới về an ninh tòa nhà' đã được cập nhật"
                      time="Hôm qua"
                      color="bg-purple-100 text-purple-600"
                    />
                    <ActivityItem 
                      icon={<MessageSquare size={16} />}
                      title="Bạn có tin nhắn mới từ Ban quản lý"
                      time="2 ngày trước"
                      color="bg-orange-100 text-orange-600"
                    />
                  </div>
                </div>

                {/* Apartment Status */}
                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
                  <h2 className="text-lg font-medium mb-4">Thống kê căn hộ</h2>
                  <div className="space-y-4">
                    {apartmentStats.map((stat) => (
                      <StatItem
                        key={stat.status}
                        label={stat.status}
                        value={stat.count}
                        percentage={stats.apartments > 0 ? (stat.count / stats.apartments) * 100 : 0}
                        color={stat.color}
                      />
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Link to="/apartments" className="text-sm text-blue-600 hover:underline">Xem chi tiết →</Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100 mb-6">
                <h2 className="text-lg font-medium mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <QuickActionButton 
                    icon={<FileText size={24} />}
                    title="Gửi yêu cầu"
                    color="text-blue-500"
                    onClick={() => navigate("/requests/new")}
                  />
                  <QuickActionButton 
                    icon={<AlertTriangle size={24} />}
                    title="Báo cáo sự cố"
                    color="text-orange-500"
                    onClick={() => navigate("/incidents/report")}
                  />
                  <QuickActionButton 
                    icon={<Calendar size={24} />}
                    title="Đặt lịch"
                    color="text-green-500"
                    onClick={() => navigate("/calendar/new")}
                  />
                  <QuickActionButton 
                    icon={<MessageSquare size={24} />}
                    title="Liên hệ BQL"
                    color="text-purple-500"
                    onClick={() => navigate("/messages/new")}
                  />
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Sự kiện sắp tới</h2>
                  <Link to="/calendar" className="text-sm text-blue-600 hover:underline">Xem lịch</Link>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start p-3 border rounded-lg bg-blue-50">
                    <div className="mr-4 bg-white p-2 rounded-lg border border-blue-200 text-center min-w-16">
                      <p className="text-sm font-bold text-blue-600">15</p>
                      <p className="text-xs text-gray-500">Tháng 3</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Bảo trì hệ thống điện</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>08:00 - 12:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                    <div className="mr-4 bg-white p-2 rounded-lg border text-center min-w-16">
                      <p className="text-sm font-bold">20</p>
                      <p className="text-xs text-gray-500">Tháng 3</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Họp cư dân quý 1/2025</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>19:30 - 21:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;