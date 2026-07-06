import axios from 'axios';

// I keep API requests centralized for easier maintenance.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://e-commas-apis-production-e0f8.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for 401 handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and optionally redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch event to allow React components to react to logout
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
