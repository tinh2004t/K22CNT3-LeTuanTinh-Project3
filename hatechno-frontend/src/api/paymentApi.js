import axios from "axios";

const API_URL = "http://localhost:8080/payments"; // Đường dẫn API của backend

export const getPayments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thanh toán:", error);
    return [];
  }
};

export const addPayment = async (payment) => {
  try {
    const response = await axios.post(API_URL, payment, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm thanh toán:", error);
    throw error;
  }
};

export const updatePayment = async (id, payment) => {
  try {
    await axios.put(`${API_URL}/${id}`, payment, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thanh toán:", error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa thanh toán:", error);
    throw error;
  }
};
