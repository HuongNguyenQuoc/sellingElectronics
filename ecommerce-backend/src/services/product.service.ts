import { ProductRepository } from "../repositories/product.repository";
import { IProduct, ProductDocument } from "../models/Product";
import { AppError } from "../common/exceptions/AppError";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository;
  }

  // Get all products
  async getAllProducts(): Promise<ProductDocument[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<ProductDocument> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new AppError(404, 'Product not found');
    return product;
  }

  // Get product follow by category
  async getProductsByCategory(category: string): Promise<ProductDocument[]> {
    return await this.productRepository.findByCategory(category);
  }

  // Create new product
  async createProduct(productData: {
    name: string,
    description: string,
    price: number,
    category: string,
    brand: string,
    stock: number,
    images?: string[],
    specs?: Map<string, string>;
  }): Promise<ProductDocument> {
    if (productData.price < 0) throw new AppError(400, 'Price must be a positive number');
    if (productData.stock < 0) throw new AppError(400, 'Stock must be a positive number');
    return await this.productRepository.create(productData);
  }

  // Update product
  async updateProduct(
    id: string,
    updateData: Partial<IProduct>
  ): Promise<ProductDocument> {
    if (updateData.price !== undefined && updateData.price < 0) {
      throw new AppError(400, 'Price must be a positive number');
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      throw new AppError(400, 'Stock must be a positive number');
    }

    const product = await this.productRepository.update(id, updateData);
    if (!product) throw new AppError(404, 'Product not found');
    return product;
  }

  // Delete product
  async deleteProduct(id: string): Promise<ProductDocument> {
    const product = await this.productRepository.delete(id);
    if (!product) throw new AppError(404, 'Product not found');
    return product;
  }

  // Check if there is enough stock
}