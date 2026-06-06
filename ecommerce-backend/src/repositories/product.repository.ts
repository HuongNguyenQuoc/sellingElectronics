import { IProduct, Product, ProductDocument } from '../models/Product';

export class ProductRepository {
  // Get all products
  async findAll(): Promise<ProductDocument[]> {
    return await Product.find({});
  }

  // Get product follow by ID
  async findById(id: string): Promise<ProductDocument | null> {
    return await Product.findById(id);
  }

  // Get products follow by category
  async findByCategory(category: string): Promise<ProductDocument[]> {
    return await Product.find({ category });
  }

  // Create new product
  async create(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    stock: number;
    images?: string[];
    specs?: Map<string, string>;
  }): Promise<ProductDocument> {
    return await Product.create(productData);
  }

  // Update product
  async update(id: string, updateData: Partial<IProduct>): Promise<ProductDocument | null> {
    return await Product.findByIdAndUpdate(
      id, // documentId
      updateData, // data to update
      { //optional settings
        new: true, // return new document
        runValidators: true, // validate update data against the schema before saving
      }
    );
  }

  // Delete product
  async delete(id: string): Promise<ProductDocument | null> {
    return await Product.findByIdAndDelete(id);
  }
}
