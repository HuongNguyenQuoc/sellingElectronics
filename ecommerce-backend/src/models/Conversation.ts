import { model, Schema } from 'mongoose';

export interface IConversation {
    //_id tự sinh
    participantId:string;
    lastMessage: string;
    isAdminRead:boolean;
    isUserRead:boolean;
    //để timestamps: true ở dưới nó tự động tạo createdAt và updatedAt rồi 
}

const ConversationSchema = new Schema<IConversation>({
    participantId: {
        type: String,
        required: true
    },
    lastMessage: {
        type: String,
        required: true
    },
    isAdminRead: {
        type: Boolean,
        default: false
    },
    isUserRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Conversation = model<IConversation>('Conversation', ConversationSchema);