import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFoods } from '../services/api';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['Pizza', 'Burger', 'Noodle', 'Rice', 'Sushi', 'Salad', 'Drink', 'Dessert'];

export default function HomePage() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState({});
  const { addItem } = useCart();

  useEffect(() => {
    fetchFoods({ category: selectedCategory }).then((res) => {
      if (res.success) setFoods(res.data);
    });
  }, [selectedCategory]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] text-gray-900">
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6">
        {/* Hero Banner */}
        <section className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#E6F3EC] to-[#D5ECE0] p-8 md:flex-row md:items-center">
          <div className="max-w-lg space-y-4">
            <h1 className="text-4xl font-black leading-tight text-[#246B4B] md:text-5xl">
              Good Food, <br /> Good Mood!
            </h1>
            <p className="text-gray-600">
              Order your favorite meals from top restaurants, delivered fast to your door.
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center gap-2 rounded-full bg-[#246B4B] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d573d]"
            >
              Order Now →
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
            alt="Featured meal"
            className="h-56 w-full rounded-2xl object-cover shadow-md md:w-80"
          />
        </section>

        {/* Browse by Category */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-[#246B4B] pl-3 text-xl font-bold text-gray-800">
              Browse by Category
            </h2>
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-sm font-semibold text-[#246B4B] hover:underline"
              >
                Clear filter ({selectedCategory})
              </button>
            ) : (
              <Link to="/restaurants" className="text-sm font-semibold text-[#246B4B] hover:underline">
                View All →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(active ? '' : cat)}
                  className={`rounded-2xl border p-3.5 text-center text-sm font-semibold transition ${
                    active
                      ? 'border-[#246B4B] bg-[#246B4B] text-white shadow-sm'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-emerald-200 hover:bg-emerald-50'
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
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-[#246B4B] pl-3 text-xl font-bold text-gray-800">
              Popular Foods
            </h2>
            <Link to="/restaurants" className="text-sm font-semibold text-[#246B4B] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {foods.map((food) => {
              const id = food.id || food._id;
              return (
                <div
                  key={id}
                  className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="relative mb-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => toggleFavorite(id)}
                        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm hover:text-red-500"
                      >
                        {favorites[id] ? '♥' : '♡'}
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900">{food.name}</h3>
                      <span className="shrink-0 text-sm font-extrabold text-[#246B4B]">
                        {Number(food.price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">{food.desc}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-amber-500">
                      ★ {(food.rating || 5.0).toFixed(1)}
                    </span>
                    <button
                      onClick={() => addItem(id, 1)}
                      className="rounded-lg bg-[#246B4B] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1d573d]"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}