import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { userId = 'guest', customerName, phone, address, note = '', paymentMethod = 'COD' } = req.body;
    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items : [];

    if (!customerName || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin nhận hàng' });
    }
    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống' });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 100000 ? 0 : 15000;
    const orderCode = `SPX-${Date.now().toString().slice(-6)}`;

    const created = await Order.create({
      orderCode,
      userId,
      customerName,
      phone,
      address,
      note,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: { ...created.toObject(), id: created.orderCode }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const data = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};