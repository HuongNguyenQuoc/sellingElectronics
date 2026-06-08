import { SendMessageDto } from '../dtos_data-transfer-object/message.dto';
import { Message, IMessage } from '../models/Message';
import { Conversation } from '../models/Conversation';

export class MessageRepository {
    async createMessage(data: IMessage) {
        return Message.create(data);
    }
}