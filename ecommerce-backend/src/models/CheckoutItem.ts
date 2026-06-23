import { Schema } from 'mongoose';

export interface ICheckoutItem {
    productId:string;
    title: string;
    thumbnail: string;
    colorSelected: string;
    quantity: number;
    price: number;
}

export const CheckoutItemSchema = new Schema<ICheckoutItem>({
    productId:{
        type:String,
        required:true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    colorSelected: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
