import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('turfbook_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('turfbook_user');
      const storedToken = localStorage.getItem('turfbook_access_token');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleAuthLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('turfbook_access_token', data.access);
    localStorage.setItem('turfbook_refresh_token', data.refresh);
    localStorage.setItem('turfbook_user', JSON.stringify(data.user));

    setToken(data.access);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    localStorage.removeItem('turfbook_access_token');
    localStorage.removeItem('turfbook_refresh_token');
    localStorage.removeItem('turfbook_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        role: user?.role || 'guest',
        isOwner: user?.role === 'owner' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
