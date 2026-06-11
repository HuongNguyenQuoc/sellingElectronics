import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { createOrderService, getAllOrdersService, getOrderByIdService, updateOrderStatusService } from '../services/order.service'
import { OrderStatus } from '../common/constants/order.constants';
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
// TODO: Đang test, tí thêm phần user vào đây

    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const result = await createOrderService(req.user._id.toString(),req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
// data test, tí sửa lại cho t
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const result = await getAllOrdersService(req.user._id.toString())
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }};

export const getOrderById = async (req: Request, res: Response) => {
  try{
    const result = await getOrderByIdService(req.params.id.toString())
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

  export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body; 

    const order = await updateOrderStatusService( id, status as OrderStatus );

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  };