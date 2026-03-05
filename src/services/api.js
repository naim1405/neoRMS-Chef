import axios from "axios";
import { updateTokenFromInterceptor } from "../context/AuthContext";
import { BACKEND_URL } from "../constants";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  const tenantId = localStorage.getItem("tenantId");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    config.headers["x-tenant-id"] = tenantId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post(
          "/auth/refresh-token",
          undefined,
          { withCredentials: true },
        );
        const newToken = data?.data?.accessToken;
        if (newToken) {
          updateTokenFromInterceptor(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRole");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("chefName");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;

