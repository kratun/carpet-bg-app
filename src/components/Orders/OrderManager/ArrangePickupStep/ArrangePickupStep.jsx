import { useState, useCallback, useEffect } from "react";
import { orderService } from "../../../../services/orderService.js";
import {
  ORDER_STATUSES,
  getStatusDisplayName,
} from "../../../../utils/statuses.utils.js";
import { dateUtil } from "../../../../utils/date.utils.js";

import Loading from "../../../UI/Loading.jsx";
import { DndSortableList } from "../../../DragAndDropList/DragAndDropSortableList.jsx";
import DatePickerControl from "../../../UI/DateNavigator/DateNavigator.jsx";
import styles from "./ArrangePickupStep.module.css";

export default function ArrangePickUpStep() {
  const today = dateUtil.getCurrentDateFormatted();
  const [selectedDate, setSelectedDate] = useState(today);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const filter = {
      sortBy: "createdAt",
      sortOrder: "adc",
      pageNumber: 1,
      pageSize: 0,
      statuses: [ORDER_STATUSES.pendingPickup, ORDER_STATUSES.pendingDelivery],
      pickupDate: selectedDate,
    };
    const result = await orderService.getAllByStatuses(filter);
    setOrders(result.items); //.data.sort((a, b) => a.orderBy - b.orderBy));
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleReorder = async (updatedOrders) => {
    const reorderedItems = updatedOrders.map((item, index) => ({
      ...item,
      orderBy: index + 1,
    }));
    await orderService.updateOrdersOrderBy(
      reorderedItems.map((item) => {
        return { id: item.id, orderBy: item.orderBy };
      })
    );
    setOrders(reorderedItems);
    // TODO: persist new order to backend
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderItem = (order) => {
    const isPickupStatus = order.status === ORDER_STATUSES.pendingPickup;
    const isDeliveryStatus = order.status === ORDER_STATUSES.pendingDelivery;
    let address = "";
    let timeRange = "";

    if (isPickupStatus) {
      address = order.pickupAddress;
      timeRange = order.pickupTimeRange;
    }

    if (isDeliveryStatus) {
      address = order.deliveryAddress;
      timeRange = order.deliveryTimeRange;
    }

    return (
      <div className={styles.card}>
        {order.orderBy && <div className={styles.index}>{order.orderBy}</div>}
        {(order.status === ORDER_STATUSES.pendingPickup ||
          order.status === ORDER_STATUSES.pendingDelivery) && (
          <div className={styles.cardContent}>
            <div className={styles.contentItem}>
              <div>Име: {order.userFullName}</div>
              <div>{getStatusDisplayName(order.status)}</div>
            </div>
            <div className={styles.contentItem}>
              <div>Адрес: {address}</div>
            </div>

            <div className={styles.contentItem}>
              <div>Времеви диапазон: {timeRange}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Подреждане на поръчки за логистика</h2>

      <DatePickerControl
        selectedDate={selectedDate}
        onChange={handleDateChange}
      />

      {loading && <Loading />}
      {!loading && orders.length === 0 && (
        <p>Няма поръчки за избраната дата.</p>
      )}
      {!loading && orders.length > 0 && (
        <DndSortableList
          items={orders}
          onChange={handleReorder}
          getItemId={(order) => order.id}
          renderItem={renderItem}
        />
      )}
    </div>
  );
}
