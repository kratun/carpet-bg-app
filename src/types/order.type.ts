// --------------------------------
// API Request Types
// --------------------------------

export interface OrderStatusFilter {
  status: OrderStatuses;
  date?: string;
}

export interface OrdersFilter {
  searchTerm?: string | undefined;
  sortBy?: keyof OrderDto | undefined;
  sortDirection?: "asc" | "desc" | undefined;
  pageIndex?: number | undefined;
  pageSize?: number | undefined;
  filter?: {
    statuses?: OrderStatusFilter[] | undefined;
    pickupDate?: string | undefined;
    deliveryDate?: string | undefined;
  };
}

export interface OrderStatusUpdate {
  nextStatus: string;
}

export interface UpdateOrderItem {
  id?: string | null;
  productId: string;
  width?: number | null;
  height?: number | null;
  diagonal?: number | null;
  note?: string;
}

export interface OrderDeliveryData {
  deliveryAddressId: string;
  deliveryDate: string;
  deliveryTimeRange: string;
  displayAddress?: string | null;
  note?: string | null;
}

export interface OrderDeliveryConfirm {
  paidAmount: number;
  deliveredItems: string[];
}

export interface CreateOrder {
  isExpress: boolean;
  pickupAddressId: string;
  pickupTimeRange?: string | null;
  pickupDate?: string | null;
  note: string;
  customerId?: string;
  orderItems: Partial<OrderItemDto>[];
  expectedCount: number;
}

// --------------------------------
// API Response Types
// --------------------------------

export enum OrderStatuses {
  new = "new",
  pendingPickup = "pendingPickup",
  pickupComplete = "pickupComplete",
  washingInProgress = "washingInProgress",
  washingComplete = "washingComplete",
  personalDelivery = "personalDelivery",
  pendingDelivery = "pendingDelivery",
  deliveryComplete = "deliveryComplete",
  cancelled = "cancelled",
  completed = "completed",
}

export enum AdditionType {
  fixed = "fixed",
  percentage = "percentage",
}

export interface Addition {
  name: string;
  normalizedName: string;
  additionType: AdditionType;
  value: number;
}

export interface OrderItemDto {
  id?: string | null;
  productId: string;

  width?: number | null;
  height?: number | null;
  diagonal?: number | null;

  price: number;
  note: string;
  amount: number;
  status: OrderItemStatuses;

  additions: Addition[];
}

export interface OrderDto {
  id: string;
  createdAt: string;

  isExpress: boolean;

  customerFullName: string;
  phoneNumber: string;

  pickupAddress: string;
  pickupAddressId: string;
  pickupTimeRange?: string | null;
  pickupDate?: string | null;

  customerId: string;

  deliveryAddressId?: string | null;
  deliveryTimeRange: string;
  deliveryDate?: string | null;
  deliveryAddress: string;

  status: OrderStatuses;
  note: string;

  orderItems: Partial<OrderItemDto>[];
  totalAmount: number;
}

export enum OrderItemStatuses {
  new = "new",
  washingInProgress = "washingInProgress",
  washingComplete = "washingComplete",
  deleted = "deleted",
}
