import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('spxfood_profile') || '{}');
      return {
        displayName: saved.displayName || '',
        email: saved.email || '',
        phone: saved.phone || '',
        address: saved.address || ''
      };
    } catch {
      return { displayName: '', email: '', phone: '', address: '' };
    }
  });
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('spxfood_profile', JSON.stringify(form));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('spxfood_profile');
    localStorage.removeItem('spxfood_user');
    setForm({ displayName: '', email: '', phone: '', address: '' });
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F6FAF8] py-10 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Cột trái: Thẻ thông tin đại diện */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center h-fit">
          <div className="w-24 h-24 rounded-full bg-[#246B4B] text-white flex items-center justify-center text-3xl font-extrabold shadow-md">
            {(form.displayName || 'K').charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg font-bold text-gray-800 mt-4">
            {form.displayName || 'Khách hàng SPXFood'}
          </h2>
          <p className="text-sm text-gray-500">{form.phone || 'Chưa cập nhật SĐT'}</p>

          <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#246B4B]">
            Thông tin giao hàng mặc định
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* Cột phải: Form chỉnh sửa thông tin cá nhân & địa chỉ nhận hàng */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Thông tin tài khoản</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Lưu sẵn thông tin cá nhân và địa chỉ giao hàng để tự động điền khi đặt món
              </p>
            </div>
            {savedToast && (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#246B4B] text-xs font-semibold">
                ✓ Đã lưu thay đổi
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0901 234 567"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ giao hàng mặc định
              </label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#246B4B] hover:bg-[#1d573d] text-white font-semibold text-sm shadow-sm transition"
              >
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}