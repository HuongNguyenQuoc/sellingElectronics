export class OrderItemDto {
  product!: string;
  quantity!: number;
  price!: number; // Price at the time order
}

// Address in order
export class ShippingAddressDto {
  street!: string;
  city!: string;
  postalCode!: string;
  country!: string;
}

// Use for Create Order
export class CreateOrderDto {
  items!: OrderItemDto[];
  shippingAddress!: ShippingAddressDto;
  paymentMethod!: string; // "credit-card", "paypal",...
}

// Use for Update Order Status 
export class UpdateOrderStatusDto {
  status!: string; // "Pending", "Processing", "Shipped",...
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