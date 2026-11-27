import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/useAuthService";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  // Lưu Access Token
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  // Xóa trạng thái đăng nhập
  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  // Đăng ký
  signUp: async ({ displayName, email, phone, role, password }) => {
    try {
      set({ loading: true });

      await authService.signUp({
        displayName,
        email,
        phone,
        role,
        password,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
    } catch (error) {
      console.error("Sign up error:", error);

      toast.error(error.response?.data?.message || "Đăng ký không thành công!");

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Đăng nhập
  signIn: async (email, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(email, password);

      get().setAccessToken(accessToken);

      const user = await get().fetchMe();

      toast.success("Chào mừng bạn quay lại với SPXFood!");

      return user;
    } catch (error) {
      console.error("Sign in error:", error);

      get().clearState();

      toast.error(
        error.response?.data?.message || "Đăng nhập không thành công!",
      );

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      set({ loading: true });

      const res = await authService.forgotPassword(email);

      toast.success(
        res.message || "Vui lòng kiểm tra email để đặt lại mật khẩu!",
      );

      return res;
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error.response?.data?.message ||
          "Không thể gửi yêu cầu đặt lại mật khẩu!",
      );

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async ({ token, password, confirmPassword }) => {
    try {
      set({ loading: true });

      const res = await authService.resetPassword({
        token,
        password,
        confirmPassword,
      });

      get().clearState();

      toast.success(res.message || "Đặt lại mật khẩu thành công!");

      return res;
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error.response?.data?.message || "Không thể đặt lại mật khẩu!",
      );

      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Đăng xuất
  signOut: async () => {
    try {
      await authService.signOut();

      get().clearState();

      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error("Sign out error:", error);

      get().clearState();

      toast.error("Có lỗi xảy ra khi đăng xuất!");
    }
  },

  // Lấy thông tin người dùng hiện tại
  fetchMe: async () => {
    try {
      const user = await authService.fetchMe();

      set({ user });

      return user;
    } catch (error) {
      console.error("Fetch user error:", error);

      set({
        user: null,
        accessToken: null,
      });

      throw error;
    }
  },

  // Làm mới Access Token
  refresh: async () => {
    try {
      set({ loading: true });

      const { user, fetchMe, setAccessToken } = get();

      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }

      return accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);

      get().clearState();

      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
