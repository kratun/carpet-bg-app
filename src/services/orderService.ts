import {
  CreateOrder,
  OrderDeliveryConfirm,
  OrderDeliveryData,
  OrderDto,
  OrderItemDto,
  OrderStatuses,
  PaginationType,
} from "../types";
import { apiFetch } from "./apiClient";

export const orderService = {
  async create(order: CreateOrder): Promise<string | null> {
    const body = {
      ...order,
    };

    return apiFetch.post("/orders", { body });
  },

  getAll(params = {}): Promise<PaginationType<OrderDto>> {
    return apiFetch.get("/orders", { params });
  },

  getSetupLogisticData(params = {}): Promise<PaginationType<OrderDto>> {
    return apiFetch.get("/orders/setup-logistic-data", { params });
  },

  // TODO update the url or remove it
  getAllByStatuses(params = {}): Promise<PaginationType<OrderDto>> {
    return apiFetch.get("/orders", { params });
  },

  getById(id: string): Promise<OrderDto | null> {
    return apiFetch.get(`/orders/${id}`);
  },

  updateOrderStatus(
    id: string,
    nextStatus: OrderStatuses
  ): Promise<string | null> {
    const body = {
      nextStatus,
    };

    return apiFetch.put(`/orders/${id}/status`, { body });
  },

  completeWashing(id: string): Promise<string | null> {
    const body = {};
    return apiFetch.put(`/orders/${id}/complete-washing`, { body });
  },

  addOrderItem(
    orderId: string,
    item: Partial<OrderItemDto>
  ): Promise<string | null> {
    const body = {
      ...item,
    };

    return apiFetch.post(`/orders/${orderId}/order-items`, { body });
  },

  updateOrderItem(
    orderId: string,
    item: Partial<OrderItemDto>
  ): Promise<string | null> {
    const body = {
      ...item,
    };

    return apiFetch.put(`/orders/${orderId}/order-items/${item.id}`, { body });
  },

  completeWashingOrderItem(
    orderId: string,
    orderItemId: string
  ): Promise<string | null> {
    const body = {};
    return apiFetch.put(
      `/orders/${orderId}/order-items/${orderItemId}/complete-washing`,
      { body }
    );
  },

  addDeliveryData(
    orderId: string,
    deliveryData: OrderDeliveryData
  ): Promise<string | null> {
    const body = {
      ...deliveryData,
    };

    return apiFetch.put(`/orders/${orderId}/delivery-data`, { body });
  },

  revertOrderStatus(
    id: string,
    nextStatus: OrderStatuses
  ): Promise<string | null> {
    const body = {
      nextStatus,
    };

    return apiFetch.put(`/orders/${id}/status-revert`, { body });
  },

  deliveryConfirm(
    id: string,
    payload: OrderDeliveryConfirm
  ): Promise<string | null> {
    const body = {
      ...payload,
    };

    return apiFetch.put(`/orders/${id}/delivery-confirm`, { body });
  },

  // getAllByStatus(status, filter = {}) {
  //   const {
  //     searchTerm = "",
  //     sortBy = "pickupDate",
  //     sortOrder = "asc",
  //     page = 1,
  //     limit = 10,
  //     filters = {},
  //   } = filter;

  //   const { pickupDate, deliveryDate } = filters;

  //   let result = orders.filter(
  //     (order) =>
  //       order.status === status &&
  //       (!pickupDate || order.pickupDate === pickupDate) &&
  //       (!deliveryDate || order.deliveryDate === deliveryDate)
  //   );

  //   // Destructure and set defaults

  //   // 🔍 Search (on customerName or address)
  //   const trimmedSearchTerm = searchTerm?.trim() || undefined;
  //   if (trimmedSearchTerm) {
  //     const term = trimmedSearchTerm.toLowerCase();
  //     result = result.filter(
  //       (order) =>
  //         order.customerName?.toLowerCase().includes(term) ||
  //         order.pickupAddress?.toLowerCase().includes(term) ||
  //         order.deliveryAddress?.toLowerCase().includes(term)
  //     );
  //   }

  //   // Filters (example: pickupDate, timeRange, etc.)
  //   for (const key in filters) {
  //     if (filters[key]) {
  //       result = result.filter((order) =>
  //         String(order[key]).includes(String(filters[key]))
  //       );
  //     }
  //   }

  //   // 📊 Sorting
  //   if (sortBy) {
  //     result.sort((a, b) => {
  //       const aValue = a[sortBy];
  //       const bValue = b[sortBy];

  //       if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
  //       if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }

  //   // 📑 Pagination
  //   const total = result.length;
  //   const start = (page - 1) * limit;
  //   const paginated = result.slice(start, start + limit);

  //   return Promise.resolve({
  //     data: paginated,
  //     total,
  //     page,
  //     limit,
  //   });
  // },

  // update(id, updates) {
  //   const index = orders.findIndex((o) => o.id === Number(id));
  //   if (index === -1) return Promise.resolve(null);

  //   orders[index] = { ...orders[index], ...updates };
  //   return Promise.resolve(orders[index]);
  // },

  // updateOrdersOrderBy(orderUpdates) {
  //   orderUpdates.forEach(({ id, orderBy }) => {
  //     const order = orders.find((o) => o.id === Number(id));
  //     if (order) {
  //       order.orderBy = orderBy;
  //       order.status = ORDER_STATUSES.pendingPickup;
  //     }
  //   });

  //   return Promise.resolve(orders);
  // },

  // updateOrderItem(orderId, item) {
  //   const updatedOrders = [...orders];
  //   updatedOrders.map((order) => {
  //     if (order.id === orderId) {
  //       const updatedOrderItems = (order.orderItems ?? []).map((currentItem) =>
  //         currentItem.id === item.id
  //           ? {
  //               ...currentItem,
  //               ...item,
  //             }
  //           : currentItem
  //       );

  //       order.orderItems = [...updatedOrderItems];
  //     }
  //     return order;
  //   });

  //   orders = updatedOrders;
  // },

  // delete(id) {
  //   orders = orders.filter((o) => o.id !== Number(id));
  //   return Promise.resolve();
  // },
};
