// client/src/services/auth.js
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// POST /auth/login
export const loginUser = async (formData) => {
  const res = await axios.post(`${API}/auth/login`, formData);
  return res.data;
};

// POST /auth/register (optional for signup)
export const registerUser = async (formData) => {
  const res = await axios.post(`${API}/auth/register`, formData);
  return res.data;
};
