import { SendMessageDto } from '../dtos/message.dto';
import { MessageRepository } from '../repositories/message.repository';
import { IMessage } from '../models/Message';

const messageRepository = new MessageRepository();

export const sendMessageService = async (dto: SendMessageDto | IMessage) => {
  const message: IMessage = {
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    receiverId: dto.receiverId,
    content: dto.content,
    orderData: dto.orderData,
  };

  return messageRepository.createMessage(message);
};

export const getAllMessagesService = async (roomId: string) => {
  return messageRepository.getAllMessages(roomId);
};
