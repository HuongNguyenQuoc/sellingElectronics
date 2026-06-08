import { IOrderData } from "../models/OrderData";

export interface SendMessageDto {
  senderId: string;
  receiverId: string;
  content?: string;
  type:string; // "ask", "shipped"
  productId?: string; // Optional
  orderData?: IOrderData
}