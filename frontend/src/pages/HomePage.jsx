import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchFoods } from "../services/api";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "Pizza",
  "Burger",
  "Noodle",
  "Rice",
  "Sushi",
  "Salad",
  "Drink",
  "Dessert",
];

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    fetchFoods({ q: searchQuery, category: selectedCategory }).then((res) => {
      if (res.success) setFoods(res.data);
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header + Search */}
      <header className="sticky top-0 z-20 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="text-2xl font-extrabold text-green-600">
            SPXFood
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="text-green-600">
              Trang Chủ
            </Link>
            <Link to="/restaurants" className="hover:text-green-600">
              Danh sách nhà hàng
            </Link>
            <Link to="/cart" className="hover:text-green-600">
              Giỏ hàng
            </Link>
            <Link
              to="/checkout"
              className="rounded-full bg-green-600 px-4 py-1.5 text-white hover:bg-green-700"
            >
              Thanh toán
            </Link>
          </nav>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full max-w-xs rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-green-500 focus:bg-white focus:outline-none"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-6">
        {/* Hero Banner */}
        <section className="flex flex-col justify-between gap-6 rounded-3xl bg-green-50 p-8 md:flex-row md:items-center">
          <div className="max-w-lg space-y-4">
            <h1 className="text-4xl font-black leading-tight text-green-700 md:text-5xl">
              Good Food, <br /> Good Mood!
            </h1>
            <p className="text-gray-600">
              Order your favorite meals from top restaurants, delivered fast to
              your door.
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Order Now →
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
            alt="Featured meal"
            className="h-56 w-full rounded-2xl object-cover shadow-sm md:w-80"
          />
        </section>

        {/* Browse by Category */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
              Browse by Category
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Clear filter ({selectedCategory})
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(active ? "" : cat)}
                  className={`rounded-2xl border p-3 text-center text-sm font-semibold transition ${
                    active
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-100 bg-gray-50 text-gray-700 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Popular Foods */}
        <section className="space-y-4">
          <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
            Popular Foods
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => (
              <div
                key={food.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div>
                  <img
                    src={food.image}
                    alt={food.name}
                    className="mb-3 h-40 w-full rounded-xl object-cover"
                  />
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900">{food.name}</h3>
                    <span className="text-xs font-semibold text-amber-500">
                      ★ {food.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                    {food.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    {food.price.toLocaleString("vi-VN")}đ
                  </span>
                  <button
                    onClick={() => addItem(food.id, 1)}
                    className="rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
