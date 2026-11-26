import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../services/api';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt trực tiếp cho tài xế SPXFood' },
  { id: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng / QR', desc: 'Quét mã VietQR xác nhận tức thì' },
  { id: 'EWALLET', label: 'Ví điện tử (MoMo / ZaloPay)', desc: 'Thanh toán nhanh không dùng tiền mặt' }
];

export default function CheckoutPage() {
  const { items, totalAmount, totalCount, refreshCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const shippingFee = totalAmount === 0 || totalAmount >= 100000 ? 0 : 15000;
  const finalTotal = totalAmount + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOrderApi({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
        paymentMethod
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
        return;
      }

      setCreatedOrder(res.data);
      await refreshCart();
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ. Hãy kiểm tra backend đang chạy ở cổng 5000.');
    } finally {
      setSubmitting(false);
    }
  };

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
              Tìm kiếm món ăn
            </Link>
            <Link to="/cart" className="relative hover:text-green-600">
              Giỏ hàng
              {totalCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        {/* Màn hình đặt hàng thành công */}
        {createdOrder ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-black text-green-700 md:text-3xl">
              Đặt hàng thành công!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Cảm ơn <span className="font-bold text-gray-900">{createdOrder.customerName}</span>, đơn hàng của bạn đang được nhà hàng chuẩn bị.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 text-left text-sm shadow-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-extrabold text-green-700">{createdOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="font-semibold">{createdOrder.phone}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="shrink-0 text-gray-500">Địa chỉ giao</span>
                <span className="text-right font-semibold">{createdOrder.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thanh toán</span>
                <span className="font-semibold">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-extrabold">
                <span>Tổng thanh toán</span>
                <span className="text-green-700">
                  {Number(createdOrder.total).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Về trang chủ
              </Link>
              <Link
                to="/restaurants"
                className="rounded-xl border border-green-200 bg-white px-6 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
              >
                Tiếp tục đặt món
              </Link>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800">Chưa có món ăn nào để thanh toán</h2>
            <p className="mt-2 text-sm text-gray-500">
              Vui lòng chọn món ăn vào giỏ hàng trước khi tiến hành thanh toán.
            </p>
            <Link
              to="/restaurants"
              className="mt-6 inline-block rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Khám phá thực đơn
            </Link>
          </section>
        ) : (
          <>
            {/* Banner tiêu đề */}
            <section className="rounded-3xl bg-green-50 p-6 md:p-8">
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Fast & Secure Checkout
              </span>
              <h1 className="mt-2 text-3xl font-black text-green-700 md:text-4xl">
                Thanh toán đơn hàng
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Nhập địa chỉ nhận hàng và chọn hình thức thanh toán phù hợp.
              </p>
            </section>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cột trái: Thông tin giao hàng & phương thức thanh toán */}
              <div className="space-y-6 lg:col-span-2">
                <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="border-l-4 border-green-600 pl-3 text-lg font-bold">
                    1. Thông tin người nhận
                  </h2>

                  {errorMsg && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Họ và tên người nhận *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0901 234 567"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Địa chỉ giao hàng chi tiết *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Ghi chú cho tài xế / quán (tùy chọn)
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Ít cay, giao trước cổng..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </section>

                <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="border-l-4 border-green-600 pl-3 text-lg font-bold">
                    2. Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                            active
                              ? 'border-green-600 bg-green-50/70'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={active}
                            onChange={() => setPaymentMethod(method.id)}
                            className="mt-1 accent-green-600"
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Cột phải: Tóm tắt đơn & nút đặt hàng */}
              <aside className="h-fit space-y-5 rounded-3xl border border-green-100 bg-green-50/60 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Đơn hàng ({totalCount} món)</h2>
                  <Link to="/cart" className="text-xs font-semibold text-green-600 hover:underline">
                    Sửa giỏ hàng
                  </Link>
                </div>

                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.foodId} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="rounded-md bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                          {item.quantity}x
                        </span>
                        <span className="line-clamp-1 font-medium text-gray-800">{item.name}</span>
                      </div>
                      <span className="shrink-0 font-semibold text-gray-900">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>

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
                    <span>Tổng thanh toán</span>
                    <span className="text-green-700">{finalTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng'}
                </button>
              </aside>
            </form>
          </>
        )}
      </main>
    </div>
  );
}