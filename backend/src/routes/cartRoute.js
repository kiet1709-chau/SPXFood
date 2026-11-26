import express from 'express';
import { getCart, addToCart, updateCartItem } from '../controllers/cartController.js';

const router = express.Router();
router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:foodId', updateCartItem);

export default router;