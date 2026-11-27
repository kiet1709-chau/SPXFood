import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { fetchFoods } from "../services/api";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "All",
  "Pizza",
  "Burger",
  "Noodle",
  "Rice",
  "Sushi",
  "Salad",
  "Drink",
  "Dessert",
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "All";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default"); // default | price_asc | price_desc | rating_desc
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedFoodId, setAddedFoodId] = useState(null);

  const { addItem, totalCount } = useCart();

  // Đồng bộ URL query string khi người dùng nhập hoặc đổi danh mục
  useEffect(() => {
    const nextParams = {};
    if (query.trim()) nextParams.q = query.trim();
    if (category && category !== "All") nextParams.category = category;
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
    if (sortBy === "price_asc") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating_desc")
      return list.sort((a, b) => b.rating - a.rating);
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
            <Link to="/restaurants" className="hover:text-green-600">
              Danh sách nhà hàng
            </Link>
            <Link to="/search" className="text-green-600">
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
        {/* Khung tìm kiếm & lọc */}
        <section className="rounded-3xl bg-green-50 p-6 md:p-8">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Smart Food Search
            </span>
            <h1 className="text-3xl font-black text-green-700 md:text-4xl">
              Tìm kiếm món ăn
            </h1>
            <p className="text-sm text-gray-600">
              Nhập tên món, mô tả hoặc chọn danh mục để tìm món ăn ngon nhanh
              chóng.
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
                className="w-full rounded-full border border-green-200 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-green-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-green-500 focus:outline-none"
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
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`}
                >
                  {cat === "All" ? "Tất cả" : cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Kết quả món ăn */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="border-l-4 border-green-600 pl-3 text-xl font-bold">
              Kết quả tìm kiếm ({sortedFoods.length} món)
            </h2>

            {(query || category !== "All" || sortBy !== "default") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setSortBy("default");
                }}
                className="text-sm font-medium text-green-600 hover:underline"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4"
                />
              ))}
            </div>
          ) : sortedFoods.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <p className="font-semibold text-gray-700">
                Không tìm thấy món ăn nào khớp với bộ lọc
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thử từ khóa khác như{" "}
                <span className="font-medium text-green-700">Pizza</span>,{" "}
                <span className="font-medium text-green-700">Burger</span> hoặc
                chọn danh mục{" "}
                <span className="font-medium text-green-700">Tất cả</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedFoods.map((food) => {
                const isAdded = addedFoodId === food.id;
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
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-900">{food.name}</h3>
                        <span className="shrink-0 text-xs font-bold text-amber-500">
                          ★ {Number(food.rating).toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {food.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-base font-extrabold text-gray-900">
                        {Number(food.price).toLocaleString("vi-VN")}đ
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(food.id)}
                        className={`rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition ${
                          isAdded
                            ? "bg-emerald-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isAdded ? "✓ Đã thêm" : "Add to cart"}
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
