import { useState } from "react";
import SpeechTextarea from "../../../UI/SpeechTextarea/SpeechTextarea";
import { dateUtil, timeRanges } from "../../../../utils";

export default function OrderDeliveryForm({
  isDelivery,
  order,
  onSave,
  onBack,
}) {
  const today = dateUtil.getCurrentDateFormatted("YYYY-MM-DD");
  const [deliveryDate, setDeliveryDate] = useState(today);
  const [deliveryTimeRange, setDeliveryTimeRange] = useState(timeRanges[0]);
  const [orderNote, setOrderNote] = useState(order.note ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState(
    order.deliveryAddress ?? ""
  );
  const [sameAsPickup, setSameAsPickup] = useState(true);

  const handleOrderNoteChange = (value) => setOrderNote(value);
  const handleDeliveryAddressChange = (value) => setDeliveryAddress(value);

  const handleSameAsPickupChange = (e) => {
    const checked = e.target.checked;
    setSameAsPickup(checked);

    if (checked) {
      setDeliveryAddress(order.pickupAddress || "");
    } else {
      setDeliveryAddress("");
    }
  };

  const handleSave = () => {
    const payload = {
      deliveryDate,
      deliveryTimeRange,
      deliveryAddressId: order.pickupAddressId,
      orderNote,
    };

    // Call parent or API
    if (onSave) {
      onSave(order.id, payload, isDelivery);
    }
  };

  const orderTotal =
    order?.orderItems?.reduce((acc, item) => {
      const area = item.diagonal ?? item.width * item.height;
      const itemTotal = item.price ? area * item.price : area;
      return acc + itemTotal;
    }, 0) ?? 0;

  const labelStyle = {
    display: "block",
    padding: "8px 0",
    fontWeight: "600",
    color: "#2D7DBF",
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

  const actionContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    margin: "12px",
  };

  return (
    <>
      <h3>{isDelivery ? "Доставка" : "Вземане"}</h3>
      <label style={labelStyle}>
        Име на клиента
        <input
          type="text"
          value={order.userFullName || ""}
          disabled
          style={inputSelectStyle(false)}
        />
      </label>

      <label style={labelStyle}>
        Адрес за взимане
        <input
          type="text"
          value={order.pickupAddress || ""}
          disabled
          style={inputSelectStyle(false)}
        />
      </label>

      {/* Same as pickup checkbox */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <input
          type="checkbox"
          id="sameAsPickup"
          checked={sameAsPickup}
          onChange={handleSameAsPickupChange}
          disabled={true}
        />
        <label htmlFor="sameAsPickup">Същият като адреса за взимане</label>
      </div>

      <label style={labelStyle}>
        Адрес за доставка
        <SpeechTextarea
          id={`order-address-${order.id}`}
          value={deliveryAddress}
          onChange={handleDeliveryAddressChange}
          disabled={sameAsPickup}
        />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label style={{ ...labelStyle, width: "30%" }}>
          <p style={{ margin: "auto" }}>Дата на доставка</p>
          <input
            type="date"
            value={deliveryDate}
            min={today}
            onChange={(e) => setDeliveryDate(e.target.value)}
            style={inputSelectStyle(false)}
          />
        </label>

        <label style={{ ...labelStyle, width: "45%" }}>
          <p style={{ margin: "auto" }}>Часови диапазон</p>
          <select
            value={deliveryTimeRange}
            onChange={(e) => setDeliveryTimeRange(e.target.value)}
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
          <p style={{ margin: "auto" }}>Обща стойност</p>
          <input type="number" min="1" value={orderTotal} disabled required />
        </label>
      </div>

      <label style={labelStyle}>
        Бележка
        <SpeechTextarea
          id="order-note"
          value={orderNote}
          onChange={handleOrderNoteChange}
        />
      </label>

      <div style={actionContainerStyle}>
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#2D7DBF",
          }}
        >
          Върни се назад
        </button>

        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2D7DBF",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Запази
        </button>
      </div>
    </>
  );
}
