// orderStatuses.utils.ts

import { OrderItemStatuses, OrderStatuses } from "../types";

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

export function getStatusDisplayName(status: OrderStatuses): string {
  switch (status) {
    case OrderStatuses.new:
      return "Нова";
    case OrderStatuses.pendingPickup:
      return "Готова за взимане";
    case OrderStatuses.pickupComplete:
      return "Взета";
    case OrderStatuses.washingInProgress:
      return "Пране в процес";
    case OrderStatuses.washingComplete:
      return "Пране завършено";
    case OrderStatuses.pendingDelivery:
      return "Готова за доставка";
    case OrderStatuses.deliveryComplete:
      return "Доставена";
    case OrderStatuses.completed:
      return "Завършена";
    case OrderStatuses.cancelled:
      return "Отказана";
    default:
      return "Неизвестен статус";
  }
}

/* =========================
   Order item statuses
========================= */

export function getOrderItemStatusDisplayName(
  status: OrderItemStatuses
): string {
  switch (status) {
    case OrderItemStatuses.new:
      return "Нова";
    case OrderItemStatuses.washingInProgress:
      return "Пране в процес";
    case OrderItemStatuses.washingComplete:
      return "Пране завършено";
    case OrderItemStatuses.deleted:
      return "Изтрит";
    default:
      return "Неизвестен статус";
  }
}
