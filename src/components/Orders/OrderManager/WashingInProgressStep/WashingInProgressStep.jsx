import { useState, useEffect, useCallback } from "react";
import { orderService } from "../../../../services/orderService.js";
import { productService } from "../../../../services/productService.js";

import {
  ORDER_STATUSES,
  ORDER_ITEM_STATUSES,
} from "../../../../utils/statuses.util.js";

import styles from "./WashingInProgressStep.module.css";
import Pagination from "../../../UI/Pagination/Pagination.jsx";
import SearchableAccordion from "../../../Accordion/SearchableAccordion.jsx";
import ManageOrderItems from "../ManageOrderItems/ManageOrderItems.jsx";
import ManageOrderItemsActionsContainer from "../ManageOrderItems/ManageOrderItemsActionsContainer.jsx";
import Loading from "../../../UI/Loading.jsx";

export default function WashingInProgressStep() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    searchTerm: "",
    sortBy: "pickupDate",
    sortOrder: "asc",
    pageIndex: 0,
    limit: 5,
    filters: {},
  });
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / params.limit);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    // TODO combine with whenall if relevant
    const productList = await productService.getAll();
    if (productList && productList.length > 0) {
      setProducts(productList);
    }

    const result = await orderService.getAll({
      statuses: [ORDER_STATUSES.pickupComplete],
    });

    setOrders(result.items || []);
    setTotal(result.totalCount);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const keyFn = (order) => order.id;

  const handlePageChange = (nextPageIndex) => {
    setParams((prev) => ({ ...prev, pageIndex: nextPageIndex }));
  };

  const handleSearchChange = useCallback((term) => {
    setParams((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const handleEditItem = async (id, item) => {
    const updatedItem = {
      ...item,
      status: ORDER_ITEM_STATUSES.washingComplete,
    };

    await orderService.updateOrderItem(id, updatedItem);

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== id) {
          return order;
        }

        const updatedOrderItems = (order.orderItems ?? []).map((item) =>
          item.id === updatedItem.id
            ? {
                ...item,
                ...updatedItem,
                status: ORDER_ITEM_STATUSES.washingComplete,
              }
            : item
        );

        return {
          ...order,
          orderItems: updatedOrderItems,
        };
      })
    );
  };

  const handleConfirmOrder = async (id) => {
    await orderService.updateOrderStatus(id, ORDER_STATUSES.washingComplete);
    fetchOrders();
    console.log("Confirmed washing");
  };

  const checkOrderWashingComplete = (order) => {
    if (!order) {
      return false;
    }

    const orderItems = order.orderItems;
    if (!orderItems || !orderItems.length) {
      return false;
    }

    const isCompleted = orderItems.filter(
      (i) => i.status !== ORDER_ITEM_STATUSES.washingComplete
    )?.length;

    return isCompleted;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Изпиране в процес</h2>
      {loading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      {!loading && orders.length === 0 && (
        <div>
          <p>"Няма поръчки в процес на изпиране."</p>
        </div>
      )}

      <SearchableAccordion
        items={orders}
        search={params.searchTerm}
        onSearchChange={handleSearchChange}
        itemKeyFn={keyFn}
        renderContent={(order) => {
          const isCompleted = checkOrderWashingComplete(order);
          return (
            <div>
              <ManageOrderItemsActionsContainer
                className={styles.logisticActionsContainer}
              >
                <button
                  onClick={() => handleConfirmOrder(order.id)}
                  disabled={isCompleted}
                  // className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Confirm
                </button>
              </ManageOrderItemsActionsContainer>
              <ManageOrderItems
                products={products}
                orderItems={order.orderItems}
                onChangeStatus={(orderItem) =>
                  handleEditItem(order.id, orderItem)
                }
                // onDelete={handleDeleteItem}
              />
            </div>
          );
        }}
        renderTitle={(order) =>
          `${order.phoneNumber} -- ${order.userFullName} -- ${order.orderItems.length} бр.`
        }
      />

      {/* <Accordion className={styles.accordion}>
        {!loading &&
          orders.length > 0 &&
          orders.map((order) => (
            <Accordion.Item key={keyFn} id={keyFn}>
              <Accordion.Title>
                {order.customerName} ({order.status})
              </Accordion.Title>
              <Accordion.Content>
                {
                  <div>
                    <p>Address: {order.pickupAddress}</p>
                    <p>Date: {order.pickupDate}</p>
                  </div>
                }
              </Accordion.Content>
            </Accordion.Item>
          ))}
      </Accordion> */}
      {/* <SearchableAccordion
        items={orders}
        loading={loading}
        notFoundMessage="Няма поръчки в процес на изпиране."
        itemKeyFn={(order) => order.id}
        renderTitle={(order) => `${order.customerName} (${order.status})`}
        renderContent={(order) => (
          <div>
            <p>Address: {order.pickupAddress}</p>
            <p>Date: {order.pickuspDate}</p>
          </div>
        )}
      /> */}

      <Pagination
        currentPageIndex={params.pageIndex}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {/* <SearchableList
        items={orders}
        loading={loading}
        notFoundMessage="Няма поръчки в процес на изпиране."
        renderItem={renderOrder}
        getFilterFields={(order) => [
          order.customerName,
          order.phone,
          order.address,
        ]}
      /> */}
    </div>
  );
}
