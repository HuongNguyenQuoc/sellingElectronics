import mongoose, { Schema,Model,Types } from 'mongoose';
import { IOrderItem, OrderItemSchema } from './OrderItem';
import { IShippingAddress, ShippingAddressSchema } from './ShippingAddress';
import { OrderStatus } from './OrderStatus';

// all item when buying
export interface IOrder{
    user: Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    status: OrderStatus;       
    paymentMethod: string;    // NOTEEEEEEEEEEEEEE
    orderDate: Date;
    totalCost: number;         
}

const OrderSchema = new Schema<IOrder>({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    status: { 
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    paymentMethod: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
