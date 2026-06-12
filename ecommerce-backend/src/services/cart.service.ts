import { Types } from 'mongoose';
import { AppError } from '../common/exceptions/AppError';
import { AddCartItemDto, UpdateCartItemDto } from '../dtos/cart.dto';
import { ProductRepository } from '../repositories';
import { CartRepository } from '../repositories/cart.repository';

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  private validateQuantity(quantity: number): number {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError(400, 'Quantity must be a positive integer');
    }
    return quantity;
  }

  async getCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      await this.cartRepository.createForUser(userId);
      cart = await this.cartRepository.findByUserId(userId);
    }
    return cart;
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const quantity = this.validateQuantity(dto.quantity);

    if (!Types.ObjectId.isValid(dto.productId)) {
      throw new AppError(400, 'Invalid product id');
    }

    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new AppError(404, 'Product not found');
    }

    const variant = product.variants.find(item => item.color === dto.colorSelected);

    if (!variant) throw new AppError(404, 'Product variant not found');

    let cart = await this.cartRepository.findRawByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createForUser(userId);
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === dto.productId && item.colorSelected === dto.colorSelected
    );

    const nextQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (nextQuantity > variant.stock) {
      throw new AppError(400, `Only ${variant.stock} items available in stock`);
    }

    if (existingItem) {
      existingItem.quantity = nextQuantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(dto.productId),
        colorSelected: dto.colorSelected,
        quantity,
      });
    }

    await this.cartRepository.save(cart);
    return await this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const quantity = this.validateQuantity(dto.quantity);

    const cart = await this.cartRepository.findRawByUserId(userId);
    if (!cart) {
      throw new AppError(404, 'Cart not found');
    }

    const item = cart.items.find(cartItem => cartItem._id?.toString() === itemId);
    if (!item) throw new AppError(404, 'Cart item not found');

    const product = await this.productRepository.findById(item.product.toString());
    if (!product) throw new AppError(404, 'Product not found');

    const variant = product.variants.find(
      productVariant => productVariant.color === item.colorSelected
    );
    if (!variant) throw new AppError(400, 'Product variant not found');
    if (quantity > variant.stock)
      throw new AppError(400, `Only ${variant.stock} items available in stock`);

    item.quantity = quantity;
    await this.cartRepository.save(cart); // If without save(cart) we just changed the cart in MEMORY, not in MongoDB yet.

    return await this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.cartRepository.findRawByUserId(userId);
    if (!cart) throw new AppError(404, 'Cart not found');

    const itemIndex = cart.items.findIndex(
      item => item._id?.toString() === itemId
    );

    if (itemIndex === -1) throw new AppError(404, 'Cart item not found');

    cart.items.splice(itemIndex, 1);
    await this.cartRepository.save(cart);

    return await this.getCart(userId);
  }

  async clearCart(userId: string) {
    return await this.cartRepository.clear(userId);
  }
}
