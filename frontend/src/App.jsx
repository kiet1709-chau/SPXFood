import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import MenuPage from './pages/MenuPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Thanh điều hướng chứa Logo, Menu, Giỏ hàng và nút Tài khoản góc phải */}
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id/menu" element={<MenuPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Điều hướng về Trang chủ nếu nhập sai đường dẫn */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}