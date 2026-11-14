import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-xl">
              🥬
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">SPXFood</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="bg-green-500 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link to="/restaurants" className="text-gray-600 hover:text-green-600 flex items-center gap-2">
              🍴 Menu
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-green-600 flex items-center gap-2">
              🧾 Orders
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 flex items-center gap-2">
              ⓘ About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600 flex items-center gap-2">
              ✉ Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search for food..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
              onKeyDown={(e) => e.key === 'Enter' && navigate('/restaurants')}
            />
          </div>

          {/* Actions (Cart & Profile) */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:bg-green-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </Link>
            <div className="flex items-center gap-2 cursor-pointer border border-gray-200 p-1 pr-2 rounded-full hover:shadow-sm">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-12">
        <Outlet />
      </main>
    </div>
  );
}