// orderStatuses.utils.ts

/* =========================
   Order statuses
========================= */

export type OrderStatus =
  | "new"
  | "pendingPickup"
  | "pickupComplete"
  | "washingInProgress"
  | "washingComplete"
  | "pendingDelivery"
  | "deliveryComplete"
  | "completed"
  | "cancelled";

export const ORDER_STATUSES: Record<OrderStatus, OrderStatus> = {
  new: "new",
  pendingPickup: "pendingPickup",
  pickupComplete: "pickupComplete",
  washingInProgress: "washingInProgress",
  washingComplete: "washingComplete",
  pendingDelivery: "pendingDelivery",
  deliveryComplete: "deliveryComplete",
  completed: "completed",
  cancelled: "cancelled",
};

export function getStatusDisplayName(status: OrderStatus): string {
  switch (status) {
    case ORDER_STATUSES.new:
      return "Нова";
    case ORDER_STATUSES.pendingPickup:
      return "Готова за взимане";
    case ORDER_STATUSES.pickupComplete:
      return "Взета";
    case ORDER_STATUSES.washingInProgress:
      return "Пране в процес";
    case ORDER_STATUSES.washingComplete:
      return "Пране завършено";
    case ORDER_STATUSES.pendingDelivery:
      return "Готова за доставка";
    case ORDER_STATUSES.deliveryComplete:
      return "Доставена";
    case ORDER_STATUSES.completed:
      return "Завършена";
    case ORDER_STATUSES.cancelled:
      return "Отказана";
    default:
      return "Неизвестен статус";
  }
}

/* =========================
   Order item statuses
========================= */

export type OrderItemStatus =
  | "new"
  | "washingInProgress"
  | "washingComplete"
  | "deleted";

export const ORDER_ITEM_STATUSES: Record<OrderItemStatus, OrderItemStatus> = {
  new: "new",
  washingInProgress: "washingInProgress",
  washingComplete: "washingComplete",
  deleted: "deleted",
};

export function getOrderItemStatusDisplayName(status: OrderItemStatus): string {
  switch (status) {
    case ORDER_ITEM_STATUSES.new:
      return "Нова";
    case ORDER_ITEM_STATUSES.washingInProgress:
      return "Пране в процес";
    case ORDER_ITEM_STATUSES.washingComplete:
      return "Пране завършено";
    case ORDER_ITEM_STATUSES.deleted:
      return "Изтрита";
    default:
      return "Неизвестен статус";
  }
}
