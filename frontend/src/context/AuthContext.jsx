import { createContext, useContext, useState } from 'react';
import { loginApi, registerApi, logoutApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('spxfood_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('spxfood_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('spxfood_user');
    }
  };

  const login = async (credentials) => {
    try {
      const res = await loginApi(credentials);
      if (res.ok || res.user || res.data || res.success || res.accessToken) {
        const userObj = res.user || res.data || {
          displayName: credentials.username || credentials.email?.split('@')[0],
          email: credentials.email || '',
          phone: '',
          address: ''
        };
        saveUser(userObj);
        return { success: true };
      }
      return { success: false, message: res.message || 'Sai tài khoản hoặc mật khẩu' };
    } catch {
      return { success: false, message: 'Không kết nối được tới server (cổng 5001).' };
    }
  };

  const register = async (formData) => {
    try {
      const res = await registerApi(formData);
      if (res.ok || res.user || res.data || res.success || res.status === 201 || res.status === 204) {
        return { success: true };
      }
      return { success: false, message: res.message || 'Đăng ký không thành công' };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ hoặc CORS. Kiểm tra lại Backend.' };
    }
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedFields };
    saveUser(nextUser);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Bỏ qua lỗi mạng khi đăng xuất
    }
    saveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);