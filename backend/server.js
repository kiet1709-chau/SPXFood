import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==================== 1. MONGOOSE SCHEMAS ====================
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  deliveryTime: { type: String, default: '20-30 phút' },
  category: { type: String, required: true },
  address: { type: String, required: true }
});

const foodSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  desc: { type: String, default: '' },
  popular: { type: Boolean, default: false },
  image: { type: String, default: '' }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 }
    }
  ]
});

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true },
    userId: { type: String, default: 'guest' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String, default: '' },
    paymentMethod: { type: String, default: 'COD' },
    items: [
      {
        foodId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        image: String,
        quantity: Number
      }
    ],
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    status: { type: String, default: 'PENDING' }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Food = mongoose.model('Food', foodSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);

// ==================== 2. TỰ ĐỘNG TẠO DỮ LIỆU MẪU LẦN ĐẦU ====================
async function seedInitialData() {
  const count = await Restaurant.countDocuments();
  if (count > 0) return;

  const createdRestaurants = await Restaurant.insertMany([
    {
      name: 'Green Bowl Kitchen',
      rating: 4.9,
      deliveryTime: '20-30 phút',
      category: 'Rice',
      address: '123 Nguyễn Văn Cừ, Cần Thơ'
    },
    {
      name: 'Pizza & Burger House',
      rating: 4.8,
      deliveryTime: '25-35 phút',
      category: 'Pizza',
      address: '45 Mậu Thân, Cần Thơ'
    },
    {
      name: 'Zen Noodle & Salad',
      rating: 4.7,
      deliveryTime: '15-25 phút',
      category: 'Noodle',
      address: '88 Trần Hưng Đạo, Cần Thơ'
    }
  ]);

  const [r1, r2, r3] = createdRestaurants;

  await Food.insertMany([
    {
      restaurantId: r1._id,
      name: 'Grilled Chicken Rice Bowl',
      category: 'Rice',
      price: 45000,
      rating: 5.0,
      desc: 'Grilled chicken, cucumber, tomato, steamed rice',
      popular: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
    },
    {
      restaurantId: r2._id,
      name: 'Supreme Pizza',
      category: 'Pizza',
      price: 60000,
      rating: 5.0,
      desc: 'With pepperoni, cheese, fresh herbs',
      popular: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    },
    {
      restaurantId: r3._id,
      name: 'Chicken Noodle Soup',
      category: 'Noodle',
      price: 50000,
      rating: 5.0,
      desc: 'With chicken, vegetables, rich broth',
      popular: true,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'
    },
    {
      restaurantId: r3._id,
      name: 'Caesar Salad',
      category: 'Salad',
      price: 35000,
      rating: 5.0,
      desc: 'Fresh lettuce, chicken, parmesan',
      popular: true,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    },
    {
      restaurantId: r2._id,
      name: 'Cheese Burger',
      category: 'Burger',
      price: 45000,
      rating: 5.0,
      desc: 'Juicy beef, melted cheese, brioche bun',
      popular: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    },
    {
      restaurantId: r1._id,
      name: 'Chocolate Cake',
      category: 'Dessert',
      price: 25000,
      rating: 5.0,
      desc: 'Rich chocolate cake slice',
      popular: true,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
    }
  ]);

  console.log('Đã khởi tạo dữ liệu mẫu vào MongoDB (spxfood)!');
}

// ==================== 3. ROUTES API ====================
app.get('/api/restaurants', async (req, res) => {
  try {
    const { q = '', category = '' } = req.query;
    const filter = {};
    if (q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { address: { $regex: q.trim(), $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    const docs = await Restaurant.find(filter);
    const data = docs.map((d) => ({ ...d.toObject(), id: d._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/foods', async (req, res) => {
  try {
    const { q = '', category = '', restaurantId = '', popular = '' } = req.query;
    const filter = {};
    if (q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: 'i' } },
        { desc: { $regex: q.trim(), $options: 'i' } },
        { category: { $regex: q.trim(), $options: 'i' } }
      ];
    }
    if (category && category !== 'All') {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }
    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }
    if (popular === 'true') {
      filter.popular = true;
    }

    const docs = await Food.find(filter);
    const data = docs.map((d) => ({ ...d.toObject(), id: d._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const userId = req.query.userId || 'guest';
    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items : [];
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, items, totalAmount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/cart/items', async (req, res) => {
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
});

app.patch('/api/cart/items/:foodId', async (req, res) => {
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
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId = 'guest', customerName, phone, address, note = '', paymentMethod = 'COD' } = req.body;
    const cart = await Cart.findOne({ userId });
    const items = cart ? cart.items : [];

    if (!customerName || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ' });
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
});

app.get('/api/orders', async (req, res) => {
  const data = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
});

// ==================== 4. KHỞI ĐỘNG SERVER ====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Đã kết nối MongoDB Atlas thành công!');
    await seedInitialData();
    app.listen(PORT, () => console.log(`SPXFood API running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err.message));