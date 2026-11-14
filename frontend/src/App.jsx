import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Layout dùng chung
import Layout from './components/Layout';

// Import các trang
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout sẽ bọc bên ngoài tất cả các trang con */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="restaurants" element={<RestaurantList />} />
          <Route path="restaurant/:id" element={<RestaurantMenu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}