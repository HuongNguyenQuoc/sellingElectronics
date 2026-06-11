import { Schema, model } from 'mongoose';
import { IOrderData, OrderDataSchema } from './OrderData';

export interface IMessage {
    // _id tự sinh
    conversationId: string; // ID của cuộc trò chuyện mà tin nhắn này thuộc về
    senderId: string;
    receiverId: string;
    content?: string;
    orderData?: IOrderData; // Thêm trường orderData vào IMessage, có thể null nếu không phải tin nhắn liên quan đến đơn hàng
    // timestamps: true tự động tạo createdAt và updatedAt
}

const MessageSchema = new Schema<IMessage>({
    conversationId: {
        type: String,
        required: true
    },
    senderId: { 
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    orderData: OrderDataSchema
}, {
    timestamps: true
});

export const Message = model<IMessage>('Message', MessageSchema);