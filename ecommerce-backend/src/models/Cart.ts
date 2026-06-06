import mongoose, { Types } from "mongoose";
import { CartItemSchema } from "./CartItem";

export interface ICart {
    userId: string;
    items: Types.ObjectId[]; // Array of CartItem IDs
}

const CartSchema = new mongoose.Schema<ICart>({
    userId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    items: [ CartItemSchema ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICart>('Cart', CartSchema);