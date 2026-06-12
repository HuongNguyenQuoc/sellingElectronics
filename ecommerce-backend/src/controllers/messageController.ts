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

    const result = await getAllMessagesService(req.params.id.toString());
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error get Messages', error });
  }};