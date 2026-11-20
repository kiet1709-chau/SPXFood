import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, totalAmount, totalCount, updateQuantity } = useCart();

  const shippingFee = totalAmount === 0 || totalAmount >= 100000 ? 0 : 15000;
  const finalTotal = totalAmount + shippingFee;
  const remainingForFreeShip = Math.max(0, 100000 - totalAmount);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold text-green-600">
            SPXFood
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="hover:text-green-600">
              Trang chủ
            </Link>
            <Link to="/restaurants" className="hover:text-green-600">
              Danh sách nhà hàng
            </Link>
            <Link to="/search" className="hover:text-green-600">
              Danh sách món ăn
            </Link>
            <Link to="/cart" className="relative text-green-600">
              Giỏ hàng
              {totalCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>
            <Link
              to="/checkout"
              className="rounded-full bg-green-600 px-4 py-1.5 text-white transition hover:bg-green-700"
            >
              Thanh toán
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        {/* Banner tiêu đề */}
        <section className="rounded-3xl bg-green-50 p-6 md:p-8">
          <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Your Food Bag
          </span>
          <h1 className="mt-2 text-3xl font-black text-green-700 md:text-4xl">
            Giỏ hàng của bạn
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kiểm tra lại số lượng món ăn và tiến hành đặt đơn giao tận nơi.
          </p>
        </section>

        {items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa thêm món ăn nào. Hãy khám phá thực đơn tươi ngon ngay!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/restaurants"
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Xem nhà hàng
              </Link>
              <Link
                to="/search"
                className="rounded-xl border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
              >
                Tìm món ăn
              </Link>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Danh sách món trong giỏ */}
            <section className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
                  Món đã chọn ({totalCount} phần)
                </h2>
                <Link to="/search" className="text-sm font-semibold text-green-600 hover:underline">
                  + Chọn thêm món
                </Link>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.foodId}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="mt-0.5 text-sm font-semibold text-green-600">
                          {Number(item.price).toLocaleString('vi-VN')}đ / phần
                        </p>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.foodId, 0)}
                          className="mt-1.5 text-xs font-medium text-red-500 hover:underline"
                        >
                          Xóa món
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      {/* Bộ tăng giảm số lượng */}
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-base font-bold text-gray-700 shadow-sm hover:bg-green-50 hover:text-green-700"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-base font-bold text-white shadow-sm hover:bg-green-700"
                        >
                          +
                        </button>
                      </div>

                      <div className="min-w-24 text-right">
                        <p className="text-xs text-gray-400">Thành tiền</p>
                        <p className="font-extrabold text-gray-900">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cột tóm tắt hóa đơn */}
            <aside className="h-fit space-y-5 rounded-3xl border border-green-100 bg-green-50/60 p-6">
              <h2 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>

              {remainingForFreeShip > 0 ? (
                <div className="rounded-xl bg-white p-3 text-xs text-gray-600 shadow-sm">
                  Mua thêm{' '}
                  <span className="font-bold text-green-600">
                    {remainingForFreeShip.toLocaleString('vi-VN')}đ
                  </span>{' '}
                  để được <span className="font-bold text-green-700">Miễn phí giao hàng</span>!
                </div>
              ) : (
                <div className="rounded-xl bg-green-600/10 p-3 text-xs font-semibold text-green-700">
                  ✓ Đơn hàng của bạn được Miễn phí giao hàng!
                </div>
              )}

              <div className="space-y-2.5 border-t border-green-200/70 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-900">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng</span>
                  <span className="font-semibold text-green-700">
                    {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-green-200/70 pt-3 text-base font-extrabold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-green-700">{finalTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full rounded-xl bg-green-600 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
              >
                Tiến hành thanh toán →
              </Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}