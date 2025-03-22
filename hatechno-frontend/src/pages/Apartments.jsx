import { useState, useEffect } from "react";
import { getApartments, addApartment, updateApartment, deleteApartment } from "../api/apartmentApi";

const userRole = localStorage.getItem("role"); // "USER" hoặc "ADMIN"

const statusOptions = [
  { value: "Trống", label: "Trống", color: "bg-green-100 text-green-800" },
  { value: "Đã có chủ", label: "Đã có chủ", color: "bg-blue-100 text-blue-800" },
  { value: "Cho thuê", label: "Cho thuê", color: "bg-yellow-100 text-yellow-800" },
  { value: "Không khả dụng", label: "Không khả dụng", color: "bg-red-100 text-red-800" }
];

function Apartments() {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentApartment, setCurrentApartment] = useState({
    apartmentId: null,
    apartmentNumber: "",
    area: "",
    status: "Trống"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "apartmentNumber", direction: "ascending" });
  const [statsSummary, setStatsSummary] = useState({});
  // New state for contact modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedApartmentForContact, setSelectedApartmentForContact] = useState(null);

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    let result = [...apartments];

    // Áp dụng tìm kiếm
    if (searchTerm) {
      result = result.filter(apt =>
        apt.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Áp dụng lọc theo trạng thái
    if (statusFilter) {
      result = result.filter(apt => apt.status === statusFilter);
    }

    // Áp dụng sắp xếp
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredApartments(result);

    // Tính toán số liệu thống kê
    const stats = {};
    statusOptions.forEach(option => {
      stats[option.value] = apartments.filter(apt => apt.status === option.value).length;
    });

    // Tính diện tích trung bình
    const totalArea = apartments.reduce((sum, apt) => sum + (apt.area || 0), 0);
    stats.avgArea = apartments.length > 0 ? (totalArea / apartments.length).toFixed(1) : 0;

    setStatsSummary(stats);
  }, [apartments, searchTerm, statusFilter, sortConfig]);

  const fetchApartments = async () => {
    setIsLoading(true);
    try {
      const data = await getApartments();
      setApartments(data);
      setFilteredApartments(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const openModal = (apartment = null) => {
    if (apartment) {
      setCurrentApartment({
        apartmentId: apartment.apartmentId,
        apartmentNumber: apartment.apartmentNumber,
        area: apartment.area,
        status: apartment.status
      });
      setIsEditing(true);
    } else {
      setCurrentApartment({
        apartmentId: null,
        apartmentNumber: "",
        area: "",
        status: "Trống"
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // New function to open contact modal
  const openContactModal = (apartment) => {
    setSelectedApartmentForContact(apartment);
    setIsContactModalOpen(true);
  };

  // New function to close contact modal
  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedApartmentForContact(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentApartment({
      ...currentApartment,
      [name]: name === "area" ? (value === "" ? "" : parseFloat(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentApartment.apartmentNumber || !currentApartment.status) {
      alert("Vui lòng nhập số căn hộ và trạng thái!");
      return;
    }

    try {
      if (isEditing) {
        await updateApartment(currentApartment.apartmentId, currentApartment);
        setApartments(apartments.map(apt =>
          apt.apartmentId === currentApartment.apartmentId
            ? { ...currentApartment }
            : apt
        ));
      } else {
        const addedApartment = await addApartment(currentApartment);
        setApartments([...apartments, addedApartment]);
      }
      closeModal();
    } catch (error) {
      console.error(`Lỗi khi ${isEditing ? "cập nhật" : "thêm"} căn hộ:`, error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa căn hộ này?")) {
      try {
        await deleteApartment(id);
        setApartments(apartments.filter(apt => apt.apartmentId !== id));
      } catch (error) {
        console.error("Lỗi khi xóa căn hộ:", error);
      }
    }
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status) ||
      { color: "bg-gray-100 text-gray-800" };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            <span className="mr-2">🏢</span>
            Quản lý Căn hộ
          </h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái của tất cả căn hộ</p>
        </div>
        {userRole === "ADMIN" && (
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors duration-200 w-full md:w-auto justify-center"
          >
            <span className="mr-2">➕</span> Thêm căn hộ
          </button>
        )}
      </div>

      {/* Phần thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statusOptions.map(option => (
          <div key={option.value}
            className={`${option.color.replace('text-', 'border-')} border-l-4 bg-white rounded-lg shadow-md p-4`}
          >
            <h3 className="text-gray-600 text-sm">{option.label}</h3>
            <div className="flex justify-between items-end mt-1">
              <span className="text-2xl font-bold">{statsSummary[option.value] || 0}</span>
              <span className="text-sm">căn hộ</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                🔍
              </span>
              <input
                type="text"
                placeholder="Tìm theo số căn hộ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {isLoading ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Đang tải dữ liệu căn hộ...</p>
            </div>
          ) : filteredApartments.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <span className="text-5xl mb-4">🏠</span>
              <p className="text-gray-500 text-lg">Không có căn hộ nào được tìm thấy</p>
              <p className="text-gray-400">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b"
                    onClick={() => handleSort("apartmentId")}>
                    ID {getSortIndicator("apartmentId")}
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b"
                    onClick={() => handleSort("apartmentNumber")}>
                    Số căn hộ {getSortIndicator("apartmentNumber")}
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b"
                    onClick={() => handleSort("area")}>
                    Diện tích (m²) {getSortIndicator("area")}
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer border-b"
                    onClick={() => handleSort("status")}>
                    Trạng thái {getSortIndicator("status")}
                  </th>
                  <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApartments.map((apartment) => (
                  <tr key={apartment.apartmentId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 whitespace-nowrap">{apartment.apartmentId}</td>
                    <td className="p-3 whitespace-nowrap font-medium">{apartment.apartmentNumber}</td>
                    <td className="p-3 whitespace-nowrap">{apartment.area ? `${apartment.area} m²` : "-"}</td>
                    <td className="p-3 whitespace-nowrap">
                      {getStatusBadge(apartment.status)}
                    </td>
                    <td className="p-3 whitespace-nowrap text-right">
                      {/* Nút Mua/Thuê chỉ hiển thị với căn hộ trạng thái "Trống" */}
                      {userRole === "USER" && apartment.status === "Trống" && (
                        <button
                          onClick={() => openContactModal(apartment)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200 mr-3"
                        >
                          Mua/Thuê
                        </button>
                      )}

                      {/* Nút Sửa/Xóa chỉ cho ADMIN */}
                      {userRole === "ADMIN" && (
                        <>
                          <button
                            onClick={() => openModal(apartment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-200"
                          >
                            <span className="hidden sm:inline mr-1">✏️</span>
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(apartment.apartmentId)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <span className="hidden sm:inline mr-1">🗑️</span>
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center">
          <div>
            Hiển thị {filteredApartments.length} trên tổng số {apartments.length} căn hộ
          </div>
          <div className="mt-2 sm:mt-0">
            Diện tích trung bình: <span className="font-medium">{statsSummary.avgArea || 0} m²</span>
          </div>
        </div>
      </div>

      {/* Modal Form thêm/sửa căn hộ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditing ? "Sửa thông tin căn hộ" : "Thêm căn hộ mới"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số căn hộ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apartmentNumber"
                  value={currentApartment.apartmentNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diện tích (m²)
                </label>
                <input
                  type="number"
                  name="area"
                  value={currentApartment.area}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={currentApartment.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal liên hệ Mua/Thuê */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Thông tin liên hệ Mua/Thuê
              </h2>
              <button onClick={closeContactModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <p className="text-lg font-medium text-blue-800 mb-2">
                  Hãy liên hệ với ban quản lý để Mua/Thuê căn hộ
                </p>
                <p className="text-gray-600">
                  Căn hộ: <span className="font-medium">{selectedApartmentForContact?.apartmentNumber}</span>
                  {selectedApartmentForContact?.area && (
                    <span> - {selectedApartmentForContact.area} m²</span>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Thông tin ban quản lý:</h3>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">👤</span>
                  <span>Tên: <span className="font-medium">Lê Tuấn Tình</span></span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">📞</span>
                  <span>Số điện thoại: <a href="tel:0845682356" className="text-blue-600 hover:underline">0845682356</a></span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">✉️</span>
                  <span>Email: <a href="mailto:tinh246@gmail.com" className="text-blue-600 hover:underline">tinh246@gmail.com</a></span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeContactModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Apartments;