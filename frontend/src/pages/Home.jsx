import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Pizza', icon: '🍕' },
  { id: 2, name: 'Burger', icon: '🍔' },
  { id: 3, name: 'Noodle', icon: '🍜' },
  { id: 4, name: 'Rice', icon: '🍚' },
  { id: 5, name: 'Sushi', icon: '🍣' },
  { id: 6, name: 'Salad', icon: '🥗' },
  { id: 7, name: 'Drink', icon: '🥤' },
  { id: 8, name: 'Dessert', icon: '🍰' },
];

const popularFoods = [
  { id: 1, name: 'Supreme Pizza', desc: 'With pepperoni, cheese...', rating: 5.0, price: '$60.00', image: 'https://placehold.co/200x150/ffffff/22c55e?text=Pizza' },
  { id: 2, name: 'Chicken Noodle Soup', desc: 'With chicken, vegetables...', rating: 5.0, price: '$50.00', image: 'https://placehold.co/200x150/ffffff/22c55e?text=Noodle' },
  { id: 3, name: 'Caesar Salad', desc: 'Fresh lettuce, chicken...', rating: 5.0, price: '$15.00', image: 'https://placehold.co/200x150/ffffff/22c55e?text=Salad' },
  { id: 4, name: 'Cheese Burger', desc: 'Juicy beef, cheese...', rating: 5.0, price: '$45.00', image: 'https://placehold.co/200x150/ffffff/22c55e?text=Burger' },
  // Bỏ bớt món thứ 5 để nhường chỗ cho thẻ Promo "Free Delivery" như trong ảnh
];

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[#e8f5e9] rounded-[2.5rem] p-10 lg:p-16 mb-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        <div className="max-w-lg z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1b5e20] leading-tight mb-4">
            Good Food,<br />Good Mood!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Order your favorite meals, delivered to your door.
          </p>
          <Link to="/restaurants" className="bg-[#1b5e20] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-green-800 transition-all inline-flex items-center gap-2">
            Order Now 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* Placeholder cho hình ảnh lớn bên phải */}
        <div className="relative mt-8 md:mt-0 z-10 flex-shrink-0">
          <div className="w-64 h-64 lg:w-96 lg:h-96 bg-green-200 rounded-full flex items-center justify-center text-6xl shadow-xl border-8 border-white border-opacity-50">
            🥗
          </div>
          {/* Badge nổi Delicious & Fresh */}
          <div className="absolute top-10 -right-4 lg:-right-12 bg-[#e6ee9c] text-[#33691e] px-6 py-4 rounded-2xl shadow-lg transform rotate-6 font-bold text-xl">
            Delicious<br />& Fresh
          </div>
        </div>

        {/* Các mảng trang trí nền */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#c8e6c9] to-transparent opacity-50 rounded-l-[100%] pointer-events-none"></div>
      </div>

      {/* Browse by Category */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Browse by Category</h2>
          </div>
          <Link to="/categories" className="text-green-600 font-semibold hover:text-green-800 flex items-center gap-1 text-sm">
            View All 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-gray-100">
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Foods */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Popular Foods</h2>
          </div>
          <Link to="/restaurants" className="text-green-600 font-semibold hover:text-green-800 flex items-center gap-1 text-sm">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Card Món Ăn */}
          {popularFoods.map((food) => (
            <div key={food.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col relative group">
              <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              
              <div className="h-32 mb-4 overflow-hidden rounded-2xl flex items-center justify-center">
                <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg">{food.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{food.desc}</p>
              
              <div className="mt-auto flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                  <span className="text-yellow-400">★</span> {food.rating}
                </div>
                <div className="font-extrabold text-green-600 text-lg">{food.price}</div>
              </div>
              
              <button className="w-full bg-green-500 text-white font-semibold py-2 rounded-xl hover:bg-green-600 transition-colors">
                Add to cart
              </button>
            </div>
          ))}

          {/* Thẻ Promo Khuyến Mãi (Cột thứ 5) */}
          <div className="bg-[#e8f5e9] rounded-3xl p-6 shadow-sm border border-green-100 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
              📍
            </div>
            <div className="text-6xl mb-4 mt-8 text-center">🛵</div>
            <div>
              <h3 className="font-extrabold text-xl text-[#1b5e20] mb-1">Free Delivery</h3>
              <p className="text-sm text-gray-600 mb-4">for orders over $30</p>
              <button className="bg-[#1b5e20] text-white font-semibold px-5 py-2 rounded-full hover:bg-green-800 transition-all w-fit flex items-center gap-2 text-sm">
                Order Now 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}