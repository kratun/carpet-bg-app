import { apiFetch } from "./apiClient";
import { ORDER_STATUSES } from "../utils/statuses.utils.js";

let orders = []; // In-memory order list

export const orderService = {
  async create(order) {
    const body = {
      ...order,
    };

    return apiFetch.post("/orders", { body });
  },

  getAll(params = {}) {
    return apiFetch.get("/orders", { params });
  },

  getAllByStatus(status, filter = {}) {
    const {
      searchTerm = "",
      sortBy = "pickupDate",
      sortOrder = "asc",
      page = 1,
      limit = 10,
      filters = {},
    } = filter;

    const { pickupDate, deliveryDate } = filters;

    let result = orders.filter(
      (order) =>
        order.status === status &&
        (!pickupDate || order.pickupDate === pickupDate) &&
        (!deliveryDate || order.deliveryDate === deliveryDate)
    );

    // Destructure and set defaults

    // 🔍 Search (on customerName or address)
    const trimmedSearchTerm = searchTerm?.trim() || undefined;
    if (trimmedSearchTerm) {
      const term = trimmedSearchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.customerName?.toLowerCase().includes(term) ||
          order.pickupAddress?.toLowerCase().includes(term) ||
          order.deliveryAddress?.toLowerCase().includes(term)
      );
    }

    // Filters (example: pickupDate, timeRange, etc.)
    for (const key in filters) {
      if (filters[key]) {
        result = result.filter((order) =>
          String(order[key]).includes(String(filters[key]))
        );
      }
    }

    // 📊 Sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // 📑 Pagination
    const total = result.length;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return Promise.resolve({
      data: paginated,
      total,
      page,
      limit,
    });
  },

  getAllByStatuses(params = {}) {
    return apiFetch.get("/orders", { params });

    // const {
    //   search = "",
    //   sortBy = "pickupDate",
    //   sortOrder = "asc",
    //   page = 1,
    //   limit = 10,
    //   filters = {},
    // } = filter;

    // const { statuses, pickupDate, deliveryDate } = filters;

    // let result = orders.filter(
    //   (order) =>
    //     statuses.includes(order.status) &&
    //     (!pickupDate ||
    //       order.pickupDate === pickupDate ||
    //       !deliveryDate ||
    //       order.deliveryDate === deliveryDate)
    // );

    // // Destructure and set defaults

    // // 🔍 Search (on customerName or address)
    // if (search.trim()) {
    //   const term = search.trim().toLowerCase();
    //   result = result.filter(
    //     (order) =>
    //       order.customerName?.toLowerCase().includes(term) ||
    //       order.pickupAddress?.toLowerCase().includes(term) ||
    //       order.deliveryAddress?.toLowerCase().includes(term)
    //   );
    // }

    // // Filters (example: pickupDate, timeRange, etc.)
    // // for (const key in filters) {
    // //   if (filters[key]) {
    // //     result = result.filter((order) =>
    // //       String(order[key]).includes(String(filters[key]))
    // //     );
    // //   }
    // // }

    // // Sorting
    // if (sortBy) {
    //   result.sort((a, b) => {
    //     const aValue = a[sortBy];
    //     const bValue = b[sortBy];

    //     if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    //     if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    //     return 0;
    //   });
    // }

    // // Pagination
    // const total = result.length;
    // const start = (page - 1) * limit;
    // const paginated = result.slice(start, start + limit);

    // return Promise.resolve({
    //   data: paginated,
    //   total,
    //   page,
    //   limit,
    // });
  },

  getById(id) {
    return apiFetch.get(`/orders/${id}`);
  },

  update(id, updates) {
    const index = orders.findIndex((o) => o.id === Number(id));
    if (index === -1) return Promise.resolve(null);

    orders[index] = { ...orders[index], ...updates };
    return Promise.resolve(orders[index]);
  },

  updateOrdersOrderBy(orderUpdates) {
    orderUpdates.forEach(({ id, orderBy }) => {
      const order = orders.find((o) => o.id === Number(id));
      if (order) {
        order.orderBy = orderBy;
        order.status = ORDER_STATUSES.pendingPickup;
      }
    });

    return Promise.resolve(orders);
  },

  updateOrderStatus(id, nextStatus) {
    const body = {
      nextStatus,
    };

    return apiFetch.put(`/orders/${id}/status`, { body });
  },

  addOrderItem(orderId, item) {
    const body = {
      ...item,
    };

    return apiFetch.post(`/orders/${orderId}/order-items`, { body });
  },

  addDeliveryData(orderId, deliveryData) {
    const body = {
      ...deliveryData,
    };

    return apiFetch.put(`/orders/${orderId}/delivery-data`, { body });
  },

  revertOrderStatus(id, nextStatus) {
    const body = {
      nextStatus,
    };

    return apiFetch.put(`/orders/${id}/status-revert`, { body });
  },

  updateOrderItem(orderId, item) {
    const updatedOrders = [...orders];
    updatedOrders.map((order) => {
      if (order.id === orderId) {
        const updatedOrderItems = (order.orderItems ?? []).map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                ...item,
              }
            : currentItem
        );

        order.orderItems = [...updatedOrderItems];
      }
      return order;
    });

    orders = updatedOrders;
  },

  delete(id) {
    orders = orders.filter((o) => o.id !== Number(id));
    return Promise.resolve();
  },

  deliveryConfirm(id, payload) {
    const body = {
      ...payload,
    };

    return apiFetch.put(`/orders/${id}/delivery-confirm`, { body });
  },
};
