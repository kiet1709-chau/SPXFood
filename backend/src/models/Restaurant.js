import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, default: 5.0 },
  deliveryTime: { type: String, default: '20-30 phút' },
  category: { type: String, required: true },
  address: { type: String, required: true }
});

export default mongoose.model('Restaurant', restaurantSchema);