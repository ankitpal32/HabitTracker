import axios from "axios";

/* API base URL */
const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").trim();
export const API_URL = rawUrl.replace(/\/+$/, "").replace(/\/api$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api`
});

/* Standardized error message */
export const getErrorMessage = (
  error,
  defaultMsg = "An unexpected error occurred. Please try again."
) => {
  // Backend not reachable
  if (!error || !error.response) {
    return "Unable to connect to the server. Please try again.";
  }

  // Database or service temporarily unavailable
  if (error.response.status === 503 || error.response.status === 502) {
    return (
      error.response.data?.message ||
      "Service is temporarily unavailable. Please try again shortly."
    );
  }

  const backendMsg = error.response.data?.message;
  if (typeof backendMsg === "string" && backendMsg.trim()) {
    // Guard against exposing raw technical database errors to users
    const lower = backendMsg.toLowerCase();
    if (
      lower.includes("buffering timed out") ||
      lower.includes("mongo") ||
      lower.includes("econnrefused") ||
      lower.includes("enotfound") ||
      lower.includes("topology")
    ) {
      return "Service is temporarily unavailable. Please try again shortly.";
    }
    return backendMsg;
  }

  return defaultMsg;
};

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
