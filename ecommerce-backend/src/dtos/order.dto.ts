export interface OrderItemDto {
  productId: string;
  image?: string;
  quantity: number;
  price: number; // Price at the time order
}

// Address in order
export interface ShippingAddressDto {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Use for Create Order
export interface CreateOrderDto {
  userId: string;
  items: OrderItemDto[];
  shippingAddress: ShippingAddressDto;
  paymentMethod: string; // "credit-card", "paypal",...
}

// Use for Update Order Status 
export interface UpdateOrderStatusDto {
  status: string; // "Pending", "Processing", "Shipped",...
}

// Use for Response
export class OrderResponseDto {
  _id!: string;
  user!: string;
  items!: OrderItemDto[];
  shippingAddress!: ShippingAddressDto;
  status!: string;
  paymentMethod!: string;
  totalCost!: number;
  orderDate!: Date;
  createdAt!: Date;
  updateAt!: Date;
}