import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach JWT Token (if exists)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getMemberById = async (id) => {
  const { data } = await API.get(`/members/details/${id}`);
  return data;
};

// Update member by id (payload can be object or FormData)
export const updateMemberById = async (id, payload, config = {}) => {
  // If payload is FormData, caller may provide headers; otherwise axios will send JSON
  const { data } = await API.put(`/members/${id}`, payload, config);
  return data;
};

export default API;
