import { IOrderData } from "../models/OrderData";

export interface SendMessageDto {
  conversationId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  orderData?: IOrderData;
}

// The browser is only allowed to choose the conversation (for an admin reply)
// and the message content. Sender/receiver identities are derived from the JWT.
export interface SendChatMessageDto {
  conversationId?: string;
  content?: string;
}
