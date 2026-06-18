import mongoose, { Document, Schema } from 'mongoose';

export interface IShippingAddress{
    fullName: string;
    phone: string;
    address: string;
}

export const ShippingAddressSchema = new mongoose.Schema<IShippingAddress>({
    fullName: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v: string) {
                return /^(0|\+84)\d{9}$/.test(v); // regex for phone number
            },
            message: 'Enter a valid phone number'
        }
    },
    address: { 
        type: String,
        required: true 
    },
});