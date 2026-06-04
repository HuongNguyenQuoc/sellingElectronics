import { Request, Response } from 'express';
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    
// TODO: Đang test, tí thêm phần user vào đây
    const { userId,items, shippingAddress, paymentMethod } = req.body;

    let totalCost = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }
      totalCost += product.price * item.quantity;
    }

    const newOrder = await Order.create({
      user: userId,
      items: items,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      totalCost: totalCost
    });
    res.status(201).json({message: 'Order created successfully'});

  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
// data test, tí sửa lại cho t
    const { userId } = req.body;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }};

export const getOrderById = async (req: Request, res: Response) => {
  try{
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: 'Order status updated successfully' });
  }catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }};