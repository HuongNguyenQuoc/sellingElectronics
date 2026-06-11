import { Router } from 'express';
import { createOrder, getAllOrders, getOrderById ,updateOrderStatus } from '../controllers/orderController';

import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Create a new order
router.post('/', protect, createOrder);

// Get all orders
router.get('/my-orders', protect, getAllOrders);

// Get a specific order
router.get('/:id', protect, getOrderById);

// Update order status
router.patch('/:id/status',protect,updateOrderStatus);

export default router;