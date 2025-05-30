// client/src/api/axios.js
import axios from 'axios';

// Create a centralized axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔁 Use your backend URL
});

// Request Interceptor: Attach JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accesstoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
