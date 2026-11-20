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
    if (restaurant && String(restaurant.id) === String(id)) return;

    fetchRestaurants().then((res) => {
      if (res.success) {
        const found = res.data.find((r) => String(r.id) === String(id));
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
        {/* Breadcrumb quay lại danh sách nhà hàng */}
        <div>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:underline"
          >
            ← Quay lại danh sách nhà hàng
          </Link>
        </div>

        {/* Banner thông tin nhà hàng */}
        <section className="rounded-3xl bg-green-50 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
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

              <h1 className="text-3xl font-black text-green-700 md:text-4xl">
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
                className="w-full rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-green-500 focus:outline-none"
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
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-green-100 hover:text-green-700'
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
            <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
              Thực đơn ({filteredFoods.length} món)
            </h2>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-sm font-medium text-green-600 hover:underline"
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
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <p className="font-semibold text-gray-700">Chưa có món ăn phù hợp trong thực đơn này</p>
              <p className="mt-1 text-sm text-gray-500">Thử xóa từ khóa tìm kiếm hoặc chọn nhà hàng khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food) => {
                const isAdded = addedFoodId === food.id;
                const qtyInCart = getQuantityInCart(food.id);

                return (
                  <article
                    key={food.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >
                    <div>
                      <div className="relative mb-3">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="h-44 w-full rounded-xl object-cover"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-green-700 shadow-sm">
                          {food.category}
                        </span>
                        {qtyInCart > 0 && (
                          <span className="absolute right-2.5 top-2.5 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                            Trong giỏ: {qtyInCart}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900">{food.name}</h3>
                        <span className="shrink-0 text-xs font-bold text-amber-500">
                          ★ {Number(food.rating).toFixed(1)}
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
                        onClick={() => handleAddToCart(food.id)}
                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition ${
                          isAdded ? 'bg-emerald-700' : 'bg-green-600 hover:bg-green-700'
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
          <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-green-200 bg-green-600 px-6 py-4 text-white shadow-lg">
            <div>
              <p className="text-xs text-green-100">Giỏ hàng hiện tại ({totalCount} món)</p>
              <p className="text-lg font-extrabold">{totalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
              >
                Xem giỏ hàng
              </Link>
              <Link
                to="/checkout"
                className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-50"
              >
                Thanh toán ngay →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}