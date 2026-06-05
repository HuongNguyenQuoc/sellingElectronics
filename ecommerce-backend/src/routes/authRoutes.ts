import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/authController';
//import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
