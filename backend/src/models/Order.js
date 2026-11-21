import mongoose from 'mongoose';

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

export default mongoose.model('Order', orderSchema);