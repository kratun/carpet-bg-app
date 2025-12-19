import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { dateUtil } from "../../utils/date.utils.js";

import { customerService } from "../../services/customerService.js";
import { orderService } from "../../services/orderService.js";
import { productService } from "../../services/productService.js";
import { useToastContext } from "../../stores/ToastContext.jsx";

import { ORDER_STATUSES } from "../../utils/statuses.util.js";
import Icon, { ICONS } from "../../components/UI/Icons/Icon.jsx";

import SpeechTextarea from "../../components/UI/SpeechTextarea/SpeechTextarea.jsx";
import OrderItemBaseInputData from "../../components/Orders/OrderItemBaseInputData.jsx";
import ManageOrderItems from "../../components/Orders/OrderManager/ManageOrderItems/ManageOrderItems.jsx";
import ManageOrderItemsActionsContainer from "../../components/Orders/OrderManager/ManageOrderItems/ManageOrderItemsActionsContainer.jsx";

//const today = dayjs().format("YYYY-MM-DD");

const timeRanges = [
  "09:00 - 10:00",
  "10:00 - 11:30",
  "11:30 - 13:00",
  "13:00 - 14:30",
  "14:30 - 16:00",
  "16:00 - 17:30",
  "17:30 - 19:00",
];

export default function Order() {
  const today = dateUtil.today();
  const navigate = useNavigate();
  const { id } = useParams();
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

  const [addressData, setAddressData] = useState({
    id: 0,
    userFullName: "",
    phoneNumber: "",
    displayAddress: "",
  });
  const [pickupDate, setPickupDate] = useState(today);
  const [pickupTimeRange, setPickupTimeRange] = useState(timeRanges[0]);
  const [count, setCount] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [orderNote, setOrderNote] = useState("");
  const [isExpress, setIsExpress] = useState(false);
  const [products, setProducts] = useState([]);

  const handleAddOrderItem = (item) => {
    setOrderItems((prev) => [...prev, { ...item }]);
    setCount(orderItems.length + 1);
  };

  const handleOrderNoteChange = (value) => {
    setOrderNote(value);
  };

  const handleEditItem = (row, index) => {
    console.log("Edit item:", row, "at index:", index);
  };

  const handleDeleteItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    maxWidth: "90%",
    width: 400,
  };

  useEffect(() => {
    // const fetchCustomerData = async () => {
    //   if (!addressId) {
    //     return;
    //   }

    //   try {
    //     const address = await customerService.getById(addressId);
    //     if (address) {
    //       setAddressData(address);
    //     }
    //   } catch (err) {
    //     toastError("Грешка при зареждане на клиента.", "error");
    //     console.error(err);
    //   }
    // };
    // fetchCustomerData();
    const fetchData = async () => {
      try {
        const productList = await productService.getAll();
        if (productList && productList.length > 0) {
          setProducts(productList);
        }

        if (id) {
          const order = await orderService.getById(id);

          if (order) {
            setAddressData({
              id: order.pickupAddressId,
              userFullName: order.userFullName,
              phoneNumber: order.phoneNumber,
              displayAddress: order.pickupAddress,
            });
            setPickupDate(dateUtil.format(order.pickupDate));
            setPickupTimeRange(order.pickupTimeRange);
            setCount(order.orderItems.length || 1);
            setOrderItems(order.orderItems);
            setOrderNote(order.note ?? "");
          }

          return;
        }

        if (addressId) {
          const address = await customerService.getById(addressId);

          if (address) {
            setAddressData(address);
            setOrderNote(address.displayAddress ?? "");
          }

          return;
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toastError("Грешка при зареждане на данните.", "error");
      }
    };

    fetchData();
  }, [addressId, id, toastError]);

  const errors = {
    count: count && !(Number(count) > 0),
  };

  const isSubmitDisabled = !count || Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const orderData = {
      addressId: addressData.id,
      customerId: addressData.userId,
      customerPhoneNumber: addressData.phoneNumber,
      pickupAddressId: addressData.id,
      pickupDate: dateUtil.format(pickupDate, "YYYY-MM-DD"),
      pickupTimeRange,
      count: Number(count),
      status: ORDER_STATUSES.pendingPickup,
      orderItems,
      note: orderNote.trim() || null,
      isExpress,
    };

    try {
      if (id) {
        await orderService.update(id, orderData);
        toastSuccess("Поръчката е обновена.");
      } else {
        await orderService.create(orderData);
        toastSuccess("Поръчката е създадена.");
      }

      navigate(`/orders`);
    } catch (err) {
      toastError("Грешка при запазване на поръчката.", "error");
      console.error(err);
    }
  };

  const containerStyle = {
    maxWidth: 480,
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    padding: 16,
    boxSizing: "border-box",
    color: "#1e3a8a",
  };

  const buttonBackStyle = {
    background: "none",
    border: "none",
    color: "#2D7DBF",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 0,
  };

  const headingStyle = {
    color: "#2D7DBF",
    marginBottom: 8,
    marginTop: 8,
  };

  const labelStyle = {
    display: "flex", // Flex layout inside each label
    flexDirection: "column", // Stack items vertically
    justifyContent: "space-between", // Space them to fill the label height
    height: "100%", // Fill the parent container's height
    fontWeight: "600",
    color: "#2D7DBF",
    padding: "8px 0",
  };

  const checkboxStyle = {
    display: "flex", // Flex layout inside each label
    flexDirection: "row", // Stack items vertically
    justifyContent: "space-between", // Space them to fill the label height
    height: "100%", // Fill the parent container's height
    fontWeight: "600",
    color: "#2D7DBF",
    padding: "8px 0",
  };

  const inputSelectStyle = (error) => ({
    display: "block",
    width: "100%",
    padding: 8,
    fontSize: 16,
    marginTop: 4,
    borderRadius: 4,
    border: error ? "2px solid red" : "1px solid #2563eb",
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

  const fieldsetStyle = {
    display: "flex",
    flexDirection: "column",
    border: "2px solid #2563eb",
    borderRadius: 4,
    padding: 10,
    marginTop: 24,
    gap: 8,
  };

  const legendStyle = {
    color: "#2D7DBF",
    fontWeight: "bold",
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
    padding: "0",
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

      <h2 style={headingStyle}>Създай поръчка</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={isExpress}
              onChange={(e) => setIsExpress(e.target.checked)}
            />
            Експресна поръчка
          </label>
        </div>

        <label style={labelStyle}>
          Име на клиента
          <input
            type="text"
            value={addressData.userFullName}
            disabled
            style={inputSelectStyle(false)}
          />
        </label>
        <label style={labelStyle}>
          Телефон
          <input
            type="text"
            value={addressData.phoneNumber}
            disabled
            style={inputSelectStyle(false)}
          />
        </label>
        <label style={labelStyle}>
          Адрес за взимане
          <input
            type="text"
            value={addressData.displayAddress}
            disabled
            style={inputSelectStyle(false)}
          />
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "stretch", // Ensure children stretch vertically
            gap: "8px",
            height: "90px", // Example fixed height, can be dynamic
          }}
        >
          <label style={{ ...labelStyle, width: "30%" }}>
            <p style={{ margin: 0 }}>Дата на взимане</p>
            <input
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => setPickupDate(e.target.value)}
              style={inputSelectStyle(false)}
            />
          </label>

          <label style={{ ...labelStyle, width: "40%" }}>
            <p style={{ margin: 0 }}>Часови диапазон</p>
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

          <label style={{ ...labelStyle, width: "30%" }}>
            <p style={{ margin: 0 }}>Брой артикули</p>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={inputSelectStyle(errors.count)}
              disabled={orderItems.length > 0}
              required
            />
            {errors.count && (
              <small style={errorTextStyle}>
                Моля, въведете положително число &gt; 0
              </small>
            )}
          </label>
        </div>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Добавени услуги</legend>
          <ManageOrderItemsActionsContainer>
            <button
              type="button"
              onClick={handleOpenModal}
              style={{
                background: "white",
                border: "1px solid #2563eb",
                borderRadius: 4,
                cursor: "pointer",
                minWidth: "20%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Icon name={ICONS.add} color="#2563eb" /> Добави услуга
            </button>
          </ManageOrderItemsActionsContainer>

          <ManageOrderItems
            isExpress={isExpress}
            orderItems={orderItems}
            products={products}
            onAdd={handleAddOrderItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        </fieldset>

        <SpeechTextarea
          id="order-note"
          value={orderNote}
          onChange={handleOrderNoteChange}
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          style={submitButtonStyle}
        >
          Save
        </button>
      </form>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <OrderItemBaseInputData
              orderItem={{}}
              products={products}
              isExpress={isExpress}
              renderHeader={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <p>Добави услуга</p>
                  <button
                    onClick={handleCloseModal}
                    style={closeButtonStyle}
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
              )}
              onAdd={(item) => {
                handleAddOrderItem(item);
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
