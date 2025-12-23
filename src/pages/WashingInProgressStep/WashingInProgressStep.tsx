import { useState, useEffect, useCallback, useMemo } from "react";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";

import Pagination from "../../components/UI/Pagination/Pagination";
import SearchableAccordion from "../../components/Accordion/SearchableAccordion";
import ManageOrderItems from "../../components/Orders/OrderManager/ManageOrderItems/ManageOrderItems";
import ActionsContainer from "../../components/UI/Actions/ActionsContainer";
import Loading from "../../components/UI/Loading";

import styles from "./WashingInProgressStep.module.css";
import {
  OrderDto,
  OrderItemDto,
  OrderItemStatuses,
  OrdersFilter,
  OrderStatuses,
  ProductType,
} from "../../types";

export default function WashingInProgressStep() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const [params, setParams] = useState<OrdersFilter>({
    searchTerm: "",
    sortBy: "pickupDate",
    sortDirection: "asc",
    pageIndex: 0,
    pageSize: 5,
    filter: {
      statuses: [
        { status: OrderStatuses.pickupComplete },
        { status: OrderStatuses.washingInProgress },
      ],
    },
  });

  /* ------------------------------------------------------------------ */
  /* Data fetching */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    productService
      .getAll()
      .then(setProducts)
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await orderService.getAll({
        ...params,
      });

      setOrders(result.items ?? []);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, [params.pageIndex, params.pageSize, params.searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ------------------------------------------------------------------ */
  /* Handlers */
  /* ------------------------------------------------------------------ */

  const handlePageChange = useCallback((pageIndex: number) => {
    setParams((prev) => ({ ...prev, pageIndex }));
  }, []);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setParams((prev) => ({
      ...prev,
      pageIndex: 0,
      searchTerm,
    }));
  }, []);

  const handleEditItem = useCallback(
    async (orderId: string, itemId: string) => {
      await orderService.completeWashingOrderItem(orderId, itemId);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderItems: order.orderItems.map((item) =>
                  item.id === itemId
                    ? { ...item, status: OrderItemStatuses.washingComplete }
                    : item
                ),
              }
            : order
        )
      );
    },
    []
  );

  const handleConfirmOrder = useCallback(
    async (orderId: string) => {
      await orderService.completeWashing(orderId);

      setParams((prev) => {
        const isLastItem = orders.length === 1;
        const hasPreviousPage = (prev.pageIndex ?? 0) > 0;

        if (isLastItem && hasPreviousPage) {
          return {
            ...prev,
            pageIndex: prev.pageIndex! - 1,
          };
        }

        return prev;
      });
    },
    [orders.length]
  );

  /* ------------------------------------------------------------------ */
  /* Helpers */
  /* ------------------------------------------------------------------ */

  const isOrderWashingComplete = (order: OrderDto): boolean =>
    order.orderItems.every(
      (item) => item.status === OrderItemStatuses.washingComplete
    );

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Изпиране в процес</h2>

      {loading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className={styles.emptyText}>Няма поръчки в процес на изпиране.</p>
      )}

      <SearchableAccordion
        loading={loading}
        items={orders}
        onSearchChange={handleSearchChange}
        itemKeyFn={(order: OrderDto) => order.id}
        renderTitle={(order: OrderDto) =>
          `${order.phoneNumber} — ${order.customerFullName} — ${order.orderItems.length} бр.`
        }
        renderContent={(order: OrderDto) => {
          const completed = isOrderWashingComplete(order);

          return (
            <div className={styles.content}>
              <ActionsContainer className={styles.actions}>
                <button
                  className={styles.confirmButton}
                  onClick={() => handleConfirmOrder(order.id)}
                  disabled={!completed}
                >
                  Confirm
                </button>
              </ActionsContainer>

              <ManageOrderItems
                products={products}
                orderItems={order.orderItems}
                onChangeStatus={(item: Partial<OrderItemDto>) =>
                  handleEditItem(order.id, item.id!)
                }
              />
            </div>
          );
        }}
      />

      {totalPages > 1 && (
        <Pagination
          currentPageIndex={params.pageIndex!}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
