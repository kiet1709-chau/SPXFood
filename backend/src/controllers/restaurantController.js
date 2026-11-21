import Restaurant from '../models/Restaurant.js';

export const getRestaurants = async (req, res) => {
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
};