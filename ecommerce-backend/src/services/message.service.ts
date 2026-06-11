import { SendMessageDto } from '../dtos_data-transfer-object/message.dto';
import { MessageRepository } from '../repositories/message.repository';
import { Conversation } from '../models/Conversation';
import { IMessage } from '../models/Message';

const messageRepository = new MessageRepository();
export const sendMessageService = async (dto: SendMessageDto) => {
    const ConversationId = dto.receiverId==='admin'?dto.senderId: dto.receiverId;
    const message: IMessage = {
        conversationId : ConversationId,
        senderId: dto.senderId,
        receiverId: dto.receiverId,
        content: dto.content,
        orderData: dto.orderData
    }
    return messageRepository.createMessage(message);
}

export const getAllMessagesService = async(roomId:string) => {
    return messageRepository.getAllMessages(roomId)
}