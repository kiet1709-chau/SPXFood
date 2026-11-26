import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRestaurants } from '../services/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Rice', 'Pizza', 'Noodle', 'Burger', 'Salad', 'Drink', 'Dessert'];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { totalCount } = useCart();

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchRestaurants({ q: searchQuery, category: selectedCategory })
      .then((res) => {
        if (active && res.success) {
          setRestaurants(res.data);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchQuery, selectedCategory]);

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
            <Link to="/restaurants" className="text-green-600">
              Danh sách nhà hàng
            </Link>
            <Link to="/cart" className="relative hover:text-green-600">
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
        {/* Banner giới thiệu danh sách nhà hàng */}
        <section className="rounded-3xl bg-green-50 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl space-y-2">
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                SPXFood Partner Kitchens
              </span>
              <h1 className="text-3xl font-black text-green-700 md:text-4xl">
                Danh sách nhà hàng
              </h1>
              <p className="text-sm text-gray-600">
                Chọn nhà hàng yêu thích, tìm kiếm theo tên hoặc địa chỉ và mở thực đơn để đặt món nhanh.
              </p>
            </div>

            {/* Ô tìm kiếm nhà hàng */}
            <div className="w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhà hàng, địa chỉ..."
                className="w-full rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bộ lọc danh mục */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-green-100 hover:text-green-700'
                  }`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Danh sách nhà hàng */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
              Nhà hàng khả dụng ({restaurants.length})
            </h2>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-5" />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <p className="font-semibold text-gray-700">Không tìm thấy nhà hàng phù hợp</p>
              <p className="mt-1 text-sm text-gray-500">Thử nhập từ khóa khác hoặc chọn danh mục "Tất cả".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((res) => (
                <article
                  key={res.id}
                  className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {res.category}
                      </span>
                      <span className="text-xs font-bold text-amber-500">
                        ★ {Number(res.rating).toFixed(1)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{res.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">{res.address}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="rounded-md bg-gray-100 px-2 py-1 font-medium">
                        Giao nhanh: {res.deliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs font-medium text-green-600">Đang mở cửa</span>
                    <Link
                      to={`/restaurants/${res.id}/menu`}
                      state={{ restaurant: res }}
                      className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                    >
                      Xem thực đơn →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}