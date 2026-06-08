import { Types } from 'mongoose';
import { IOrder, Order } from '../models/Order';

export class OrderRepository {
  // Get all order
  async findAll(): Promise<IOrder[]> {
    return await Order.find({}).populate('user').populate('items.product');
  }


  // Get order follow by ID
  async findById(id: string): Promise<IOrder | null> {
    return await Order.findById(id).populate('user').populate('items.product');
  }

  // Get orders of 1 user
  async findByUserId(userId: string): Promise<IOrder[]> {
    return await Order.find({ user: userId }).populate('items.product');
  }

  // Create new order
  async create(orderData: {
    userId: string;
    items: any[];
    paymentMethod: string;
    totalCost: number;
  }): Promise<IOrder> {
    return await Order.create(orderData);
  }

  // Update order (status, shipping address)
  async update(id: string, updateData: Partial<IOrder>): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('items.product');
  }

  // Delete Order
  async delete(id: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(id);
  }
}
