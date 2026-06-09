import { CreateOrderDto } from "../dtos/order.dto";
import { OrderRepository } from "../repositories";
import { ProductRepository } from "../repositories/product.repository";

//const Order = require('../models/orderModel');
//const Product = require('../models/productModel');

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

export const createOrderService = async (dto: CreateOrderDto) => {
    const { userId, items, paymentMethod } = dto;

    let totalCost = 0;
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      totalCost += product.price * item.quantity;
    }

    const newOrder = await orderRepository.create({
      userId: userId,
      items: items,
      paymentMethod: paymentMethod,
      totalCost: totalCost
    });
    return newOrder;
};