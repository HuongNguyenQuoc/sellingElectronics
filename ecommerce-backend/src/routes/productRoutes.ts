import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  updateProduct,
} from '../controllers/productController';

const router = Router();

router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;
