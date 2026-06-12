import { SendMessageDto } from '../dtos/message.dto';
import { IMessage } from '../models/Message';
import { MessageRepository } from '../repositories/message.repository';

const messageRepository = new MessageRepository();

export const sendMessageService = async (dto: SendMessageDto | IMessage) => {
  const conversationId =
    'conversationId' in dto && dto.conversationId
      ? dto.conversationId
      : dto.receiverId === 'admin'
        ? dto.senderId
        : dto.receiverId;

  const message: IMessage = {
    conversationId,
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
