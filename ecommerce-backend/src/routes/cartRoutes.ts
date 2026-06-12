import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  addCartItem,
  clearMyCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController';

const router = Router();

router.use(protect);

router.get('/', getMyCart);
router.post('/items', addCartItem);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearMyCart);

export default router;
