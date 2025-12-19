export interface OrderType {
  id: string;
  phoneNumber: string;
  createdAt: string;
  orderItems: OrderItemType[];
  totalAmount: number;
  customerName: string;
  pickupDate: string;
  pickupTimeRange: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: string;
}

export interface OrderItemType {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
