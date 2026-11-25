import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Food from "../models/Food.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const {
      userId = "guest",
      customerName,
      phone,
      address,
      note = "",
      paymentMethod = "COD",
    } = req.body;

    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items : [];

    if (!customerName || !phone || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin nhận hàng" });
    }
    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Giỏ hàng đang trống" });
    }

    // 1. Lấy restaurantId từ món ăn đầu tiên trong giỏ hàng
    const firstFood = await Food.findById(items[0].foodId);
    if (!firstFood || !firstFood.restaurantId) {
      return res
        .status(400)
        .json({ success: false, message: "Không xác định được nhà hàng của món ăn" });
    }

    // 2. Đảm bảo userId đúng chuẩn ObjectId (hỗ trợ cả khi chưa đăng nhập)
    let validUserId;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      validUserId = userId;
    } else {
      const fallbackUser = await User.findOne();
      validUserId = fallbackUser ? fallbackUser._id : new mongoose.Types.ObjectId();
    }

    // 3. Chuẩn hóa phương thức thanh toán khớp với enum ["COD", "BANK_TRANSFER"]
    const normalizedPayment =
      paymentMethod === "COD" ? "COD" : "BANK_TRANSFER";

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal >= 100000 ? 0 : 15000;
    const orderCode = `SPX-${Date.now().toString().slice(-6)}`;

    const created = await Order.create({
      orderCode,
      userId: validUserId,
      restaurantId: firstFood.restaurantId,
      customerName,
      phone,
      address,
      note,
      paymentMethod: normalizedPayment,
      items,
      subtotal,
      shippingFee,
      total: subtotal + shippingFee,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: { ...created.toObject(), id: created.orderCode },
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