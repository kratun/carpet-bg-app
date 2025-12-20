import { useState, useCallback, useEffect, useMemo } from "react";

import { orderService } from "../../../../services/orderService.js";
import { productService } from "../../../../services/productService";
import { ORDER_STATUSES } from "../../../../utils/statuses.utils.js";
import { dateUtil } from "../../../../utils/date.utils.js";

import SearchableAccordion from "../../../Accordion/SearchableAccordion";
import LogisticPickupForm from "./LogisticPickupForm";
import LogisticDeliveryForm from "./LogisticDeliveryForm";
import Pagination from "../../../UI/Pagination/Pagination.jsx";

export default function LogisticOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const queryParams = useMemo(() => {
    const today = dateUtil.getCurrentDateFormatted();
    return {
      sortBy: "createdAt",
      sortDirection: "asc",
      statuses: [ORDER_STATUSES.pendingPickup, ORDER_STATUSES.pendingDelivery],
      pickupDate: today,
      deliveryDate: today,
      pageSize: 10,
      searchTerm,
      pageIndex,
    };
  }, [searchTerm, pageIndex]);

  const totalPages = Math.ceil(total / queryParams.pageSize);
  const showPagination = !!queryParams.pageIndex && !!totalPages;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const productList = await productService.getAll();
      if (productList && productList.length > 0) {
        setProducts(productList);
      }

      const result = await orderService.getAll(queryParams);
      setOrders(result.items);
      setPageIndex(result.pageIndex);
      setTotal(result.totalCount);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePickupConfirm = async (order) => {
    console.log("Pickup successful!");
    const nextStatus =
      order.status === ORDER_STATUSES.pendingDelivery
        ? ORDER_STATUSES.deliveryComplete
        : ORDER_STATUSES.pickupComplete;
    try {
      await orderService.updateOrderStatus(order.id, nextStatus);
      await fetchOrders();
      console.log("Pickup success and orders refreshed.");
    } catch (err) {
      console.error("Failed to update pickup status:", err);
    }
  };

  const handleRevertStatus = async (orderId, nextStatus) => {
    try {
      await orderService.revertOrderStatus(orderId, nextStatus);
      await fetchOrders();
      console.log("Order status reverted and orders refreshed.");
    } catch (err) {
      console.error("Failed to revert order status:", err);
    }
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleAddOrderItem = async (item, orderId) => {
    try {
      const orderItemId = await orderService.addOrderItem(orderId, item);

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id !== orderId) return order; // use the passed orderId
          return {
            ...order, // new object for the updated order
            orderItems: [
              ...(order.orderItems || []),
              { ...item, id: orderItemId },
            ],
          };
        })
      );
    } catch (error) {
      console.error("Failed to add order item:", error);
    }
  };

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleDeliveryConfirm = async (order) => {
    console.log("Delivery successful!");

    const { id, status, ...payload } = order;
    const nextStatus =
      status === ORDER_STATUSES.pendingDelivery
        ? ORDER_STATUSES.deliveryComplete
        : null;

    if (!nextStatus) {
      return;
    }

    try {
      await orderService.deliveryConfirm(id, payload);
      await fetchOrders();
      console.log("Delivery confirm successfully.");
    } catch (err) {
      console.error("Failed to update pickup status:", err);
    }
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h1 style={{ padding: "16px", margin: "0" }}>Logistic</h1>

      <SearchableAccordion
        items={orders}
        search={queryParams.searchTerm}
        onSearchChange={handleSearchChange}
        itemKeyFn={(order) => order.id}
        renderContent={(order) => {
          if (order.status === ORDER_STATUSES.pendingPickup) {
            return (
              <LogisticPickupForm
                products={products}
                order={order}
                onAddOrderItem={handleAddOrderItem}
                onPickupConfirm={handlePickupConfirm}
                onRevertStatus={handleRevertStatus}
              />
            );
          } else if (order.status === ORDER_STATUSES.pendingDelivery) {
            return (
              <LogisticDeliveryForm
                order={order}
                onRevertStatus={handleRevertStatus}
                onDeliveryConfirm={handleDeliveryConfirm}
              />
            );
          } else {
            return <div className="text-gray-500">Unknown status</div>;
          }
        }}
        renderTitle={(order) =>
          `${order.phoneNumber} -- ${order.userFullName} -- ${
            order.status === ORDER_STATUSES.pendingDelivery
              ? order.deliveryAddress
              : order.pickupAddress
          } -- ${order.status.toUpperCase()}`
        }
      />

      {showPagination && (
        <Pagination
          currentPageIndex={queryParams.pageIndex}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
