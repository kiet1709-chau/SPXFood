import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrderApi } from '../services/api';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt trực tiếp cho tài xế SPXFood' },
  { id: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng / QR', desc: 'Quét mã VietQR xác nhận tức thì' },
  { id: 'EWALLET', label: 'Ví điện tử (MoMo / ZaloPay)', desc: 'Thanh toán nhanh không dùng tiền mặt' }
];

export default function CartPage() {
  const { items, totalAmount, totalCount, updateQuantity, refreshCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Tự động điền thông tin người nhận nếu đã lưu ở trang Thông tin tài khoản
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('spxfood_profile') || '{}');
      if (saved.displayName) setCustomerName(saved.displayName);
      if (saved.phone) setPhone(saved.phone);
      if (saved.address) setAddress(saved.address);
    } catch {
      // Bỏ qua nếu chưa có dữ liệu lưu trước đó
    }
  }, []);

  const shippingFee = totalAmount === 0 || totalAmount >= 100000 ? 0 : 15000;
  const finalTotal = totalAmount + shippingFee;
  const remainingForFreeShip = Math.max(0, 100000 - totalAmount);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOrderApi({
        userId: 'guest',
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
        paymentMethod,
        items: items.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: totalAmount,
        shippingFee,
        totalAmount: finalTotal
      });

      if (!res.success && !res.ok) {
        setErrorMsg(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
        return;
      }

      setCreatedOrder(res.data || res.order || res);
      await refreshCart();
    } catch {
      setErrorMsg('Lỗi kết nối máy chủ. Hãy kiểm tra backend đang chạy ở cổng 5001.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] text-gray-900">
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6">
        {/* Màn hình đặt hàng thành công */}
        {createdOrder ? (
          <section className="mx-auto max-w-2xl rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#246B4B] text-2xl font-bold text-white">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-black text-[#246B4B] md:text-3xl">
              Đặt hàng thành công!
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Cảm ơn <span className="font-bold text-gray-900">{createdOrder.customerName || customerName}</span>, đơn hàng của bạn đang được nhà hàng chuẩn bị.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-white p-5 text-left text-sm shadow-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-extrabold text-[#246B4B]">
                  {createdOrder.id || createdOrder._id || 'SPX-ORDER'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="font-semibold">{createdOrder.phone || phone}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="shrink-0 text-gray-500">Địa chỉ giao</span>
                <span className="text-right font-semibold">{createdOrder.address || address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thanh toán</span>
                <span className="font-semibold">{createdOrder.paymentMethod || paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-extrabold">
                <span>Tổng thanh toán</span>
                <span className="text-[#246B4B]">
                  {Number(createdOrder.total || createdOrder.totalAmount || finalTotal).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-xl bg-[#246B4B] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d573d]"
              >
                Về trang chủ
              </Link>
              <Link
                to="/restaurants"
                className="rounded-xl border border-green-200 bg-white px-6 py-2.5 text-sm font-semibold text-[#246B4B] transition hover:bg-green-100"
              >
                Tiếp tục đặt món
              </Link>
            </div>
          </section>
        ) : items.length === 0 ? (
          /* Giỏ hàng trống */
          <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-sm text-gray-500">
              Bạn chưa thêm món ăn nào. Hãy khám phá thực đơn tươi ngon ngay!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/restaurants"
                className="rounded-xl bg-[#246B4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d573d]"
              >
                Xem nhà hàng
              </Link>
              <Link
                to="/search"
                className="rounded-xl border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#246B4B] transition hover:bg-green-50"
              >
                Tìm món ăn
              </Link>
            </div>
          </section>
        ) : (
          /* Giao diện gộp: Cột trái (Món ăn + Thông tin giao hàng + Thanh toán) | Cột phải (Tóm tắt & Chốt đơn) */
          <>
            <section className="rounded-3xl bg-[#F2F8F5] p-6 md:p-8">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#246B4B]">
                Cart & Fast Checkout
              </span>
              <h1 className="mt-2 text-3xl font-black text-[#246B4B] md:text-4xl">
                Giỏ hàng & Thanh toán
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Điều chỉnh số lượng món ăn, nhập địa chỉ nhận hàng và hoàn tất đơn hàng trên cùng một trang.
              </p>
            </section>

            <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* CỘT TRÁI (2/3): 1. Món đã chọn -> 2. Thông tin người nhận -> 3. Phương thức thanh toán */}
              <div className="space-y-6 lg:col-span-2">
                {/* Mục 1: Danh sách món trong giỏ */}
                <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="border-l-4 border-[#246B4B] pl-3 text-lg font-bold">
                      1. Món ăn đã chọn ({totalCount} phần)
                    </h2>
                    <Link to="/search" className="text-sm font-semibold text-[#246B4B] hover:underline">
                      + Chọn thêm món
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.foodId}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 shrink-0 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <p className="text-xs font-semibold text-[#246B4B]">
                              {Number(item.price).toLocaleString('vi-VN')}đ / phần
                            </p>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.foodId, 0)}
                              className="mt-1 text-xs font-medium text-red-500 hover:underline"
                            >
                              Xóa món
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-5 sm:justify-end">
                          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B]"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#246B4B] text-sm font-bold text-white hover:bg-[#1d573d]"
                            >
                              +
                            </button>
                          </div>

                          <div className="min-w-24 text-right">
                            <p className="font-extrabold text-gray-900">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mục 2: Thông tin người nhận */}
                <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="border-l-4 border-[#246B4B] pl-3 text-lg font-bold">
                      2. Thông tin người nhận
                    </h2>
                    <Link to="/profile" className="text-xs font-semibold text-[#246B4B] hover:underline">
                      Sửa địa chỉ mặc định
                    </Link>
                  </div>

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
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#246B4B] focus:outline-none"
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
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#246B4B] focus:outline-none"
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
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#246B4B] focus:outline-none"
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
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#246B4B] focus:outline-none"
                    />
                  </div>
                </section>

                {/* Mục 3: Phương thức thanh toán */}
                <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="border-l-4 border-[#246B4B] pl-3 text-lg font-bold">
                    3. Phương thức thanh toán
                  </h2>

                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                            active
                              ? 'border-[#246B4B] bg-emerald-50/70'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={active}
                            onChange={() => setPaymentMethod(method.id)}
                            className="mt-1 accent-[#246B4B]"
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

              {/* CỘT PHẢI (1/3): Tóm tắt hóa đơn & Nút đặt hàng */}
              <aside className="sticky top-24 h-fit space-y-5 rounded-3xl border border-emerald-100 bg-[#F2F8F5] p-6">
                <h2 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>

                {remainingForFreeShip > 0 ? (
                  <div className="rounded-xl bg-white p-3 text-xs text-gray-600 shadow-sm">
                    Mua thêm{' '}
                    <span className="font-bold text-[#246B4B]">
                      {remainingForFreeShip.toLocaleString('vi-VN')}đ
                    </span>{' '}
                    để được <span className="font-bold text-[#246B4B]">Miễn phí giao hàng</span>!
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#246B4B]/10 p-3 text-xs font-semibold text-[#246B4B]">
                    ✓ Đơn hàng của bạn được Miễn phí giao hàng!
                  </div>
                )}

                <div className="space-y-2.5 border-t border-emerald-200/70 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({totalCount} món)</span>
                    <span className="font-semibold text-gray-900">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí giao hàng</span>
                    <span className="font-semibold text-[#246B4B]">
                      {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-200/70 pt-3 text-base font-extrabold text-gray-900">
                    <span>Tổng thanh toán</span>
                    <span className="text-[#246B4B]">{finalTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#246B4B] py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1d573d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng →'}
                </button>
              </aside>
            </form>
          </>
        )}
      </main>
    </div>
  );
}