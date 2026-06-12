<<<<<<< HEAD
import { SendMessageDto } from '../dtos_data-transfer-object/message.dto';
import { MessageRepository } from '../repositories/message.repository';
=======
import { SendMessageDto } from '../dtos/message.dto';
>>>>>>> bb2dd1b (The basic features of the shopping cart on Fe and Be are now complete)
import { IMessage } from '../models/Message';
import { MessageRepository } from '../repositories/message.repository';

const messageRepository = new MessageRepository();
<<<<<<< HEAD
export const sendMessageService = async (data: IMessage) => {
    return messageRepository.createMessage(data);
}

export const getAllMessagesService = async(roomId:string) => {
    return messageRepository.getAllMessages(roomId)
}
=======
export const sendMessageService = async (dto: SendMessageDto) => {
  const ConversationId = dto.receiverId === 'admin' ? dto.senderId : dto.receiverId;
  const message: IMessage = {
    conversationId: ConversationId,
    senderId: dto.senderId,
    receiverId: dto.receiverId,
    content: dto.content,
    type: dto.type, // "ask", "shipped"
    productId: dto.productId,
    orderData: dto.orderData,
  };
  return messageRepository.createMessage(message);
};
>>>>>>> bb2dd1b (The basic features of the shopping cart on Fe and Be are now complete)
