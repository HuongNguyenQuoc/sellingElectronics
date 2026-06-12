import { SendMessageDto } from '../dtos_data-transfer-object/message.dto';
import { MessageRepository } from '../repositories/message.repository';
import { IMessage } from '../models/Message';

const messageRepository = new MessageRepository();
export const sendMessageService = async (data: IMessage) => {
    return messageRepository.createMessage(data);
}

export const getAllMessagesService = async(roomId:string) => {
    return messageRepository.getAllMessages(roomId)
}