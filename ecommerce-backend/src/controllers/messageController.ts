import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getAllMessagesService, sendMessageService } from '../services/message.service';

export const getAllMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const roomId = req.params.id.toString();
    const currentUserId = req.user._id.toString();

    // Buyers may only read their own support conversation. Admins can read the
    // selected buyer conversation.
    if (req.user.role !== 'admin' && roomId !== currentUserId) {
      return res.status(403).json({ message: 'You cannot read this conversation' });
    }

    const result = await getAllMessagesService(roomId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error get Messages', error });
  }
};
