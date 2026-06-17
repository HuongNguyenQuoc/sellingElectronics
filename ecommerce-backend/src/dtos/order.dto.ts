export interface OrderItemDto {
  productId: string;
  cartItemId?: string; // Here need ? because we need check that item has already been the cart? or buy now (not in the cart)
  image?: string;
  quantity: number;
  price: number; // Price at the time order
  colorSelected:string
}

// Address in order
export interface ShippingAddressDto {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

// Use for Create Order
export interface CreateOrderDto {
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
