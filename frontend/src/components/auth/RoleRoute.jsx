import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

const RoleRoute = ({ allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);

  // Chưa có thông tin người dùng
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Kiểm tra vai trò
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
