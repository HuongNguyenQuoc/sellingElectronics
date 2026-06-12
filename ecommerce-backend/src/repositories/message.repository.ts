import { IMessage, Message } from '../models/Message';

export class MessageRepository {
<<<<<<< HEAD
    async createMessage(data: IMessage) {
        return Message.create(data);
    }

    async getAllMessages(roomId:string): Promise<IMessage[]> {
        return Message.find({conversationId: roomId});
    }
}
=======
  async createMessage(data: IMessage) {
    return Message.create(data);
  }
}
>>>>>>> bb2dd1b (The basic features of the shopping cart on Fe and Be are now complete)
