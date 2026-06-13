import { getAllConversationsService, createOrUpdateConversationService } from '../services/conversation.service';

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAllConversation = async(req:AuthRequest,res:Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({
            message: 'Unauthorized'
            });
        }
        
        const result = await getAllConversationsService();
        res.status(201).json(result);
    }catch(error){
        res.status(501).json({message: 'Error Server'});
    }
}

export const createOrUpdateConversation = async(req: AuthRequest,res:Response) => {
    try{
        if (!req.user) {
            return res.status(401).json({
            message: 'Unauthorized'
            });
        }
        
        const result = await createOrUpdateConversationService(req.body,req.user._id.toString());
        res.status(201).json(result);
    }catch(error){
        res.status(501).json("Not implemented from server");
    }
}