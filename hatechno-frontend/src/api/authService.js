import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        if (response.data && response.data.token) {
            // Kiểm tra và đảm bảo userId là một giá trị hợp lệ
            if (response.data.userId && response.data.userId !== 'undefined') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                
                console.log('Login successful, saved data:', {
                    token: response.data.token,
                    role: response.data.role,
                    userId: response.data.userId
                });
            } else {
                console.error('Login response missing valid userId:', response.data);
                // Có thể thêm xử lý lỗi ở đây
            }
        } else {
            console.error('Login response missing token or user data:', response.data);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    console.log('User logged out, localStorage cleared');
};

const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    // Kiểm tra cả trường hợp userId là "undefined" (string)
    if (!token || !userId || userId === 'undefined') {
        console.log('getCurrentUser: Invalid user data', { token, role, userId });
        return null;
    }
    
    console.log('getCurrentUser called, returning:', { token, role, userId });
    
    return {
        token,
        role,
        userId
    };
};

const getUserRole = () => {
    return localStorage.getItem('role');
};

const isAdmin = () => {
    return getUserRole() === "ADMIN";
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getUserRole,
    isAdmin
};
