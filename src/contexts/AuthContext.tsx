import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LocalStorage } from '../utils/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, expiresIn?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => {
    return LocalStorage.get<string>('token');
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return LocalStorage.get<string>('token') !== null;
  });

  useEffect(() => {
    if (token) {
      const storedToken = LocalStorage.get<string>('token');
      if (!storedToken) {
        setToken(null);
        setIsAuthenticated(false);
        message.error('登录已过期，请重新登录');
        navigate('/login');
      } else {
        setIsAuthenticated(true);
      }
    } else {
      LocalStorage.remove('token');
      setIsAuthenticated(false);
    }
  }, [token, navigate]);

  const login = (newToken: string, expiresIn: number = 7200) => {
    LocalStorage.set('token', newToken, expiresIn);
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    LocalStorage.remove('token');
    message.success('已退出登录');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};