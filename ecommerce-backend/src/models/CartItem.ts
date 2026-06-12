import { Schema, Types } from 'mongoose'; // Schema is used to define the structure of data in MongoDB
// Types is used to access MongoDB special types, especially Types.ObjectId. _id

export interface ICartItem { // ICartItem is only for TypeScript type checking. It does not create the MongoDB Schema by itself.
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  colorSelected: string;
  quantity: number;
}

export const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId, // This mean product must be an ObjectId; Ex: product: '6454ggsdfjs...'
      ref: 'Product',  // This tells Mongoose that this ObjectId refers to the Product model, so you can use populate.
      required: true,
    },
    colorSelected: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: true, // This is the schema options object. It means each cart_item will have its own _id.
  }
);
