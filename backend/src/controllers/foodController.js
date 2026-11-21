import Food from '../models/Food.js';

export const getFoods = async (req, res) => {
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
    if (restaurantId) filter.restaurantId = restaurantId;
    if (popular === 'true') filter.popular = true;

    const docs = await Food.find(filter);
    const data = docs.map((d) => ({ ...d.toObject(), id: d._id }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};