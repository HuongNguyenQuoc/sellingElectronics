import { IOrder, Order } from '../models/Order';

export class OrderRepository {
  // Get all order
  async findAll(): Promise<IOrder[]> {
    return await Order.find({}).populate('user').populate('items.product');
  }


  // Get order follow by ID
  async findById(id: string): Promise<IOrder | null> {
    return await Order.findById(id).populate('items.product');
  }

  // Get orders of 1 user
  async findByUserId(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId: userId }).populate('items.product');
  }

  // Create new order
  async create(orderData: {
    userId: string;
    items: any[];
    paymentMethod: string;
    shippingAddress: any;
    totalCost: number;
  }): Promise<IOrder> {
    return await Order.create(orderData);
  }

  // Update order (status, shipping address)
  async updateStatus(id: string, status: string) {
    return await Order.findByIdAndUpdate(
      id, { status },
      { new: true, runValidators: true }
    ).populate('items.product');
  }

  // Delete Order
  async delete(id: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(id);
  }
}
