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
        const conversations = await Conversation.find()
            .sort({ updatedAt: -1 })
            .populate({
                path: 'participantId',
                match: { role: { $ne: 'admin' } }
            });

        // Old invalid records may point at an admin account. The populate
        // filter turns those participants into null, so do not expose them.
        return conversations.filter(conversation => conversation.participantId);
    }

}
