import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ isLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ...(isLogin ? {} : { confirmPassword: '' })
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Có lỗi xảy ra');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Tên đăng nhập" className="w-full p-2 border rounded mb-3" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mật khẩu" className="w-full p-2 border rounded mb-3" onChange={handleChange} required />
          {!isLogin && (
            <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" className="w-full p-2 border rounded mb-3" onChange={handleChange} required />
          )}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button className="text-blue-500" onClick={() => navigate(isLogin ? '/register' : '/login')}>
            {isLogin ? ' Đăng ký ngay' : ' Đăng nhập'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;