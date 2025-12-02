import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import { orderService } from "../../services/orderService";
import { getStatusDisplayName } from "../../utils/statuses.util";

import Loading from "../UI/Loading";
import Pagination from "../UI/Pagination/Pagination";
import Icon, { ICONS } from "../UI/Icons/Icon";
import styles from "./Orders.module.css";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [params, setParams] = useState({
    searchTerm: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    pageNumber: 1,
    pageSize: 5,
    filters: {},
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await orderService.getAll(params);
    setOrders(result.items);
    setTotal(result.total);
    setLoading(false);
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / params.pageSize);

  const handleSearchChange = debounce((value) => {
    setParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, 300);

  const handleSort = (field) => {
    setParams((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handlePageChange = (newPage) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const isMobile = window.innerWidth <= 768;
  function handleQuickView(order) {
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
              <th onClick={() => handleSort("pickupDate")}>Pick up Date</th>
              <th>Time Range</th>
              <th>Pick up Address</th>
              <th>Delivery Address</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className={styles.center}>
                  <Loading />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.center}>
                  Няма намерени поръчки
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customerPhoneNumber}</td>
                  <td>{order.pickupDate}</td>
                  <td>{order.pickupTimeRange}</td>
                  <td>{order.pickupAddress}</td>
                  <td>{order.deliveryAddress}</td>
                  <td>{order.count}</td>
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
          {orders.map((order, idx) => (
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
                <strong>Брой:</strong> {order.count}
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
        currentPage={params.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
