import { useState, useCallback, useEffect, useMemo } from "react";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import { dateUtil } from "../../utils/date.utils";
import {
  OrdersFilter,
  OrderDto,
  ProductType,
  OrderItemDto,
  OrderDeliveryConfirm,
  OrderStatuses,
} from "../../types";

import SearchableAccordion from "../../components/Accordion/SearchableAccordion";
import LogisticPickupForm from "../../components/Orders/OrderManager/LogisticOrders/LogisticPickupForm";
import LogisticDeliveryForm from "../../components/Orders/OrderManager/LogisticOrders/LogisticDeliveryForm";
import Pagination from "../../components/UI/Pagination/Pagination";

import styles from "./LogisticOrders.module.css";

export default function LogisticOrders() {
  const today = dateUtil.getCurrentDateFormatted();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [queryParams, setQueryParams] = useState<OrdersFilter>({
    sortBy: "createdAt",
    sortDirection: "asc",
    pageSize: 10,
    pageIndex: 0,
    searchTerm: undefined,
    filter: {
      statuses: [
        { status: OrderStatuses.pendingPickup },
        { status: OrderStatuses.pendingDelivery },
      ],
      pickupDate: today,
      deliveryDate: today,
    },
  });

  const showPagination = totalPages > 0;

  /* ------------------ Fetch products once ------------------ */
  useEffect(() => {
    productService
      .getAll()
      .then(setProducts)
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  /* ------------------ Fetch orders ------------------ */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await orderService.getAll(queryParams);
      setOrders(result.items ?? []);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ------------------ Handlers ------------------ */

  const handlePageChange = useCallback((pageIndex: number) => {
    setQueryParams((prev) => ({ ...prev, pageIndex }));
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setQueryParams((prev) => ({
      ...prev,
      pageIndex: 0,
      searchTerm: term || undefined,
    }));
  }, []);

  const handlePickupConfirm = useCallback(
    async (order: OrderDto) => {
      const nextStatus =
        order.status === OrderStatuses.pendingDelivery
          ? OrderStatuses.deliveryComplete
          : OrderStatuses.pickupComplete;

      try {
        await orderService.updateOrderStatus(order.id, nextStatus);
        fetchOrders();
      } catch (err) {
        console.error("Failed to update pickup status:", err);
      }
    },
    [fetchOrders]
  );

  const handleRevertStatus = useCallback(
    async (orderId: string, nextStatus: OrderStatuses) => {
      try {
        await orderService.revertOrderStatus(orderId, nextStatus);
        fetchOrders();
      } catch (err) {
        console.error("Failed to revert order status:", err);
      }
    },
    [fetchOrders]
  );

  const handleAddOrderItem = useCallback(
    async (item: Partial<OrderItemDto>, orderId: string) => {
      try {
        const orderItemId = await orderService.addOrderItem(orderId, item);

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderItems: [
                    ...(order.orderItems ?? []),
                    { ...item, id: orderItemId },
                  ],
                }
              : order
          )
        );
      } catch (err) {
        console.error("Failed to add order item:", err);
      }
    },
    []
  );

  const handleDeliveryConfirm = useCallback(
    async (order: OrderDto) => {
      if (order.status !== OrderStatuses.pendingDelivery) return;

      const payload = (order.orderItems ?? []).reduce<OrderDeliveryConfirm>(
        (acc, item) => {
          if (!item.id) return acc;

          acc.deliveredItems.push(item.id);
          acc.paidAmount += item.amount ?? 0;
          return acc;
        },
        { deliveredItems: [], paidAmount: 0 }
      );

      try {
        await orderService.deliveryConfirm(order.id, payload);
        fetchOrders();
      } catch (err) {
        console.error("Failed to confirm delivery:", err);
      }
    },
    [fetchOrders]
  );

  /* ------------------ Render ------------------ */

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Logistic</h1>

      <SearchableAccordion
        loading={loading}
        items={orders}
        onSearchChange={handleSearchChange}
        itemKeyFn={(order: OrderDto) => order.id}
        renderTitle={(order: OrderDto) =>
          `${order.phoneNumber} -- ${order.customerFullName} -- ${
            order.status === OrderStatuses.pendingDelivery
              ? order.deliveryAddress
              : order.pickupAddress
          } -- ${order.status.toUpperCase()}`
        }
        renderContent={(order: OrderDto) => {
          switch (order.status) {
            case OrderStatuses.pendingPickup:
              return (
                <LogisticPickupForm
                  products={products}
                  order={order}
                  onAddOrderItem={handleAddOrderItem}
                  onPickupConfirm={handlePickupConfirm}
                  onRevertStatus={handleRevertStatus}
                />
              );

            case OrderStatuses.pendingDelivery:
              return (
                <LogisticDeliveryForm
                  order={order}
                  onRevertStatus={handleRevertStatus}
                  onDeliveryConfirm={() => handleDeliveryConfirm(order)}
                />
              );

            default:
              return <div className={styles.textGray}>Unknown status</div>;
          }
        }}
      />

      {showPagination && (
        <Pagination
          currentPageIndex={queryParams.pageIndex ?? 0}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
