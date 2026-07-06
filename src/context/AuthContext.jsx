import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

// I use Context API to manage authentication state globally.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from local storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axiosClient.get('/api/auth/users/me');
          if (response.data.success) {
            // Check if user is nested inside data or at root
            const userData = response.data.data?.user || response.data.user || response.data.data;
            setUser(userData);
          }
        } catch (error) {
          console.error("Session verification failed", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to unauthorized event from axios interceptor
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosClient.post('/api/auth/users/login', { email, password });
      if (response.data.success) {
        // Extract token and user from response.data.data if they exist, otherwise fallback
        const payload = response.data.data || response.data;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        setUser(payload.user);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axiosClient.post('/api/auth/users/register', { email, password, role: 'USER' });
      if (response.data.success) {
        const payload = response.data.data || response.data;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
        setUser(payload.user);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
