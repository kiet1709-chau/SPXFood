import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  ShoppingBag,
  Utensils,
  LogOut,
  Menu,
} from "lucide-react";

const menuItems = [
  {
    title: "Tổng quan",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Quản lý đơn hàng",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Quản lý nhà hàng",
    path: "/admin/restaurants",
    icon: Store,
  },
  {
    title: "Quản lý tài xế",
    path: "/admin/drivers",
    icon: Bike,
  },
  {
    title: "Quản lý tài khoản",
    path: "/admin/users",
    icon: Users,
  },
];

const AdminSidebar = ({ open, onClose, collapsed, onLogout }) => {
  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col border-r border-gray-100
          bg-white shadow-sm
          transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-gray-100 ${
            collapsed ? "justify-center px-3" : "gap-3 px-5"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <img
              src="/logo.svg"
              alt="SPXFood Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold tracking-tight text-green-700">
                SPXFood
              </h1>
              <p className="text-[11px] text-gray-400">Admin Management</p>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          {!collapsed && (
            <p className="mb-4 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Quản lý hệ thống
            </p>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                title={collapsed ? item.title : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm shadow-green-200"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />

                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 p-3">
          <button
            onClick={onLogout}
            title={collapsed ? "Đăng xuất" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className="shrink-0" />

            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
