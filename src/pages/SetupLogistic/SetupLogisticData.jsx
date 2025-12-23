import { useState, useCallback, useEffect } from "react";

import { orderService } from "../../services/orderService.js";
import { useToastContext } from "../../stores/ToastContext.jsx";

import SearchableAccordion from "../../components/Accordion/SearchableAccordion.jsx";

import Pagination from "../../components/UI/Pagination/Pagination.js";
import OrderDeliveryForm from "../../components/Orders/OrderManager/SetupDeliveryDataStep/OrderDeliveryForm.jsx";
import { dateUtil } from "../../utils/date.utils.js";
import { OrderStatuses } from "../../types/order.type.js";

export default function SetupLogisticData() {
  const formattedToday = dateUtil.getCurrentDateFormatted();
  const { toastSuccess, toastError, toastCustom } = useToastContext();

  const [params, setParams] = useState({
    search: "",
    sortBy: "pickupDate",
    sortOrder: "asc",
    page: 1,
    pageSize: 100,
    filter: {
      statuses: [
        {
          status: OrderStatuses.new,
          date: formattedToday,
        },
        {
          status: OrderStatuses.pendingPickup,
          date: formattedToday,
        },
        {
          status: OrderStatuses.washingComplete,
          date: formattedToday,
        },
        {
          status: OrderStatuses.pendingDelivery,
          date: formattedToday,
        },
      ],
    },
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / params.limit);

  const fetchOrders = useCallback(async () => {
    //setLoading(true);
    const result = await orderService.getSetupLogisticData(params);

    setOrders(result.items || []);
    setTotal(result.total);
    //setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = useCallback((term) => {
    setParams((prev) => ({ ...prev, search: term }));
  }, []);

  function handleSave(orderId, data, isDelivery) {
    const successMessage = isDelivery
      ? "Delivery address saved successfully!"
      : "Pickup data saved successfully!";

    const errorMessage = isDelivery
      ? "Failed to save delivery data."
      : "Failed to save pickup data.";

    const promise = isDelivery
      ? orderService.addDeliveryData(orderId, { ...data })
      : orderService.addPickupData(orderId, { ...data });
    try {
      setTimeout(async () => {
        await promise;
        await fetchOrders();
        toastSuccess(successMessage);
      }, 0);
    } catch (err) {
      console.error(`${errorMessage}: `, err);
      toastError(errorMessage);
    }
  }

  function handleBackBtnClick(orderId, isDelivery) {
    if (!isDelivery) {
      return;
    }
    const nextStatus = isDelivery
      ? OrderStatuses.washingComplete
      : OrderStatuses.new;

    toastCustom("Are you sure?", {
      action: {
        label: "Yes",
        onClick: () => revertStatus(orderId, nextStatus),
      },
      cancel: { label: "No" },
      style: { background: "#ffffff", color: "#1e3a8a" },
    });
  }

  async function revertStatus(orderId, nextStatus) {
    const successMessage = `Order status has been changed to ${nextStatus} successfully!`;

    const errorMessage = `Failed to changed status to ${nextStatus}.`;
    setLoading(true);
    const promise = orderService.revertOrderStatus(orderId, nextStatus);
    try {
      await promise;
      await fetchOrders();
      toastSuccess(successMessage);
    } catch (err) {
      console.error(`${errorMessage}: `, err);
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && orders.length === 0 && <div>No orders found.</div>}
      {!loading && orders.length > 0 && (
        <div>
          <h1 style={{ padding: "16px", margin: "0" }}>Setup Logistic data</h1>

          <SearchableAccordion
            items={orders}
            search={params.search}
            onSearchChange={handleSearchChange}
            itemKeyFn={(order) => order.id}
            renderContent={(order) => {
              const isPending =
                order.status === OrderStatuses.pendingPickup ||
                order.status === OrderStatuses.new;
              const isDelivery = order.status === OrderStatuses.washingComplete;

              if (!isPending && !isDelivery) {
                return <div className="text-gray-500">Unknown status</div>;
              }

              return (
                <OrderDeliveryForm
                  isDelivery={isDelivery}
                  order={order}
                  onSave={handleSave}
                  onBack={() => handleBackBtnClick(order.id, isDelivery)}
                />
              );
            }}
            renderTitle={(order) =>
              `${
                order.status == OrderStatuses.pendingPickup ||
                order.status == OrderStatuses.new
                  ? "Вземане"
                  : "Досавка"
              } -- ${order.phoneNumber} -- ${order.customerFullName} -- ${
                order.orderItems.length
              } бр.`
            }
          />

          <Pagination
            currentPage={params.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
