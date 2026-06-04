import mongoose, { Types } from 'mongoose';

export interface ICartItem{
    product: Types.ObjectId;
    quantity: number;
}

const CartItemSchema = new mongoose.Schema<ICartItem>({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    }
});

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);