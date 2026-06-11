import { Router } from 'express';
import { getAllMessages} from '../controllers/messageController';

import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/',protect,getAllMessages)