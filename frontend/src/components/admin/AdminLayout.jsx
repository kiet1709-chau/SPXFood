import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Menu, Bell, UserCircle, ChevronDown } from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { useAuthStore } from "@/stores/useAuthStore";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/users": "Quản lý tài khoản",
  "/admin/restaurants": "Quản lý nhà hàng",
  "/admin/drivers": "Quản lý tài xế",
  "/admin/orders": "Quản lý đơn hàng",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const pageTitle = pageTitles[location.pathname] || "Quản trị hệ thống";

  const handleLogout = async () => {
    await signOut();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed((prev) => !prev);
                } else {
                  setSidebarOpen(true);
                }
              }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
              aria-label="Thu gọn menu"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-800 sm:text-lg">
                {pageTitle}
              </h2>
              <p className="hidden text-xs text-gray-400 sm:block">
                Hệ thống quản trị SPXFood
              </p>
            </div>
          </div>

          {/* Header right */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Thông báo"
            >
              <Bell size={21} />
            </button>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                {user?.displayName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="hidden sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {user?.displayName || "Administrator"}
                </p>
                <p className="text-xs text-gray-400">Quản trị viên</p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-gray-400 sm:block"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
