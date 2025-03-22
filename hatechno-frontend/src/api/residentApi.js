import axios from "axios";

const API_URL = "http://localhost:8080/api/residents";

// Lấy token từ localStorage
const getToken = () => localStorage.getItem("token");

// Lấy danh sách cư dân
export const getResidents = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { 
        "Authorization": `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cư dân:", error);
    throw error;
  }
};

// Tìm kiếm cư dân theo số điện thoại
export const getResidentByPhone = async (phoneNumber) => {
  try {
    const response = await axios.get(`${API_URL}/phone/${phoneNumber}`, {
      headers: { 
        "Authorization": `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm cư dân theo số điện thoại:", error);
    throw error;
  }
};

// Thêm cư dân mới
export const addResident = async (residentData) => {
  try {
    const response = await axios.post(API_URL, residentData, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm cư dân:", error);
    throw error;
  }
};

// Cập nhật cư dân
export const updateResident = async (id, residentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, residentData, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật cư dân:", error);
    throw error;
  }
};

// Xóa cư dân
export const deleteResident = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { 
        "Authorization": `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error("Lỗi khi xóa cư dân:", error);
    throw error;
  }
};