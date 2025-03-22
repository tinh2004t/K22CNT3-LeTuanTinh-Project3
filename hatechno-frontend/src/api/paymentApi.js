import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; // Đường dẫn API của backend


const getToken = () => localStorage.getItem("token");

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }), // Thêm token nếu có
  },
});

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


export const getPayments = async () => {
  try {
    const response = await api.get("/payments");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetching payments");
  }
};

export const addPayment = async (paymentData) => {
  try {
    // Gửi yêu cầu thanh toán
    const response = await api.post("/payments", paymentData);
    
    // Nếu thanh toán thành công, cập nhật trạng thái hóa đơn
    if (response.data && paymentData.invoice && paymentData.invoice.invoiceId) {
      // Sử dụng updateInvoice thay vì tạo API mới
      await updateInvoiceStatus(paymentData.invoice.invoiceId);
    }
    
    return response.data;
  } catch (error) {
    handleApiError(error, "processing payment");
  }
};

export const updateInvoiceStatus = async (invoiceId) => {
  try {
    // Đầu tiên, lấy thông tin hóa đơn hiện tại
    const invoiceResponse = await api.get(`/invoices/${invoiceId}`);
    const currentInvoice = invoiceResponse.data;
    
    // Cập nhật trạng thái thành "DA_THANH_TOAN"
    currentInvoice.status = "DA_THANH_TOAN";
    
    // Gửi yêu cầu cập nhật
    const response = await api.put(`/invoices/${invoiceId}`, currentInvoice);
    return response.data;
  } catch (error) {
    handleApiError(error, "updating invoice status");
  }
};

export const updatePayment = async (id, payment) => {
  try {
    const response = await api.put(`/services/${id}`,   payment);
    return response.data;
  } catch (error) {
    handleApiError(error, "updating payments");
  }
};



export const deletePayment = async (id) => {
  try {
    await api.delete(`/services/${id}`);
  } catch (error) {
    handleApiError(error, "deleting payments");
  }
};