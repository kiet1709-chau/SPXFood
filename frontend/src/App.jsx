import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";

// Context giỏ hàng
import { CartProvider } from "./context/CartContext";

// Các trang khách hàng
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import MenuPage from "./pages/MenuPage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Các trang xác thực
import SignUpPage from "@/pages/SignUpPage";
import SigninPage from "@/pages/SignInPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

// Middleware phân quyền
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleRoute from "@/components/auth/RoleRoute";

// Admin
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
// Trang tạm cho chức năng chưa hoàn thiện
const RolePlaceholderPage = ({ title }) => {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Trang này đang được phát triển.
      </p>
    </div>
  );
};

const AdminPlaceholderPage = ({ title }) => {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        Chức năng này đang được xây dựng.
      </p>
    </div>
  );
};

const DevLogoutButton = () => {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate("/signin");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed bottom-6 right-6 z-[9999] rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-xl hover:bg-red-700"
    >
      {user ? `Đăng xuất (${user.role})` : "Về trang đăng nhập"}
    </button>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4000}
        />
        <DevLogoutButton />
        <Routes>
          {/* Trang công khai - Khách chưa đăng nhập vẫn truy cập được */}
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id/menu" element={<MenuPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Các trang xác thực */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Trang không có quyền truy cập */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Các trang yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            {/* CUSTOMER */}
            <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
              <Route path="/customer" element={<HomePage />} />

              {/* Thanh toán yêu cầu đăng nhập */}
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* RESTAURANT */}
            <Route element={<RoleRoute allowedRoles={["RESTAURANT"]} />}>
              <Route
                path="/restaurant"
                element={<RolePlaceholderPage title="Trang nhà hàng" />}
              />
            </Route>

            {/* DRIVER */}
            <Route element={<RoleRoute allowedRoles={["DRIVER"]} />}>
              <Route
                path="/driver"
                element={<RolePlaceholderPage title="Trang tài xế" />}
              />
            </Route>

            {/* ADMIN */}
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />

                <Route
                  path="users"
                  element={<AdminPlaceholderPage title="Quản lý tài khoản" />}
                />

                <Route
                  path="restaurants"
                  element={<AdminPlaceholderPage title="Quản lý nhà hàng" />}
                />

                <Route
                  path="drivers"
                  element={<AdminPlaceholderPage title="Quản lý tài xế" />}
                />

                <Route
                  path="orders"
                  element={<AdminPlaceholderPage title="Quản lý đơn hàng" />}
                />
              </Route>
            </Route>
          </Route>

          {/* Trang không tồn tại */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
