import axios from "axios";

const BASE_URL = "http://localhost:8080/api/"; // Đường dẫn API của backend


const getToken = () => localStorage.getItem("token");

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }), // Thêm token nếu có
  },
});
export const getInvoices = async () => {
  try {
    const response = await api.get("/invoices");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching payments");
  }
};

export const getInvoicesByResidentId = async (residentId) => {
  try {
    const response = await api.get(`/invoices/resident/${residentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching invoices by resident ID");
  }
};


export const addInvoice = async (invoice) => {
  try {
    const response = await api.post("/invoices",  invoice);
    return response.data;
  } catch (error) {
    handleApiError(error, "adding invoices");
  }
};

export const updateInvoice = async (id, invoice) => {
  try {
    const response = await api.put(`/invoices/${id}`,   invoice);
    return response.data;
  } catch (error) {
    handleApiError(error, "updating invoice");
  }
};

export const deleteInvoice = async (id) => {
  try {
    await api.delete(`/invoices/${id}`);
  } catch (error) {
    handleApiError(error, "deleting invoice");
  }
};
