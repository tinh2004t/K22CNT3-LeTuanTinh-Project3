import axios from "axios";

const API_URL = "http://localhost:8080/residents";

// Lấy danh sách cư dân
export const getResidents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cư dân:", error);
    throw error;
  }
};

// Thêm cư dân mới
export const addResident = async (residentData) => {
  try {
    const response = await axios.post(API_URL, residentData, {
      headers: { "Content-Type": "application/json" }
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
      headers: { "Content-Type": "application/json" }
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
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa cư dân:", error);
    throw error;
  }
};
