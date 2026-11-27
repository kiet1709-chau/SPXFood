import api from "@/lib/axios";

export const authService = {
  // Đăng ký
  signUp: async ({ displayName, email, phone, role, password }) => {
    const res = await api.post(
      "/auth/signup",
      {
        displayName,
        email,
        phone,
        role,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return res.data;
  },

  // Đăng nhập
  signIn: async (email, password) => {
    const res = await api.post(
      "/auth/signin",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return res.data;
  },

  // Đăng xuất
  signOut: async () => {
    const res = await api.post(
      "/auth/signout",
      {},
      {
        withCredentials: true,
      },
    );

    return res.data;
  },

  // Lấy thông tin người dùng hiện tại
  fetchMe: async () => {
    const res = await api.get("/users/me", {
      withCredentials: true,
    });

    return res.data.user;
  },

  // Làm mới Access Token
  refresh: async () => {
    const res = await api.post(
      "/auth/refresh",
      {},
      {
        withCredentials: true,
      },
    );

    return res.data.accessToken;
  },

  // Yêu cầu đặt lại mật khẩu
  forgotPassword: async (email) => {
    const res = await api.post(
      "/auth/forgot-password",
      { email },
      {
        withCredentials: true,
      },
    );

    return res.data;
  },

  // Đặt lại mật khẩu
  resetPassword: async ({ token, password, confirmPassword }) => {
    const res = await api.post(
      "/auth/reset-password",
      {
        token,
        password,
        confirmPassword,
      },
      {
        withCredentials: true,
      },
    );

    return res.data;
  },
};
