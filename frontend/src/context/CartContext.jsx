import { createContext, useContext, useEffect, useState } from 'react';
import { addToCartApi, getCart, updateCartItemApi } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const refreshCart = async () => {
    const data = await getCart();
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addItem = async (foodId, quantity = 1) => {
    const data = await addToCartApi(foodId, quantity);
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  const updateQuantity = async (foodId, quantity) => {
    const data = await updateCartItemApi(foodId, quantity);
    if (data.success) {
      setItems(data.items);
      setTotalAmount(data.totalAmount);
    }
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, totalAmount, totalCount, addItem, updateQuantity, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);