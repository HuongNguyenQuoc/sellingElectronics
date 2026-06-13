import { Conversation, IConversation } from '../models/Conversation';

export class ConversationRepository{
    async createOrUpdateConversation(conversation: IConversation) {
        return Conversation.findOneAndUpdate(
                { participantId: conversation.participantId },
                conversation,
                {
                    new: true,      // get document after update
                    upsert: true,   // create new when not findd
                }
            );
        }

    async getAllConversations(){
        return await Conversation.find().populate('participantId');
    }

}

