import { IOrderData } from "../models/OrderData";

export interface SendMessageDto {
  senderId: string;
  receiverId: string;
  content?: string;
  orderData?: IOrderData
}