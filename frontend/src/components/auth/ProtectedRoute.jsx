import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      const store = useAuthStore.getState();

      try {
        // Chưa có Access Token thì thử khôi phục phiên
        if (!store.accessToken) {
          await refresh();
        }

        // Lấy trạng thái mới nhất
        const currentState = useAuthStore.getState();

        // Có token nhưng chưa có thông tin User
        if (currentState.accessToken && !currentState.user) {
          await fetchMe();
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
      } finally {
        setStarting(false);
      }
    };

    init();
  }, [refresh, fetchMe]);

  const { accessToken, loading } = useAuthStore();

  if (starting || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Đang tải trang...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
