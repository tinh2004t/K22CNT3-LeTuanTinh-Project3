import axios from "axios";

const API_URL = "http://localhost:8080/api/apartments"; // Đường dẫn API của backend

const getToken = () => localStorage.getItem("token");

export const getApartments = async () => {
  try {
    const response = await axios.get(API_URL,{
      headers: { 
        "Authorization": `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách căn hộ:", error);
    return [];
  }
};

export const addApartment = async (apartment) => {
  try {
    const response = await axios.post(API_URL, apartment, {
      headers: { "Content-Type": "application/json" ,
      "Authorization": `Bearer ${getToken()}`},
      
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
      headers: { "Content-Type": "application/json" ,
      "Authorization": `Bearer ${getToken()}`},
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật căn hộ:", error);
    throw error;
  }
};

export const deleteApartment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`,{
      headers: { 
        "Authorization": `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.error("Lỗi khi xóa căn hộ:", error);
    throw error;
  }
};
