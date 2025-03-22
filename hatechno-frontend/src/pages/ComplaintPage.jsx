// src/pages/ComplaintPage.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ComplaintService from '../services/ComplaintService';

function ComplaintPage() {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("role");
  
  // State cho modal thêm phản ánh và cập nhật trạng thái
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' hoặc 'updateStatus'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [selectedStatus, setSelectedStatus] = useState('PENDING');

  // Fetch phản ánh khi component mount
  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await ComplaintService.getAllComplaints();
      setComplaints(data);
      setError(null);
    } catch (err) {
      setError("Không thể lấy phản ánh. Vui lòng thử lại sau.");
      console.error("Error fetching complaints:", err);
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

  // Mở modal thêm phản ánh
  const handleAddComplaint = () => {
    setModalType('add');
    setFormData({
      title: '',
      description: ''
    });
    setShowModal(true);
  };

  // Mở modal cập nhật trạng thái (chỉ cho ADMIN)
  const handleUpdateStatus = (complaint) => {
    setModalType('updateStatus');
    setSelectedComplaint(complaint);
    setSelectedStatus(complaint.status || 'PENDING');
    setShowModal(true);
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        // Người dùng tạo phản ánh mới
        await ComplaintService.createComplaint(
          formData.title,
          formData.description
        );
      } else if (modalType === 'updateStatus') {
        // ADMIN cập nhật trạng thái
        await ComplaintService.updateComplaintStatus(
          selectedComplaint.id,
          selectedStatus
        );
      }
      setShowModal(false);
      fetchComplaints(); // Làm mới danh sách phản ánh
    } catch (err) {
      console.error("Error handling complaint:", err);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      PENDING: 'Đang chờ xử lý',
      IN_PROGRESS: 'Đang xử lý',
      RESOLVED: 'Đã giải quyết',
      REJECTED: 'Đã từ chối',
      UPDATED: 'Đã cập nhật'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      UPDATED: 'bg-purple-100 text-purple-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="container mx-auto mt-8 p-4">Đang tải phản ánh...</div>;
  if (error) return <div className="container mx-auto mt-8 p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Phản ánh</h1>
        {userRole === "USER" && (
          <button
            onClick={handleAddComplaint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm phản ánh mới
          </button>
        )}
      </div>

      {complaints.length === 0 ? (
        <p className="text-gray-500">Không có phản ánh nào.</p>
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white p-4 rounded shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{complaint.title}</h3>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                    {getStatusLabel(complaint.status || 'PENDING')}
                  </span>
                  <div className="ml-3 text-sm text-gray-500">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="mt-2">{complaint.description}</p>
              {userRole === "ADMIN" && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(complaint)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cập nhật trạng thái
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal cho thêm phản ánh hoặc cập nhật trạng thái */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'add' ? 'Thêm phản ánh mới' : 'Cập nhật trạng thái phản ánh'}
            </h2>
            <form onSubmit={handleSubmit}>
              {modalType === 'add' ? (
                <>
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
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full border p-2 rounded h-32"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Trạng thái</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="PENDING">Đang chờ xử lý</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="RESOLVED">Đã giải quyết</option>
                    <option value="REJECTED">Đã từ chối</option>
                    <option value="UPDATED">Đã cập nhật</option>
                  </select>
                </div>
              )}
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
                  {modalType === 'add' ? 'Gửi phản ánh' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintPage;