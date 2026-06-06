import mongoose, { HydratedDocument, Schema } from 'mongoose';
export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  images?: string[];
  specs?: Map<string, string>;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a product brand'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please add a product stock quantity'],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);