import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { customerService } from "../../services/customerService";
import { orderService } from "../../services/orderService";
import { ORDER_STATUSES } from "../../utils/statuses.util.js";

import { useToastContext } from "../../stores/ToastContext";
import { dateUtil, timeRanges } from "../../../../utils";

export default function DeliveryDataSetupStep() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("addressId");

  const { toastSuccess, toastError } = useToastContext();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const [customer, setCustomer] = useState({
    id: 0,
    phoneNumber: "",
    displayAddress: "",
  });

  const today = dateUtil.getCurrentDateFormatted();

  const [pickupDate, setPickupDate] = useState(today);
  const [pickupTimeRange, setPickupTimeRange] = useState(timeRanges[0]);
  const [count, setCount] = useState(1);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diagonal, setDiagonal] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!addressId) return;

      try {
        const customer = await customerService.getById(Number(addressId));
        if (customer) {
          setCustomer(customer);
        }
      } catch (err) {
        toastError("Грешка при зареждане на клиента.", "error");
        console.error(err);
      }
    };

    fetchCustomer();
  }, [addressId, toastError]);

  const isPositiveNumber = (val) => {
    const n = Number(val);
    return n > 0 && !isNaN(n);
  };

  useEffect(() => {
    if (width || height) {
      if (diagonal) setDiagonal("");
    }
  }, [width, height, diagonal]);

  useEffect(() => {
    if (diagonal) {
      if (width || height) {
        setWidth("");
        setHeight("");
      }
    }
  }, [diagonal, width, height]);

  const errors = {
    count: count && !isPositiveNumber(count),
    width: width && !isPositiveNumber(width),
    height: height && !isPositiveNumber(height),
    diagonal: diagonal && !isPositiveNumber(diagonal),
  };

  const isSubmitDisabled = !count || Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const orderData = {
      customerId: customer.id,
      customerName: customer.name,
      pickupAddress: customer.displayAddress,
      pickupDate: dateUtil.format(pickupDate, "YYYY-MM-DD"),
      pickupTimeRange,
      count: Number(count),
      width: width ? Number(width) : null,
      height: height ? Number(height) : null,
      diagonal: diagonal ? Number(diagonal) : null,
      status: ORDER_STATUSES.pendingDelivery,
    };

    try {
      const savedOrder = await orderService.create(orderData);
      toastSuccess("Saved order:", savedOrder);
      navigate(`/orders`);
    } catch (err) {
      toastError("Грешка при създаване на поръчката.", "error");
      console.error(err);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: 480,
    margin: "2rem auto",
    fontFamily: "Arial, sans-serif",
    padding: 16,
    boxSizing: "border-box",
    color: "#1e3a8a", // <-- added
  };

  const buttonBackStyle = {
    marginBottom: 20,
    background: "none",
    border: "none",
    color: "#2D7DBF",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  };

  const headingStyle = {
    color: "#2D7DBF",
    marginBottom: 8,
  };

  const customerNameStyle = {
    margin: "0 0 12px",
    fontWeight: "bold",
  };

  const addressStyle = {
    margin: "0 0 20px",
    color: "#555",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontWeight: "600",
    color: "#2D7DBF",
    marginTop: 16,
  };

  const inputSelectStyle = (error) => ({
    display: "block",
    width: "100%",
    padding: 8,
    fontSize: 16,
    marginTop: 4,
    borderRadius: 4,
    border: error ? "2px solid red" : "1px solid #2563eb", // <-- new default border
    boxSizing: "border-box",
  });

  const errorTextStyle = {
    color: "red",
    fontSize: "0.875rem",
    marginTop: 4,
  };

  const submitButtonStyle = {
    marginTop: 24,
    padding: "12px 20px",
    backgroundColor: isSubmitDisabled ? "#aac4e8" : "#2D7DBF",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    fontSize: 16,
    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          input:focus, select:focus {
            outline: none;
            border: 2px solid #2563eb !important;
          }
        `}
      </style>
      <button onClick={handleBack} style={buttonBackStyle}>
        ← Назад
      </button>

      <h2 style={headingStyle}>Поръчка за:</h2>
      <p style={customerNameStyle}>{customer.name}</p>
      <p style={addressStyle}>{customer.displayAddress}</p>

      <form onSubmit={handleSubmit} noValidate>
        <label style={labelStyle}>
          Дата на взимане
          <input
            type="date"
            value={pickupDate}
            min={today}
            onChange={(e) => setPickupDate(e.target.value)}
            style={inputSelectStyle(false)}
          />
        </label>

        <label style={labelStyle}>
          Часов диапазон
          <select
            value={pickupTimeRange}
            onChange={(e) => setPickupTimeRange(e.target.value)}
            style={inputSelectStyle(false)}
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Приблизителен брой артикули
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={inputSelectStyle(errors.count)}
            required
          />
          {errors.count && (
            <small style={errorTextStyle}>
              Моля, въведете положително число &gt; 0
            </small>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          style={submitButtonStyle}
        >
          Запази
        </button>
      </form>
    </div>
  );
}
