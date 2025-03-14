import { useEffect, useState } from "react";

function Home() {
  const [dashboardData, setDashboardData] = useState({
    residents: 0,
    unpaidBills: 0,
    notifications: 0,
    services: 0,
  });

  useEffect(() => {
    // Giả lập dữ liệu từ API
    setTimeout(() => {
      setDashboardData({
        residents: 120,
        unpaidBills: 5,
        notifications: 3,
        services: 8,
      });
    }, 1000); // Giả lập delay 1s
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Cư dân" value={dashboardData.residents} icon="👨‍👩‍👧" />
        <DashboardCard title="Hóa đơn chưa thanh toán" value={dashboardData.unpaidBills} icon="💰" />
        <DashboardCard title="Thông báo mới" value={dashboardData.notifications} icon="🔔" />
        <DashboardCard title="Dịch vụ" value={dashboardData.services} icon="🛠️" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex items-center space-x-4 border-l-4 border-blue-500">
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="text-gray-600">{title}</p>
        <h2 className="text-xl font-semibold">{value}</h2>
      </div>
    </div>
  );
}

export default Home;
