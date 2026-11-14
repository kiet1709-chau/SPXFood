import React from 'react';
import { Link } from 'react-router-dom';
export default function Cart() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-sky-700 mb-4">Giỏ hàng của bạn</h1>
      <Link to="/checkout" className="bg-sky-500 text-white px-4 py-2 rounded-lg">Tiến hành thanh toán</Link>
    </div>
  );
}