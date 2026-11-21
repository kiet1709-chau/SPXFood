import mongoose from 'mongoose';

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

export default mongoose.model('Food', foodSchema);