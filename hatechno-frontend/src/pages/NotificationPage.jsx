// src/pages/NotificationPage.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationService from '../services/TempService';

function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("role");
  
  // State cho modal thêm/sửa thông báo
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    title: '',
    message: ''
  });

  // Fetch thông báo khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Lấy tất cả thông báo cho cả USER và ADMIN
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Không thể lấy thông báo. Vui lòng thử lại sau.");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Mở modal thêm thông báo
  const handleAddNotification = () => {
    setModalType('add');
    setFormData({
      userId: '',
      title: '',
      message: ''
    });
    setShowModal(true);
  };

  // Mở modal sửa thông báo
  const handleEditNotification = (notification) => {
    setModalType('edit');
    setSelectedNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message
    });
    setShowModal(true);
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await NotificationService.sendNotification(
          formData.userId,
          formData.title,
          formData.message
        );
      } else {
        await NotificationService.updateNotification(
          selectedNotification.id,
          formData.title,
          formData.message
        );
      }
      setShowModal(false);
      fetchNotifications(); // Làm mới danh sách thông báo
    } catch (err) {
      console.error("Error handling notification:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  // Xử lý xóa thông báo
  const handleDeleteNotification = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      try {
        await NotificationService.deleteNotification(id);
        fetchNotifications(); // Làm mới danh sách thông báo
      } catch (err) {
        console.error("Error deleting notification:", err);
        alert("Không thể xóa thông báo. Vui lòng thử lại.");
      }
    }
  };

  if (loading) return <div className="container mx-auto mt-8 p-4">Đang tải thông báo...</div>;
  if (error) return <div className="container mx-auto mt-8 p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thông báo</h1>
        {userRole === "ADMIN" && (
          <button
            onClick={handleAddNotification}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm thông báo mới
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{notification.title}</h3>
                <div className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="mt-2">{notification.message}</p>
              {userRole === "ADMIN" && (
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditNotification(notification)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa Thông báo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'add' ? 'Thêm thông báo mới' : 'Sửa thông báo'}
            </h2>
            <form onSubmit={handleSubmit}>
              {modalType === 'add' && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">ID Người nhận</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nội dung</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded h-32"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPage;