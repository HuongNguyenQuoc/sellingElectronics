import { Router } from "express";
import { restrictTo } from "../middlewares/Role.middleware";
import { getAllConversation, createOrUpdateConversation } from "../controllers/conversationController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', protect, restrictTo('admin'), getAllConversation);
router.post('/', protect, createOrUpdateConversation);

export default router;
