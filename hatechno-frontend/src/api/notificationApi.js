import axios from "axios";

const API_URL = "http://localhost:8080/notifications"; // Cập nhật URL này nếu cần

export const getNotifications = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw error;
  }
};

export const addNotification = async (notification) => {
  try {
    const response = await axios.post(API_URL, notification);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm thông báo:", error);
    throw error;
  }
};

export const updateNotification = async (id, updatedNotification) => {
  try {
    await axios.put(`${API_URL}/${id}`, updatedNotification);
  } catch (error) {
    console.error("Lỗi khi cập nhật thông báo:", error);
    throw error;
  }
};

export const deleteNotification = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa thông báo:", error);
    throw error;
  }
};
