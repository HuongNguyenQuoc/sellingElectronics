import { CheckoutItemSchema, ICheckoutItem } from './CheckoutItem';
import { Schema } from 'mongoose';

export interface IOrderData {
    checkoutItems: ICheckoutItem[];
    totalAmount: number;
}

export const OrderDataSchema = new Schema<IOrderData>({
    checkoutItems: [CheckoutItemSchema],
    totalAmount: {
        type: Number,
        required: true
    }
});
