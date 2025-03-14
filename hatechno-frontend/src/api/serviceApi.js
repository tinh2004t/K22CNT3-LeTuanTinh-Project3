import axios from "axios";

const BASE_URL = "http://localhost:8080/"; // Đảm bảo đường dẫn đúng

// Lấy token từ localStorage (hoặc nơi khác nếu cần)
const token = localStorage.getItem("token");

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Thêm token nếu có
  },
});

// Hàm cập nhật token khi đăng nhập
export const setAuthToken = (newToken) => {
  localStorage.setItem("token", newToken);
  api.defaults.headers.Authorization = `Bearer ${newToken}`;
};

// Hàm xử lý lỗi chung
const handleApiError = (error, action) => {
  if (error.response) {
    console.error(`Error ${action}:`, error.response.data);
    if (error.response.status === 403) {
      alert("Bạn không có quyền thực hiện hành động này. Vui lòng đăng nhập lại!");
    }
  } else if (error.request) {
    console.error(`No response received for ${action}:`, error.request);
  } else {
    console.error(`Axios error ${action}:`, error.message);
  }
  throw error;
};

// 🛠 **Dịch vụ**
export const getServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching services");
  }
};

export const addService = async (service) => {
  try {
    const response = await api.post("/services", service);
    return response.data;
  } catch (error) {
    handleApiError(error, "adding service");
  }
};

export const updateService = async (serviceId, updatedService) => {
  try {
    const response = await api.put(`/services/${serviceId}`, updatedService);
    return response.data;
  } catch (error) {
    handleApiError(error, "updating service");
  }
};

export const deleteService = async (serviceId) => {
  try {
    await api.delete(`/services/${serviceId}`);
  } catch (error) {
    handleApiError(error, "deleting service");
  }
};

// 🛠 **Phí Dịch vụ**
export const getServiceFees = async () => {
  try {
    const response = await api.get("/service-fees");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching service fees");
  }
};

export const addServiceFee = async (serviceFee) => {
  try {
    // ✅ Chuyển đổi dữ liệu về đúng format
    const formattedData = {
      amount: serviceFee.amount,
      startDate: serviceFee.startDate,
      endDate: serviceFee.endDate,
      service: { serviceId: serviceFee.serviceId },   // Đưa vào object
      apartment: { apartmentId: serviceFee.apartmentId } // Đưa vào object
    };

    const response = await api.post("/service-fees", formattedData);
    return response.data;
  } catch (error) {
    handleApiError(error, "adding service fee");
  }
};


export const updateServiceFee = async (serviceFeeId, updatedServiceFee) => {
  try {
    const response = await api.put(`/service-fees/${serviceFeeId}`, updatedServiceFee);
    return response.data;
  } catch (error) {
    handleApiError(error, "updating service fee");
  }
};

export const deleteServiceFee = async (serviceFeeId) => {
  try {
    await api.delete(`/service-fees/${serviceFeeId}`);
  } catch (error) {
    handleApiError(error, "deleting service fee");
  }
};
