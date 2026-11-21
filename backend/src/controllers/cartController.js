import Cart from '../models/Cart.js';
import Food from '../models/Food.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items : [];
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, items, totalAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId = 'guest', foodId, quantity = 1 } = req.body;
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ success: false, message: 'Không tìm thấy món ăn' });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existing = cart.items.find((i) => String(i.foodId) === String(food._id));
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: Number(quantity)
      });
    }

    await cart.save();
    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, items: cart.items, totalAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId = 'guest', quantity } = req.body;
    const { foodId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: true, items: [], totalAmount: 0 });

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((i) => String(i.foodId) !== String(foodId));
    } else {
      const target = cart.items.find((i) => String(i.foodId) === String(foodId));
      if (target) target.quantity = Number(quantity);
    }

    await cart.save();
    const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, items: cart.items, totalAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};