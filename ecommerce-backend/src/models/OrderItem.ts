import mongoose, { Document, Schema, Types } from 'mongoose';

// lưu thông tin tại thời điểm mua hàng, tránh trường hợp sau này sản phẩm bị xóa or thay đổi thông tin
export interface IOrderItem {
    product: Types.ObjectId;
    name: string;
    image?: string;
    quantity: number;
    price: number; // Price when purchase
}

export const OrderItemSchema = new mongoose.Schema<IOrderItem>({
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    }, 
    name: { 
        type: String, 
        required: true
    },
    image: { 
        type: String
    },
    quantity: { 
        type: Number,
        required: true,
        min: 1 
    },
    price: { 
        type: Number,
        required: true,
        min: 0 
    }
});


