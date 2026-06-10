import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  createManyProducts
} from '../controllers/productController';
import { restrictTo } from '../middlewares/Role.middleware';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .get(getAllProducts)
  .post(protect, restrictTo('admin'), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, restrictTo('admin'), updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

router
  .route('/bulk')
  .post(protect, restrictTo('admin'), createManyProducts);

export default router;
