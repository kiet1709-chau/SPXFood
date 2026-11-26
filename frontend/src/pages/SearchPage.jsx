import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchFoods } from '../services/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Noodle', 'Rice', 'Sushi', 'Salad', 'Drink', 'Dessert'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default'); // default | price_asc | price_desc | rating_desc
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedFoodId, setAddedFoodId] = useState(null);

  const { addItem } = useCart();

  // Đồng bộ URL query string khi người dùng nhập hoặc đổi danh mục
  useEffect(() => {
    const nextParams = {};
    if (query.trim()) nextParams.q = query.trim();
    if (category && category !== 'All') nextParams.category = category;
    setSearchParams(nextParams, { replace: true });
  }, [query, category, setSearchParams]);

  // Gọi API tìm kiếm món ăn
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchFoods({ q: query, category })
      .then((res) => {
        if (active && res.success) {
          setFoods(res.data);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query, category]);

  // Sắp xếp kết quả phía client
  const sortedFoods = useMemo(() => {
    const list = [...foods];
    if (sortBy === 'price_asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating_desc') return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [foods, sortBy]);

  const handleAddToCart = async (foodId) => {
    await addItem(foodId, 1);
    setAddedFoodId(foodId);
    setTimeout(() => {
      setAddedFoodId((prev) => (prev === foodId ? null : prev));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] text-gray-900">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Khung tìm kiếm & lọc */}
        <section className="rounded-3xl bg-[#F2F8F5] p-6 md:p-8">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-[#246B4B]">
              Smart Food Search
            </span>
            <h1 className="text-3xl font-black text-[#246B4B] md:text-4xl">
              Tìm kiếm món ăn
            </h1>
            <p className="text-sm text-gray-600">
              Nhập tên món, mô tả hoặc chọn danh mục để tìm món ăn ngon nhanh chóng.
            </p>
          </div>

          {/* Ô nhập từ khóa + Sắp xếp */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm món ăn (ví dụ: Pizza, Burger, Noodle, Salad...)"
                className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-[#246B4B] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-[#246B4B] focus:outline-none"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="rating_desc">Đánh giá: Cao nhất</option>
            </select>
          </div>

          {/* Bộ lọc danh mục */}
          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#246B4B] text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B]'
                  }`}
                >
                  {cat === 'All' ? 'Tất cả' : cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Kết quả món ăn */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="border-l-4 border-[#246B4B] pl-3 text-xl font-bold">
              Kết quả tìm kiếm ({sortedFoods.length} món)
            </h2>

            {(query || category !== 'All' || sortBy !== 'default') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                  setSortBy('default');
                }}
                className="text-sm font-medium text-[#246B4B] hover:underline"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4" />
              ))}
            </div>
          ) : sortedFoods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="font-semibold text-gray-700">Không tìm thấy món ăn nào khớp với bộ lọc</p>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thử từ khóa khác như <span className="font-medium text-[#246B4B]">Pizza</span>,{' '}
                <span className="font-medium text-[#246B4B]">Burger</span> hoặc chọn danh mục{' '}
                <span className="font-medium text-[#246B4B]">Tất cả</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedFoods.map((food) => {
                const foodId = food.id || food._id;
                const isAdded = addedFoodId === foodId;
                return (
                  <article
                    key={foodId}
                    className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <div>
                      <div className="relative mb-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="h-44 w-full rounded-xl object-cover"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-[#246B4B] shadow-sm">
                          {food.category}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900">{food.name}</h3>
                        <span className="shrink-0 text-xs font-bold text-amber-500">
                          ★ {Number(food.rating || 5.0).toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{food.desc}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-base font-extrabold text-gray-900">
                        {Number(food.price).toLocaleString('vi-VN')}đ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(foodId)}
                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition ${
                          isAdded ? 'bg-emerald-700' : 'bg-[#246B4B] hover:bg-[#1d573d]'
                        }`}
                      >
                        {isAdded ? '✓ Đã thêm' : 'Add to cart'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}