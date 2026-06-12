import mongoose, { Schema, Types } from 'mongoose';
import { ICartItem, CartItemSchema } from './CartItem';

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
}

const CartSchema = new Schema<ICart>( // CartSchema tells this is how the cart document should be stored in the db.
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // This means every cart must have a user
      unique: true, // This means one user can have only one cart
      index: true, // This creates an index for the user field, it helps this query run faster:
      /*
        Cart.findOne({ user: userId })
      */
    },
    items: {
      type: [CartItemSchema],
      default: []
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>('Cart',  CartSchema) // Cart is the thing when you use to query CRUD in MGDB. -> It's the mongoose model.