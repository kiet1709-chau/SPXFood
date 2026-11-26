import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchFoods, fetchRestaurants } from '../services/api';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const { id } = useParams();
  const location = useLocation();

  const [restaurant, setRestaurant] = useState(location.state?.restaurant || null);
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addedFoodId, setAddedFoodId] = useState(null);

  const { items, totalAmount, totalCount, addItem } = useCart();

  // Lấy thông tin nhà hàng (nếu người dùng truy cập thẳng URL mà không qua state)
  useEffect(() => {
    if (restaurant && String(restaurant.id || restaurant._id) === String(id)) return;

    fetchRestaurants().then((res) => {
      if (res.success) {
        const found = res.data.find((r) => String(r.id || r._id) === String(id));
        if (found) setRestaurant(found);
      }
    });
  }, [id, restaurant]);

  // Lấy danh sách món ăn thuộc nhà hàng hiện tại
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchFoods({ restaurantId: id })
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
  }, [id]);

  // Danh sách danh mục có trong thực đơn của quán
  const menuCategories = useMemo(() => {
    const unique = Array.from(new Set(foods.map((f) => f.category)));
    return ['All', ...unique];
  }, [foods]);

  // Lọc món ăn trong thực đơn theo từ khóa và danh mục
  const filteredFoods = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return foods.filter((f) => {
      const matchCat = selectedCategory === 'All' || f.category === selectedCategory;
      const matchQuery =
        !keyword ||
        f.name.toLowerCase().includes(keyword) ||
        f.desc.toLowerCase().includes(keyword);
      return matchCat && matchQuery;
    });
  }, [foods, searchQuery, selectedCategory]);

  const handleAddToCart = async (foodId) => {
    await addItem(foodId, 1);
    setAddedFoodId(foodId);
    setTimeout(() => {
      setAddedFoodId((prev) => (prev === foodId ? null : prev));
    }, 1200);
  };

  // Kiểm tra món đã có bao nhiêu phần trong giỏ
  const getQuantityInCart = (foodId) => {
    const found = items.find((i) => i.foodId === foodId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] text-gray-900">
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Breadcrumb quay lại danh sách nhà hàng */}
        <div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#246B4B] hover:underline"
          >
            ← Quay lại danh sách nhà hàng
          </Link>
        </div>

        {/* Banner thông tin nhà hàng */}
        <section className="rounded-3xl bg-[#F2F8F5] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#246B4B] px-3 py-1 text-xs font-semibold text-white">
                  {restaurant?.category || 'Restaurant Menu'}
                </span>
                {restaurant?.rating && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-500 shadow-sm">
                    ★ {Number(restaurant.rating).toFixed(1)}
                  </span>
                )}
                {restaurant?.deliveryTime && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                    Giao trong {restaurant.deliveryTime}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-black text-[#246B4B] md:text-4xl">
                {restaurant ? restaurant.name : `Thực đơn nhà hàng #${id}`}
              </h1>
              <p className="text-sm text-gray-600">
                {restaurant?.address || 'Khám phá thực đơn tươi ngon và thêm món vào giỏ hàng ngay.'}
              </p>
            </div>

            {/* Ô tìm món ngay trong thực đơn quán */}
            <div className="w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm món trong thực đơn..."
                className="w-full rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-[#246B4B] focus:outline-none"
              />
            </div>
          </div>

          {/* Tab lọc theo nhóm món của quán */}
          {menuCategories.length > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {menuCategories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-[#246B4B] text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-[#246B4B]'
                    }`}
                  >
                    {cat === 'All' ? 'Tất cả món' : cat}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Danh sách món ăn của nhà hàng */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-[#246B4B] pl-3 text-xl font-bold">
              Thực đơn ({filteredFoods.length} món)
            </h2>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-sm font-medium text-[#246B4B] hover:underline"
              >
                Xem tất cả món
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4" />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
              <p className="font-semibold text-gray-700">Chưa có món ăn phù hợp trong thực đơn này</p>
              <p className="mt-1 text-sm text-gray-500">Thử xóa từ khóa tìm kiếm hoặc chọn nhà hàng khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food) => {
                const foodId = food.id || food._id;
                const isAdded = addedFoodId === foodId;
                const qtyInCart = getQuantityInCart(foodId);

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
                        {qtyInCart > 0 && (
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#246B4B] px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                            Trong giỏ: {qtyInCart}
                          </span>
                        )}
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

        {/* Thanh tóm tắt giỏ hàng nổi phía dưới khi đã chọn món */}
        {totalCount > 0 && (
          <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-[#246B4B] px-6 py-4 text-white shadow-lg">
            <div>
              <p className="text-xs text-emerald-100">Giỏ hàng hiện tại ({totalCount} món)</p>
              <p className="text-lg font-extrabold">{totalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
            <Link
              to="/cart"
              className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-[#246B4B] shadow-sm transition hover:bg-emerald-50"
            >
              Giỏ hàng & Thanh toán →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}