import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const [keyword, setKeyword] = useState('');
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    setOpenMenu(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* 1. Bên trái: Logo ảnh */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/logo.svg"
            alt="SPXFood Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* 2. Ở giữa: Menu điều hướng */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-1.5 rounded-full bg-[#246B4B] text-white text-sm font-medium"
          >
            Trang chủ
          </Link>
          <Link
            to="/restaurants"
            className="px-4 py-1.5 rounded-full text-gray-600 hover:bg-emerald-50 hover:text-[#246B4B] text-sm font-medium transition"
          >
            Danh sách nhà hàng
          </Link>
          <Link
            to="/search"
            className="px-4 py-1.5 rounded-full text-gray-600 hover:bg-emerald-50 hover:text-[#246B4B] text-sm font-medium transition"
          >
            Thực đơn
          </Link>
        </nav>

        {/* 3. Bên phải: Thanh tìm kiếm + Icon Giỏ hàng + Tài khoản */}
        <div className="flex items-center gap-3 sm:gap-4">
          <form onSubmit={handleSearch} className="hidden sm:block">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search for food..."
              className="w-48 lg:w-64 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm focus:border-[#246B4B] focus:bg-white focus:outline-none"
            />
          </form>

          {/* Icon Giỏ hàng */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-[#246B4B] transition"
            title="Giỏ hàng & Thanh toán"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          {/* Cụm Tài khoản tròn xanh lá + mũi tên */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              className="flex items-center gap-1.5 focus:outline-none group"
              title={user ? user.displayName || user.username : 'Tài khoản'}
            >
              <div className="w-10 h-10 rounded-full bg-[#246B4B] group-hover:bg-[#1d573d] text-white flex items-center justify-center shadow-sm transition">
                {user ? (
                  <span className="font-bold text-sm uppercase">
                    {(user.displayName || user.username || user.email || 'U').charAt(0)}
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                )}
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${openMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {user.displayName || user.username || 'Khách hàng'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B] transition"
                    >
                      Thông tin tài khoản
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setOpenMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B] transition"
                    >
                      Giỏ hàng & Thanh toán
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Tài khoản khách hàng
                      </p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setOpenMenu(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#246B4B] hover:bg-emerald-50 transition"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpenMenu(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B] transition"
                    >
                      Đăng ký tài khoản mới
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}