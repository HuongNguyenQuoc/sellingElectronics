import mongoose, { Schema,Model,Types } from 'mongoose';
import { IOrderItem, OrderItemSchema } from './OrderItem';
import { IShippingAddress, ShippingAddressSchema } from './ShippingAddress';
import { OrderStatus } from './OrderStatus';

// all item when buying
export interface IOrder{
    userId: string;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    status: OrderStatus;      
    paymentMethod: string;    // NOTEEEEEEEEEEEEEE
    totalCost: number;         
}

const OrderSchema = new Schema<IOrder>({
    userId: { 
        type: String,
        required: true
    },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    status: { 
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PROCESSING
    },
    paymentMethod: {
        type: String,
        required: true
    },
    totalCost:{
        type: Number,
        required:true,
        default:0
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
