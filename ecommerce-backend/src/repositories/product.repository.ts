import { Product, IProduct } from '../models/Product';

export class ProductRepository {
  async findAll(): Promise<IProduct[]> {
    return await Product.find({});
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async findByTag(tag: string): Promise<IProduct[]> {
    return await Product.find({ tags: tag });
  }

  async create(productData: IProduct): Promise<IProduct> {
    return await Product.create(productData);
  }

  async update(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id);
  }

  async createMany(productsData: IProduct[]): Promise<IProduct[]> {
    return await Product.insertMany(productsData);
  }
}
