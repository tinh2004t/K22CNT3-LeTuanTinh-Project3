import axios from "axios";

const API_URL = "http://localhost:8080/invoices"; // Đường dẫn API của backend

export const getInvoices = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    return [];
  }
};

export const addInvoice = async (invoice) => {
  try {
    const response = await axios.post(API_URL, invoice, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm hóa đơn:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoice) => {
  try {
    await axios.put(`${API_URL}/${id}`, invoice, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hóa đơn:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Lỗi khi xóa hóa đơn:", error);
    throw error;
  }
};
