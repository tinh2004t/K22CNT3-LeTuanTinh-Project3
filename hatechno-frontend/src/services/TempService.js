// src/services/NotificationService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

class NotificationService {
  // Lấy tất cả thông báo (cho cả USER và ADMIN)
  async getAllNotifications() {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }
  }

  // Gửi thông báo mới (chỉ ADMIN)
  async sendNotification(userId, title, message) {
    try {
      const response = await axios.post(
        `${API_URL}/send`, 
        { userId, title, message },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Xóa thông báo (chỉ ADMIN - cần thêm API endpoint)
  async deleteNotification(notificationId) {
    try {
      const response = await axios.delete(`${API_URL}/${notificationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Cập nhật thông báo (chỉ ADMIN - cần thêm API endpoint)
  async updateNotification(notificationId, title, message) {
    try {
      const response = await axios.put(
        `${API_URL}/${notificationId}`, 
        { title, message },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();