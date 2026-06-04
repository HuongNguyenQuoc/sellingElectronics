import route from 'express';
const router = route.Router();
const { createOrder, getAllOrders, getOrderById ,updateOrderStatus } = require('../controllers/orderController');


// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: Đang test nên chưa qua middleware

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/my-orders', getAllOrders);

// Get a specific order
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status',updateOrderStatus);

module.exports = router;