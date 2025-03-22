import { useState, useEffect } from "react";
import { getResidents, addResident, updateResident, deleteResident } from "../api/residentApi";
import { AlertCircle, PlusCircle, Search, Edit2, Trash2, CheckCircle, XCircle, Users, Home } from "lucide-react";


function Residents() {
  const [residents, setResidents] = useState([]);
  const [newResident, setNewResident] = useState({ fullName: "", apartmentId: "", phone: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({ fullName: "", apartmentId: "", phone: "", email: "" });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setIsLoading(true);
    try {
      const data = await getResidents();
      setResidents(data);
    } catch (error) {
      showNotification("Lỗi khi lấy danh sách cư dân", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setNewResident({ ...newResident, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  const handleAddResident = async () => {
    try {
      const residentData = {
        ...newResident,
        apartment: { apartmentId: parseInt(newResident.apartmentId) }
      };
      const addedResident = await addResident(residentData);
      setResidents([...residents, addedResident]);
      setNewResident({ fullName: "", apartmentId: "", phone: "", email: "" });
      setIsAddingNew(false);
      showNotification("Thêm cư dân thành công", "success");
    } catch (error) {
      showNotification("Lỗi khi thêm cư dân", "error");
    }
  };

  const handleEdit = (resident) => {
    setEditingId(resident.residentId);
    setEditingData({
      fullName: resident.fullName,
      apartmentId: resident.apartment?.apartmentId || "",
      phone: resident.phone,
      email: resident.email
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedResident = {
        ...editingData,
        apartment: { apartmentId: parseInt(editingData.apartmentId) }
      };
      await updateResident(editingId, updatedResident);
      setResidents(residents.map((res) => (res.residentId === editingId ? { residentId: editingId, ...updatedResident } : res)));
      setEditingId(null);
      showNotification("Cập nhật thông tin thành công", "success");
    } catch (error) {
      showNotification("Lỗi khi cập nhật cư dân", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
      try {
        await deleteResident(id);
        setResidents(residents.filter((res) => res.residentId !== id));
        showNotification("Xóa cư dân thành công", "success");
      } catch (error) {
        showNotification("Lỗi khi xóa cư dân", "error");
      }
    }
  };

  const filteredResidents = residents.filter(resident => 
    resident.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.phone?.includes(searchTerm) ||
    resident.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment?.apartmentId?.toString().includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="flex items-center mb-6">
        <Users size={28} className="text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Quản lý cư dân</h1>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm cư dân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Thêm cư dân mới
        </button>
      </div>

      {isAddingNew && (
        <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-800">Thêm cư dân mới</h2>
            <button onClick={() => setIsAddingNew(false)} className="text-gray-500 hover:text-gray-700">
              <XCircle size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên cư dân</label>
              <input
                type="text"
                name="fullName"
                value={newResident.fullName}
                onChange={handleChange}
                placeholder="Nhập tên cư dân"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Căn hộ</label>
              <input
                type="number"
                name="apartmentId"
                value={newResident.apartmentId}
                onChange={handleChange}
                placeholder="Nhập ID căn hộ"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={newResident.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={newResident.email}
                onChange={handleChange}
                placeholder="Nhập email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsAddingNew(false)}
              className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAddResident}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Thêm cư dân
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredResidents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 mb-2">Không tìm thấy cư dân nào</div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-600 hover:text-blue-800"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Tên cư dân</th>
                <th className="px-4 py-3 font-medium">Căn hộ</th>
                <th className="px-4 py-3 font-medium">Số điện thoại</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResidents.map((resident) => (
                <tr key={resident.residentId} className="hover:bg-gray-50">
                  {editingId === resident.residentId ? (
                    <>
                      <td className="px-4 py-3">{resident.residentId}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="fullName"
                          value={editingData.fullName}
                          onChange={handleEditChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          name="apartmentId"
                          value={editingData.apartmentId}
                          onChange={handleEditChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          name="phone"
                          value={editingData.phone}
                          onChange={handleEditChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="email"
                          name="email"
                          value={editingData.email}
                          onChange={handleEditChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md mr-2"
                          title="Lưu"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md"
                          title="Hủy"
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-gray-800">{resident.residentId}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{resident.fullName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Home size={16} className="text-blue-500 mr-2" />
                          <span>{resident.apartment?.apartmentId || "Không có"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{resident.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{resident.email}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(resident)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md mr-2"
                          title="Sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(resident.residentId)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        Tổng số cư dân: {residents.length} | Cư dân hiện đang hiển thị: {filteredResidents.length}
      </div>
    </div>
  );
}

export default Residents;