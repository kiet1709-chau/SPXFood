import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: form.fullName.trim(),
      displayName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password
    });
    setLoading(false);

    if (res.success) {
      navigate('/login');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F6FAF8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-emerald-50 p-8 sm:p-10">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#246B4B] text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
            S
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Tạo tài khoản mới</h1>
          <p className="text-sm text-gray-500 mt-1">Đặt món ngon giao tận nơi chỉ trong vài phút</p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập *</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="nguyenvana"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0901 234 567"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Ít nhất 6 ký tự"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#246B4B] hover:bg-[#1d573d] text-white font-semibold text-sm shadow-sm transition disabled:opacity-60 mt-2"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-[#246B4B] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}