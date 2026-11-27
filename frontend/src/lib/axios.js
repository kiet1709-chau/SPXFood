import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

// Dùng chung một request refresh nếu nhiều API cùng hết hạn token
let refreshPromise = null;

// Các API không cần tự động refresh khi nhận lỗi 401
const excludedAuthEndpoints = [
  "/auth/signin",
  "/auth/signup",
  "/auth/signout",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// Gắn Access Token vào header của request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Tự động refresh Access Token khi hết hạn
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Không xử lý nếu không có request gốc
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isExcludedEndpoint = excludedAuthEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );

    // Chỉ refresh khi nhận 401 và request chưa được thử lại
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isExcludedEndpoint
    ) {
      return Promise.reject(error);
    }

    // Đánh dấu request đã thử refresh
    originalRequest._retry = true;

    try {
      // Nếu chưa có request refresh thì tạo mới
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh", {}, { withCredentials: true })
          .then((res) => {
            const newAccessToken = res.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Các request khác sẽ dùng chung kết quả refresh
      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Gửi lại request ban đầu
      return api(originalRequest);
    } catch (refreshError) {
      try {
        await api.post("/auth/signout", {});
      } catch (signOutError) {
        console.error("Sign out after refresh failure:", signOutError);
      } finally {
        useAuthStore.getState().clearState();
      }

      return Promise.reject(refreshError);
    }
  },
);

export default api;
