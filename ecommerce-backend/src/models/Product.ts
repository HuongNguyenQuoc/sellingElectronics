import mongoose, { HydratedDocument, Schema } from 'mongoose';

export interface IProductVariant {
  color: string;
  stock: number;
}

export interface IProduct {
  title: string;
  description: string;
  price: number;
  variants: IProductVariant[];
  tags: string[];
  brandName: string;
  images: string[];
  thumbnail: string;
  discountPercentage?: number;
  rating?: number;
  weight?: number;
  dimensions?: {
    first: string;
    second: string;
  };
  warrantyInformation?: string;
  reviews?: unknown[];
  specs?: Map<string, string>;
}

const hasItems = <T>(value: T[]): boolean => Array.isArray(value) && value.length > 0;

const productVariantSchema = new Schema<IProductVariant>(
  {
    color: {
      type: String,
      required: [true, 'Please add a variant color'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please add variant stock'],
      min: [0, 'Stock must be a positive number'],
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Please add a product title'],
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
    variants: {
      type: [productVariantSchema],
      required: [true, 'Please add product variants'],
      validate: {
        validator: hasItems,
        message: 'Product must have at least one variant',
      },
    },
    tags: {
      type: [{ type: String, trim: true }],
      required: [true, 'Please add product tags'],
      validate: {
        validator: hasItems,
        message: 'Product must have at least one tag',
      },
    },
    brandName: {
      type: String,
      required: [true, 'Please add a product brand name'],
      trim: true,
    },
    images: {
      type: [{ type: String, trim: true }],
      required: [true, 'Please add product images'],
      validate: {
        validator: hasItems,
        message: 'Product must have at least one image',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Please add a product thumbnail'],
      trim: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage must be a positive number'],
      max: [100, 'Discount percentage cannot be greater than 100'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be a positive number'],
      max: [5, 'Rating cannot be greater than 5'],
    },
    weight: {
      type: Number,
      default: 0,
      min: [0, 'Weight must be a positive number'],
    },
    dimensions: {
      first: {
        type: String,
        default: '',
        trim: true,
      },
      second: {
        type: String,
        default: '',
        trim: true,
      },
    },
    warrantyInformation: {
      type: String,
      default: '',
      trim: true,
    },
    reviews: {
      type: [Schema.Types.Mixed],
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

productSchema.index({ tags: 1 });
productSchema.index({ brandName: 1 });
productSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
