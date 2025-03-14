import axios from "axios";

const API_URL = "http://localhost:8080/apartments"; // Đường dẫn API của backend

export const getApartments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách căn hộ:", error);
    return [];
  }
};

export const addApartment = async (apartment) => {
  try {
    const response = await axios.post(API_URL, apartment, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm căn hộ:", error);
    throw error;
  }
};

export const updateApartment = async (id, apartment) => {
  try {
    await axios.put(`${API_URL}/${id}`, apartment, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật căn hộ:", error);
    throw error;
  }
};

export const deleteApartment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa căn hộ:", error);
    throw error;
  }
};
