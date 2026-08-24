import axios from "axios";

/* API base URL */
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL.replace(/\/+$/, "").replace(/\/api$/, "")}/api`
});

/* Request interceptor */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response interceptor */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const publicPaths = ["/", "/login", "/register"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
