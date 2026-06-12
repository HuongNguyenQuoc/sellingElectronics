import { IMessage, Message } from '../models/Message';

export class MessageRepository {
  async createMessage(data: IMessage) {
    return Message.create(data);
  }

  async getAllMessages(roomId: string): Promise<IMessage[]> {
    return Message.find({ conversationId: roomId });
  }
}
