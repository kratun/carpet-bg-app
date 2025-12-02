export const ORDER_STATUSES = {
  new: "new",
  // readyForPickup: "readyForPickup",
  pendingPickup: "pendingPickup",
  pickupComplete: "pickupComplete",
  washingInProgress: "washingInProgress",
  washingComplete: "washingComplete",
  //readyForDelivery: "readyForDelivery",
  pendingDelivery: "pendingDelivery",
  deliveryComplete: "deliveryComplete",
  completed: "completed",
  cancelled: "cancelled",
};

export function getStatusDisplayName(status) {
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

export const ORDER_ITEM_STATUSES = {
  new: "new",
  washingInProgress: "washingInProgress",
  washingComplete: "washingComplete",
  deleted: "deleted",
};

export function getOrderItemStatusDisplayName(status) {
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
