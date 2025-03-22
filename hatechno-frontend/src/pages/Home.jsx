import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getApartments } from "../api/apartmentApi";
import { getResidents } from "../api/residentApi";
import { getInvoices } from "../api/invoiceApi";
import NotificationService from "../services/TempService"; 
import { AuthContext } from "../context/AuthContext";
import { Users, Home as HomeIcon, DollarSign, Bell, BarChart2, Settings } from 'lucide-react';

function Home() {
  const [dashboardData, setDashboardData] = useState({
    residents: 0,
    apartments: 0,
    unpaidBills: 0,
    notifications: 0,
    services: 0,
  });
  
  const [apartmentStats, setApartmentStats] = useState([
    { status: "Trống", count: 0, color: "bg-green-500" },
    { status: "Đã có chủ", count: 0, color: "bg-blue-500" },
    { status: "Cho thuê", count: 0, color: "bg-yellow-500" },
    { status: "Không khả dụng", count: 0, color: "bg-red-500" }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [recentNotifications, setRecentNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  
  // Kiểm tra nếu người dùng có role là ADMIN hoặc MANAGER
  const isAdminOrManager = user && (user.role === "ADMIN" || user.role === "MANAGER");
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  function Notification({ show, message, type }) {
    if (!show) return null;
    
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white p-3 rounded-md shadow-lg z-50`}>
        {message}
      </div>
    );
  }

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getAllNotifications();
      const recent = data.slice(0, 3);
      setRecentNotifications(recent);
      
      setDashboardData(prev => ({
        ...prev,
        notifications: data.length
      }));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      showNotification("Lỗi khi lấy dữ liệu thông báo", "error");
    }
  };
  
  useEffect(() => {
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
        
        // Update dashboard data with real counts including unpaid bills
        setDashboardData({
          residents: residentsData.length,
          apartments: apartmentsData.length,
          unpaidBills: unpaidInvoicesCount,
          notifications: 0, // Will be updated by fetchNotifications
          services: 8,
        });
        
        // Fetch notifications after other data is loaded
        await fetchNotifications();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showNotification("Lỗi khi lấy dữ liệu bảng điều khiển", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, isAdminOrManager]);

  return (
    <div className="p-4 md:p-6">
      <Notification show={notification.show} message={notification.message} type={notification.type} />

      <div className="flex items-center mb-6">
        <HomeIcon size={28} className="text-blue-600 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Tổng quan hệ thống quản lý chung cư
        </h1>
      </div>
      <p className="text-gray-600 mb-6">Xem tất cả thông tin quan trọng tại một nơi</p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Thẻ thống kê chính */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard 
              title="Cư dân" 
              value={dashboardData.residents} 
              icon={<Users size={24} />}
              color="bg-blue-100 border-blue-500" 
              linkTo="/residents"
            />
            <DashboardCard 
              title="Căn hộ" 
              value={dashboardData.apartments} 
              icon={<HomeIcon size={24} />}
              color="bg-green-100 border-green-500" 
              linkTo="/apartments"
            />
            
            {/* Chỉ hiển thị hóa đơn chưa thanh toán cho ADMIN hoặc MANAGER */}
            {isAdminOrManager && (
              <DashboardCard 
                title="Hóa đơn chưa thanh toán" 
                value={dashboardData.unpaidBills} 
                icon={<DollarSign size={24} />}
                color="bg-yellow-100 border-yellow-500" 
                linkTo="/invoices"
              />
            )}
            
            <DashboardCard 
              title="Thông báo mới" 
              value={dashboardData.notifications} 
              icon={<Bell size={24} />}
              color="bg-purple-100 border-purple-500" 
              linkTo="/notifications"
            />
          </div>

          {/* Phần thống kê và biểu đồ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Biểu đồ phân bố căn hộ */}
            <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Thống kê trạng thái căn hộ</h2>
              <div className="flex flex-col space-y-4">
                {apartmentStats.map((stat) => (
                  <div key={stat.status} className="flex items-center">
                    <div className="w-32 md:w-40 flex-shrink-0">
                      <span className="font-medium">{stat.status}</span>
                    </div>
                    <div className="flex-grow bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div 
                        className={`${stat.color} h-5 rounded-full`} 
                        style={{ width: `${(stat.count / dashboardData.apartments) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-10 md:w-16 text-right ml-2 font-medium">
                      {stat.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Link to="/apartments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem chi tiết →
                </Link>
              </div>
            </div>

            {/* Thông báo gần đây */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Thông báo gần đây</h2>
              <div className="space-y-3">
                {recentNotifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Không có thông báo</p>
                ) : (
                  recentNotifications.map((notification) => (
                    <div key={notification.id} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded-r">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 text-right">
                <Link to="/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem tất cả →
                </Link>
              </div>
            </div>
          </div>

          {/* Phần truy cập nhanh */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Truy cập nhanh</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <QuickAccessCard icon={<HomeIcon size={24} />} title="Quản lý căn hộ" linkTo="/apartments" />
              <QuickAccessCard icon={<Users size={24} />} title="Quản lý cư dân" linkTo="/residents" />
              
              {/* Chỉ hiển thị Hóa đơn & Phí cho ADMIN hoặc MANAGER */}
              {isAdminOrManager && (
                <QuickAccessCard icon={<DollarSign size={24} />} title="Hóa đơn & Phí" linkTo="/invoices" />
              )}
              
              <QuickAccessCard icon={<Settings size={24} />} title="Dịch vụ" linkTo="/services" />
              <QuickAccessCard icon={<Bell size={24} />} title="Thông báo" linkTo="/notifications" />
              
              {/* Chỉ hiển thị Báo cáo cho ADMIN hoặc MANAGER */}
              {isAdminOrManager && (
                <QuickAccessCard icon={<BarChart2 size={24} />} title="Báo cáo" linkTo="/reports" />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardCard({ title, value, icon, color, linkTo }) {
  return (
    <Link to={linkTo} className="block">
      <div className={`${color} p-4 shadow-md rounded-lg flex items-center space-x-4 border-l-4 hover:shadow-lg transition-shadow duration-300`}>
        <span className="text-gray-700">{icon}</span>
        <div>
          <p className="text-gray-600 text-sm md:text-base">{title}</p>
          <h2 className="text-lg md:text-xl font-semibold">{value}</h2>
        </div>
      </div>
    </Link>
  );
}

function QuickAccessCard({ icon, title, linkTo }) {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors duration-200">
        <div className="flex justify-center mb-2 text-blue-600">{icon}</div>
        <p className="font-medium text-sm">{title}</p>
      </div>
    </Link>
  );
}

export default Home;