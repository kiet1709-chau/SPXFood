import { createContext, useContext, useEffect, useState } from 'react';
import { addToCartApi, getCart, updateCartItemApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const auth = useAuth();
  const user = auth?.user;

  const refreshCart = async () => {
    if (!user && !localStorage.getItem('spxfood_user')) {
      setItems([]);
      setTotalAmount(0);
      return;
    }

    const data = await getCart();
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const requireLogin = () => {
    const isLoggedIn = Boolean(user || localStorage.getItem('spxfood_user'));
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để đặt món ăn!');
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const addItem = async (foodId, quantity = 1) => {
    if (!requireLogin()) return;

    const data = await addToCartApi(foodId, quantity);
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    if (!requireLogin()) return;

    const data = await updateCartItemApi(foodId, quantity);
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalAmount, totalCount, addItem, updateQuantity, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);