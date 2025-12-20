import { useState, useCallback, useEffect } from "react";

import { orderService } from "../../../../services/orderService";
import { useToastContext } from "../../../../stores/ToastContext";
import { ORDER_STATUSES } from "../../../../utils/statuses.utils.js";

import SearchableAccordion from "../../../Accordion/SearchableAccordion.jsx";

import Pagination from "../../../UI/Pagination/Pagination.jsx";
import OrderDeliveryForm from "./OrderDeliveryForm.jsx";
import { dateUtil } from "../../../../utils/date.utils.js";

export default function SetupDeliveryDataStep() {
  const formattedToday = dateUtil.getCurrentDateFormatted();
  const { toastSuccess, toastError, toastCustom } = useToastContext();

  const [params, setParams] = useState({
    search: "",
    sortBy: "pickupDate",
    sortOrder: "asc",
    page: 1,
    pageSize: 100,
    statuses: [
      ORDER_STATUSES.new,
      ORDER_STATUSES.pendingPickup,
      ORDER_STATUSES.washingComplete,
    ],
    filters: {
      pickupDate: formattedToday,
      deliveryDate: formattedToday,
    },
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / params.limit);

  const fetchOrders = useCallback(async () => {
    //setLoading(true);
    const result = await orderService.getAll(params);

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

  function handlePickupDataSave(orderId, deliveryData) {
    try {
      setTimeout(async () => {
        await orderService.addDeliveryData(orderId, { ...deliveryData });
        await fetchOrders();
        toastSuccess("Delivery address updated successfully!");
      }, 0);
    } catch (err) {
      console.error("Failed to update delivery address:", err);
      toastError("Failed to update delivery address.");
    }
  }

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
      ? ORDER_STATUSES.washingComplete
      : ORDER_STATUSES.new;

    toastCustom("Are you sure?", {
      action: {
        label: "Yes",
        onClick: () => revertStatus(orderId, nextStatus),
      },
      cancel: { label: "No" },
      style: { background: "#ffffff", color: "#1e3a8a" },
    });
  }

  function revertStatus(orderId, nextStatus) {
    const successMessage = `Order status has been changed to ${nextStatus} successfully!`;

    const errorMessage = `Failed to changed status to ${nextStatus}.`;

    const promise = orderService.revertOrderStatus(orderId, nextStatus);
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

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && orders.length === 0 && <div>No orders found.</div>}
      {!loading && orders.length > 0 && (
        <div>
          <h1 style={{ padding: "16px", margin: "0" }}>Setup Delivery data</h1>

          <SearchableAccordion
            items={orders}
            search={params.search}
            onSearchChange={handleSearchChange}
            itemKeyFn={(order) => order.id}
            renderContent={(order) => {
              const isPending =
                order.status === ORDER_STATUSES.pendingPickup ||
                order.status === ORDER_STATUSES.new;
              const isDelivery =
                order.status === ORDER_STATUSES.washingComplete;

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
                order.status == ORDER_STATUSES.pendingPickup ||
                order.status == ORDER_STATUSES.new
                  ? "Вземане"
                  : "Досавка"
              } -- ${order.phoneNumber} -- ${order.userFullName} -- ${
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
