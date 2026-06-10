import { AppError } from '../common/exceptions/AppError';
import { IProduct, IProductVariant } from '../models/Product';
import { ProductRepository } from '../repositories/product.repository';
export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(tag?: string): Promise<IProduct[]> {
    if (tag) {
      return await this.productRepository.findByTag(tag);
    }

    return await this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    return product;
  }

  async createProduct(productData: IProduct): Promise<IProduct> {
    this.validateProduct(productData);
    return await this.productRepository.create(productData);
  }

  async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct> {
    this.validateProductUpdate(updateData);

    const product = await this.productRepository.update(id, updateData);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    return product;
  }

  async deleteProduct(id: string): Promise<IProduct> {
    const product = await this.productRepository.delete(id);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    return product;
  }

  async checkStock(productId: string, color: string, quantity: number): Promise<boolean> {
    if (quantity <= 0) {
      throw new AppError(400, 'Quantity must be greater than 0');
    }

    const product = await this.getProductById(productId);
    const variant = product.variants.find(item => item.color === color);

    return Boolean(variant && variant.stock >= quantity);
  }

  async decreaseStock(productId: string, color: string, quantity: number): Promise<IProduct> {
    if (quantity <= 0) {
      throw new AppError(400, 'Quantity must be greater than 0');
    }

    const product = await this.getProductById(productId);
    const variants = product.variants.map(variant => ({ ...variant }));
    const variant = variants.find(item => item.color === color);

    if (!variant) {
      throw new AppError(404, 'Product variant not found');
    }

    if (variant.stock < quantity) {
      throw new AppError(400, 'Insufficient stock');
    }

    variant.stock -= quantity;
    return await this.updateProduct(productId, { variants });
  }

  async createManyProducts(productsData: IProduct[]): Promise<IProduct[]> {
    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new AppError(400, 'Products body must be a non-empty array');
    }
    productsData.forEach(product => this.validateProduct(product));
    return await this.productRepository.createMany(productsData);
  }

  private validateProduct(productData: IProduct): void {
    this.validatePrice(productData.price);
    this.validateDiscount(productData.discountPercentage);
    this.validateRating(productData.rating);
    //this.validateVariants(productData.variants);
    this.validateRequiredList(productData.tags, 'Product must have at least one tag');
    this.validateRequiredList(productData.images, 'Product must have at least one image');
  }

  private validateProductUpdate(updateData: Partial<IProduct>): void {
    if (updateData.price !== undefined) {
      this.validatePrice(updateData.price);
    }

    this.validateDiscount(updateData.discountPercentage);
    this.validateRating(updateData.rating);

    if (updateData.variants !== undefined) {
      this.validateVariants(updateData.variants);
    }

    if (updateData.tags !== undefined) {
      this.validateRequiredList(updateData.tags, 'Product must have at least one tag');
    }

    if (updateData.images !== undefined) {
      this.validateRequiredList(updateData.images, 'Product must have at least one image');
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new AppError(400, 'Price must be a positive number');
    }
  }

  private validateDiscount(discountPercentage?: number): void {
    if (discountPercentage === undefined) {
      return;
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new AppError(400, 'Discount percentage must be between 0 and 100');
    }
  }

  private validateRating(rating?: number): void {
    if (rating === undefined) {
      return;
    }

    if (rating < 0 || rating > 5) {
      throw new AppError(400, 'Rating must be between 0 and 5');
    }
  }

  private validateVariants(variants: IProductVariant[]): void {
    this.validateRequiredList(variants, 'Product must have at least one variant');

    const colors = variants.map(variant => variant.color.trim().toLowerCase());
    const uniqueColors = new Set(colors);

    if (uniqueColors.size !== colors.length) {
      throw new AppError(400, 'Product variant colors must be unique');
    }

    if (variants.some(variant => !variant.color.trim())) {
      throw new AppError(400, 'Variant color is required');
    }

    if (variants.some(variant => variant.stock < 0)) {
      throw new AppError(400, 'Stock must be a positive number');
    }
  }

  private validateRequiredList<T>(value: T[], message: string): void {
    if (!Array.isArray(value) || value.length === 0) {
      throw new AppError(400, message);
    }
  }
}
