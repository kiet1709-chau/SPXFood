import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message || '';
  const fromPath = location.state?.from || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({
      username: form.username,
      email: form.username,
      password: form.password
    });

    setLoading(false);
    if (res.success) {
      navigate(fromPath, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F6FAF8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg border border-emerald-50 overflow-hidden grid md:grid-cols-2">
        {/* Banner xanh bên trái */}
        <div className="bg-gradient-to-br from-[#246B4B] to-[#349267] p-8 sm:p-10 text-white flex flex-col justify-between">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide">
              SPXFood Delivery
            </span>
            <h2 className="text-3xl font-extrabold mt-4 leading-tight">
              Good Food,
              <br />
              Good Mood!
            </h2>
            <p className="mt-3 text-emerald-100 text-sm leading-relaxed">
              Đăng nhập để lưu địa chỉ giao hàng, theo dõi đơn hàng theo thời gian thực và nhận ưu đãi miễn phí vận chuyển.
            </p>
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-sm text-xs text-emerald-50">
            Miễn phí giao hàng cho đơn từ 100.000đ tại khu vực TP.HCM.
          </div>
        </div>

        {/* Form đăng nhập bên phải */}
        <div className="p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mt-1">Chào mừng bạn quay trở lại với SPXFood</p>

          {redirectMessage && !error && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập hoặc Email
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Nhập username hoặc email..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#246B4B] focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#246B4B] hover:bg-[#1d573d] text-white font-semibold text-sm shadow-sm transition disabled:opacity-60"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập ngay →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-[#246B4B] hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}