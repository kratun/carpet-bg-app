import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import { orderService } from "../../services/orderService";
import { OrderType, PaginationType } from "../../types";
import { getStatusDisplayName } from "../../utils/statuses.util";
import { dateUtil } from "../../utils/date.utils";
import { getNumberWithPrecisionAsString } from "../../utils/order.utils";

import Loading from "../../components/UI/Loading";
import Pagination from "../../components/UI/Pagination/Pagination";
import Icon, { ICONS } from "../../components/UI/Icons/Icon";
import styles from "./Orders.module.css";

const initialPaginationState = {
  currentPageIndex: 0,
  totalPages: 1,
};

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [params, setParams] = useState({
    searchTerm: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 10,
    filters: {},
  });

  const [pagination, setPagination] = useState(initialPaginationState);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { items, pageIndex, totalPages }: PaginationType<OrderType> =
      await orderService.getAll(params);
    setOrders(items);
    setPagination((prev) => ({
      ...prev,
      currentPageIndex: pageIndex,
      totalPages: totalPages,
    }));

    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearchChange = debounce((value) => {
    const trimmedValue = value?.trim() || null;
    setParams((prev) => ({
      ...prev,
      searchTerm: trimmedValue,
      pageNumber: 1,
    }));
  }, 300);

  const handleSort = (field: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (nextPageIndex: Number) => {
    setParams((prev) => ({ ...prev, pageIndex: nextPageIndex }));
  };

  const isMobile = window.innerWidth <= 768;
  function handleQuickView(order: OrderType) {
    navigate(`/orders/${order.id}`);
    console.log(order);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Поръчки</h1>

      <input
        type="text"
        placeholder="Търсене..."
        onChange={(e) => handleSearchChange(e.target.value)}
        className={styles.search}
      />

      {!isMobile ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("customerName")}>Phone</th>
              <th onClick={() => handleSort("pickupDate")}>Create At</th>
              {/* <th onClick={() => handleSort("pickupDate")}>Pick up Date</th> */}
              <th>Items</th>
              <th>Total Amount</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={styles.center}>
                  <Loading />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className={styles.center}>Няма намерени поръчки</td>
              </tr>
            ) : (
              orders.map((order: OrderType) => (
                <tr key={order.id}>
                  <td>{order.phoneNumber}</td>
                  <td>{dateUtil.format(order.createdAt)}</td>
                  <td className={styles.textRight}>
                    {order.orderItems.length}
                  </td>
                  <td className={styles.textRight}>
                    {getNumberWithPrecisionAsString(order.totalAmount)}
                  </td>
                  <td>
                    <span className={styles.tooltip}>
                      {(order.pickupAddress || "").slice(0, 20)}
                      {order.pickupAddress?.length > 20 && "…"}
                      {order.pickupAddress !== order.deliveryAddress &&
                        order.deliveryAddress?.length > 20 && (
                          <span className={styles.tooltipText}>
                            {order.deliveryAddress || order.pickupAddress}
                          </span>
                        )}
                    </span>
                  </td>
                  <td>{getStatusDisplayName(order.status)}</td>
                  <td>
                    <button className={styles.actionBtn}>
                      <Icon name={ICONS.view} size={24} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <div className={styles.cards}>
          {orders.map((order: OrderType, idx: number) => (
            <div key={idx} className={styles.card}>
              <p>
                <strong>Клиент:</strong> {order.customerName}
              </p>
              <p>
                <strong>Дата:</strong> {order.pickupDate}
              </p>
              <p>
                <strong>Час:</strong> {order.pickupTimeRange}
              </p>
              <p>
                <strong>Адрес:</strong> {order.pickupAddress}
              </p>
              <p>
                <strong>Брой:</strong> {order.orderItems.length} артикула
              </p>
              <p>
                <strong>Статус:</strong> {getStatusDisplayName(order.status)}
              </p>
              <button
                className={styles.actionBtn}
                onClick={() => handleQuickView(order)}
              >
                <Icon name={ICONS.view} size={24} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPageIndex={pagination.currentPageIndex}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
