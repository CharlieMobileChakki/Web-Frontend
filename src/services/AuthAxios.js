 

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // ✅ Vite env variable
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
   const adminToken = localStorage.getItem("AdminToken");

  // Detect admin API routes
    const isAdminRequest = config.url.startsWith("/api/admin");
    // Always set the right content type
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
     
    // Attach auth header if token exists
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`; // ✅ capital B
    // }

     // Attach correct token 
    if (isAdminRequest && adminToken) {
      config.headers["Authorization"] = `Bearer ${adminToken}`;
    } else if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // ✅ Token expired or invalid
      console.warn("Unauthorized - clearing session...");
      localStorage.clear();
      sessionStorage.clear();
       // 🔥 Auto Redirect to login
      // window.location.href = "/signin";
    }
 
    return Promise.reject(error);
  }
);

export default api;
