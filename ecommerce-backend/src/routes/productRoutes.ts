import { Router } from 'express';
import { restrictTo } from '../middlewares/Role.middleware';
import { protect } from '../middlewares/authMiddleware';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  updateProduct,
} from '../controllers/productController';

const router = Router();

router
  .route('/').get(getAllProducts).post(protect, restrictTo('admin'), createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, restrictTo('admin'), updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

export default router;
