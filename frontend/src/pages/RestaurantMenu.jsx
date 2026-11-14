import React from 'react';
import { useParams } from 'react-router-dom';
export default function RestaurantMenu() {
  const { id } = useParams();
  return <h1 className="text-2xl font-bold text-sky-700">Trang Thực đơn của nhà hàng ID: {id}</h1>;
}