import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { getAllMessagesService } from '../services/message.service';

export const getAllMessages = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const result = await getAllMessagesService(req.user._id.toString());
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }};