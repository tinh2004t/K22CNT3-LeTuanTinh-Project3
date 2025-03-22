// src/services/ComplaintService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/complaints';
const getToken = () => localStorage.getItem("token");

const ComplaintService = {
  // Lấy tất cả phản ánh của người dùng hiện tại
  getAllComplaints: async () => {
    const response = await axios.get(`${BASE_URL}/all`,{
        headers: { 
          "Authorization": `Bearer ${getToken()}`
        }
      });
    return response.data;
  },

  // Lấy phản ánh theo ID
  getComplaintById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`,{
        headers: { 
          "Authorization": `Bearer ${getToken()}`
        }
      });
    return response.data;
  },

  // Tạo phản ánh mới
  createComplaint: async (title, description) => {
    const response = await axios.post(`${BASE_URL}/create`, {
      title,
      description
    },
    {
        headers: { 
          "Authorization": `Bearer ${getToken()}`
        }
      });
    return response.data;
  },

  // Cập nhật trạng thái phản ánh
  updateComplaintStatus: async (id, status) => {
    const response = await axios.put(`${BASE_URL}/${id}/status`, {
      status
    },
    {
        headers: { 
          "Authorization": `Bearer ${getToken()}`
        }
      });
    return response.data;
  }
};

export default ComplaintService;