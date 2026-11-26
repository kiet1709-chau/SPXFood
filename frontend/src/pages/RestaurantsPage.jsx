import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFoods, fetchRestaurants } from '../services/api';
import { useCart } from '../context/CartContext';

const FOOD_CATEGORIES = ['All', 'Pizza', 'Burger', 'Noodle', 'Dessert', 'Salad', 'Sushi', 'Drink'];
const ORDER_MODES = ['Delivery', 'Pick Up', 'Dine'];
const PAYMENT_TABS = [
  { id: 'COD', label: 'Cash' },
  { id: 'BANK_TRANSFER', label: 'Transfer' },
  { id: 'EWALLET', label: 'E-Wallet' }
];

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});

  const [orderMode, setOrderMode] = useState('Delivery');
  const [paymentTab, setPaymentTab] = useState('COD');

  const { items, totalAmount, addItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Tải danh sách nhà hàng
  useEffect(() => {
    fetchRestaurants().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setRestaurants(res.data);
      }
    });
  }, []);

  // Tải danh sách món ăn theo nhà hàng, danh mục và từ khóa
  useEffect(() => {
    const categoryParam = activeCategory === 'All' ? '' : activeCategory;
    fetchFoods({
      q: searchQuery,
      category: categoryParam,
      restaurantId: selectedRestaurant
    }).then((res) => {
      if (res.success) setFoods(res.data);
    });
  }, [searchQuery, activeCategory, selectedRestaurant]);

  const currentRestaurantObj = restaurants.find(
    (r) => (r.id || r._id) === selectedRestaurant
  );

  const discount = totalAmount >= 100000 ? 15000 : 0;
  const finalTotal = Math.max(0, totalAmount - discount);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-gray-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12">
        {/* ==================== CỘT TRÁI: THỰC ĐƠN & NHÀ HÀNG (8 cột) ==================== */}
        <div className="space-y-6 lg:col-span-8">
          {/* Thanh tiêu đề nhà hàng + Ô tìm kiếm Search Here */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {currentRestaurantObj ? currentRestaurantObj.name : 'SPXFood Restaurants'}
              </h1>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10.82a5.83 5.83 0 11-11.66 0 5.83 5.83 0 0111.66 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Here"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-[#246B4B] focus:outline-none"
              />
            </div>
          </div>

          {/* Thanh chọn nhanh Nhà hàng */}
          {restaurants.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedRestaurant('')}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedRestaurant === ''
                    ? 'bg-[#246B4B] text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#246B4B]'
                }`}
              >
                Tất cả nhà hàng
              </button>
              {restaurants.map((rest) => {
                const restId = rest.id || rest._id;
                const active = selectedRestaurant === restId;
                return (
                  <button
                    key={restId}
                    type="button"
                    onClick={() => setSelectedRestaurant(restId)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'bg-[#246B4B] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#246B4B]'
                    }`}
                  >
                    {rest.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Bộ lọc danh mục: Find The Best Food */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Find The Best Food</h2>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setSelectedRestaurant('');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#246B4B] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {FOOD_CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      active
                        ? 'bg-[#246B4B] text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-[#246B4B]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lưới danh sách món ăn 3 cột giống ảnh */}
          {foods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
              Không tìm thấy món ăn phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {foods.map((food) => {
                const id = food.id || food._id;
                return (
                  <div
                    key={id}
                    className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      <div className="relative mb-3 flex justify-center">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="h-32 w-32 rounded-full object-cover shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => toggleFavorite(id)}
                          className="absolute right-0 top-0 text-lg text-gray-400 hover:text-red-500"
                        >
                          {favorites[id] ? '♥' : '♡'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-bold text-gray-900">
                          {food.name}
                        </h3>
                        <span className="shrink-0 text-sm font-extrabold text-[#246B4B]">
                          {Number(food.price).toLocaleString('vi-VN')}đ
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">
                        {food.desc || 'Fresh ingredients prepared daily'}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-500">
                        ★ {(food.rating || 5.0).toFixed(1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(id, 1)}
                        className="rounded-lg bg-[#246B4B] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1d573d]"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================== CỘT PHẢI: BẢNG MY ORDER (4 cột) ==================== */}
        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-20 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">My Order</h2>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#246B4B]">
              {items.reduce((sum, i) => sum + i.quantity, 0)} món
            </span>
          </div>

          {/* 3 nút chọn chế độ: Dine / Pick Up / Delivery */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {ORDER_MODES.map((mode) => {
              const active = orderMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setOrderMode(mode)}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#246B4B] text-white'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-[#246B4B]'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>

          {/* Danh sách món đã thêm vào giỏ */}
          <div className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-8 text-center text-xs text-gray-400">
                Chưa có món nào. Bấm <b>Add to cart</b> bên trái để thêm món!
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.foodId}
                  className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="line-clamp-1 text-xs font-bold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400">Standard Size</p>
                      <p className="mt-0.5 text-xs font-extrabold text-[#246B4B]">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.foodId, 0)}
                      className="text-gray-400 hover:text-red-500"
                      title="Xóa món"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                        className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-xs font-bold text-gray-700 hover:border-[#246B4B] hover:text-[#246B4B]"
                      >
                        +
                      </button>
                      <span className="w-5 text-center text-xs font-bold">
                        {String(item.quantity).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                        className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-xs font-bold text-gray-700 hover:border-[#246B4B] hover:text-[#246B4B]"
                      >
                        −
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tổng tiền Items / Discount / Total Amount */}
          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Items</span>
              <span className="font-bold text-gray-800">
                {totalAmount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span className="font-bold text-red-500">
                -{discount.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2.5 text-sm font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-[#246B4B]">{finalTotal.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {/* Payments: Cash / Transfer / E-Wallet */}
          <div className="mt-5">
            <h3 className="text-sm font-bold text-gray-800">Payments</h3>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {PAYMENT_TABS.map((tab) => {
                const active = paymentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentTab(tab.id)}
                    className={`rounded-lg py-2 text-xs font-semibold transition ${
                      active
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nút Checkout màu xanh */}
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => navigate('/cart')}
            className="mt-6 w-full rounded-xl bg-[#246B4B] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1d573d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}