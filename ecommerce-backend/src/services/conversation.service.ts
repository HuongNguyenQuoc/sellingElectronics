import { AppError } from '../common/exceptions/AppError';
import { IConversation } from '../models/Conversation';
import { ConversationRepository } from '../repositories/conversation.repository';
import { Types } from 'mongoose'

const conversationRepository = new ConversationRepository();

export const getAllConversationsService = async() => {
    return conversationRepository.getAllConversations();
}

export const createOrUpdateConversationService = async(data: Partial<IConversation>, userId: string) => {
    if(!data.lastMessage) throw new AppError(404,'Not Found Message');
    const conversation: IConversation = {
        participantId: new Types.ObjectId(userId),
        lastMessage: data.lastMessage,
        isAdminRead: false,
        isUserRead: true
    };
    return conversationRepository.createOrUpdateConversation(conversation);
}