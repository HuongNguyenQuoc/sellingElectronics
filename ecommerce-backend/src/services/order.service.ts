import { CreateOrderDto } from "../dtos/order.dto";
import { OrderRepository } from "../repositories";
import { ProductRepository } from "../repositories/product.repository";
import { AppError } from "../common/exceptions/AppError";
import { ORDER_STATUSES, OrderStatus } from "../common/constants";
import { MessageRepository } from '../repositories/message.repository';


const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const messageRepository = new MessageRepository();

export const createOrderService = async (userId:string, dto: CreateOrderDto) => {
    const { items, shippingAddress, paymentMethod } = dto;

    let totalCost = 0;
    const orderItems =[];
    const checkoutItems = [];
    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      totalCost += product.price * item.quantity;

      //tranfer before create
      orderItems.push({
        product: item.productId,
        name: product.title,
        image: product.thumbnail,
        quantity: item.quantity,
        price: product.price,
        colorSelected: item.colorSelected
      });

      checkoutItems.push({
        productId: item.productId,
        title: product.title,
        thumbnail: product.thumbnail,
        colorSelected: item.colorSelected,
        quantity: item.quantity,
        price: item.price
      })
    }

    const newOrder = await orderRepository.create({
      userId: userId,
      items: orderItems,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      totalCost: totalCost
    });


    //save to Message
    // await messageRepository.createMessage({
    //     conversationId: userId,
    //     senderId: userId,
    //     receiverId: 'admin',
    //     orderData: {
    //       checkoutItems: checkoutItems,
    //       totalAmount: totalCost
    //     }
    // })


    return newOrder;
};

export const getOrderByIdService = async(orderId:string) =>{
    const order = await orderRepository.findById(orderId);
    if(!order) throw new AppError(404, 'Order not found');
    return order;
}

export const getAllOrdersService = async(userId:string) => {
    const orders = await orderRepository.findByUserId(userId);
    return orders
}

export const updateOrderStatusService = async(orderId:string, status: OrderStatus) => {
    if(!ORDER_STATUSES.includes(status)) throw new AppError(400,'Invalid order status');

    const order = await orderRepository.updateStatus(orderId,status);
    if(!order) throw new AppError(404,'Order not found');
    return order;
}

