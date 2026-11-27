import {
  ShoppingCart,
  Wallet,
  Users,
  Star,
  TrendingUp,
  ArrowUpRight,
  CalendarDays,
  Store,
  Bike,
} from "lucide-react";

const statistics = [
  {
    title: "Tổng đơn hàng",
    value: "—",
    description: "Tổng đơn hàng toàn hệ thống",
    icon: ShoppingCart,
    iconStyle: "bg-green-50 text-green-600",
  },
  {
    title: "Tổng doanh thu",
    value: "—",
    description: "Doanh thu toàn hệ thống",
    icon: Wallet,
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Tổng tài khoản",
    value: "—",
    description: "Tất cả người dùng",
    icon: Users,
    iconStyle: "bg-blue-50 text-blue-600",
  },
  {
    title: "Đánh giá trung bình",
    value: "—",
    description: "Đánh giá các nhà hàng",
    icon: Star,
    iconStyle: "bg-amber-50 text-amber-500",
  },
];

const orderStatuses = {
  PENDING: {
    label: "Chờ xác nhận",
    style: "bg-amber-50 text-amber-700",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    style: "bg-blue-50 text-blue-700",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    style: "bg-orange-50 text-orange-700",
  },
  READY_FOR_PICKUP: {
    label: "Chờ giao",
    style: "bg-indigo-50 text-indigo-700",
  },
  DELIVERING: {
    label: "Đang giao",
    style: "bg-sky-50 text-sky-700",
  },
  DELIVERED: {
    label: "Đã giao",
    style: "bg-green-50 text-green-700",
  },
  CANCELLED: {
    label: "Đã hủy",
    style: "bg-red-50 text-red-700",
  },
  REJECTED: {
    label: "Bị từ chối",
    style: "bg-red-50 text-red-700",
  },
};

// Chưa có API nên dữ liệu đơn hàng đang để trống
const recentOrders = [];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Tổng quan hoạt động của nền tảng SPXFood
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {item.value}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.iconStyle}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart and recent orders */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Order overview */}
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-800">Order Overview</h2>

              <p className="mt-1 text-xs text-gray-400">
                Tổng quan đơn hàng theo thời gian
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-600">
              <CalendarDays size={14} />
              <span>7 ngày gần đây</span>
            </div>
          </div>

          {/* Chart placeholder until statistics API is available */}
          <div className="relative">
            <div className="flex h-64">
              <div className="flex flex-col justify-between pb-7 pr-3 text-[11px] text-gray-400">
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>—</span>
                <span>0</span>
              </div>

              <div className="relative flex-1 border-b border-l border-gray-200">
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="w-full border-t border-dashed border-gray-100"
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
                      <TrendingUp size={22} className="text-green-600" />
                    </div>

                    <p className="text-sm font-medium text-gray-600">
                      Chưa có dữ liệu thống kê
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Biểu đồ sẽ được cập nhật khi kết nối API
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-8 mt-2 flex justify-between text-[11px] text-gray-400">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent orders */}
        <section className="min-w-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-7">
          <div className="mb-5 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-800">Recent Orders</h2>

              <p className="mt-1 text-xs text-gray-400">
                Các đơn hàng mới nhất
              </p>
            </div>

            <a
              href="/admin/orders"
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-green-600 transition-colors hover:text-green-700"
            >
              Xem tất cả
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  <th className="px-2 py-3 font-medium">Mã đơn</th>
                  <th className="px-2 py-3 font-medium">Khách hàng</th>
                  <th className="px-2 py-3 font-medium">Tổng tiền</th>
                  <th className="px-2 py-3 font-medium">Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const status = orderStatuses[order.status] || {
                      label: order.status,
                      style: "bg-gray-100 text-gray-600",
                    };

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-2 py-4 font-medium text-gray-700">
                          #{order.orderCode}
                        </td>

                        <td className="px-2 py-4 text-gray-600">
                          {order.customerName}
                        </td>

                        <td className="px-2 py-4 font-medium text-gray-700">
                          {Number(order.total || 0).toLocaleString("vi-VN")}đ
                        </td>

                        <td className="px-2 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${status.style}`}
                          >
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                          <ShoppingCart size={23} className="text-gray-400" />
                        </div>

                        <p className="text-sm font-medium text-gray-600">
                          Chưa có đơn hàng
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Đơn hàng mới sẽ xuất hiện tại đây
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Quick management links */}
      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">
          Quản lý nhanh
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="/admin/restaurants"
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Store size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">Nhà hàng</p>
              <p className="text-xs text-gray-400">Quản lý nhà hàng</p>
            </div>
          </a>

          <a
            href="/admin/drivers"
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Bike size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">Tài xế</p>
              <p className="text-xs text-gray-400">Quản lý tài xế</p>
            </div>
          </a>

          <a
            href="/admin/users"
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">Tài khoản</p>
              <p className="text-xs text-gray-400">Quản lý người dùng</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
