import { useState, useMemo, useCallback } from "react";
// import {
//   getCleaningTypes,
//   getCleaningTypePrice,
// } from "../../utils/cleaningType.utils";

export default function OrderItemBaseInputData({
  orderItem,
  products,
  isExpress,
  onAdd,
  onCancel,
  renderHeader,
}) {
  const [productId, setProductId] = useState(orderItem?.productId ?? "");
  const [price, setPrice] = useState(orderItem?.price ?? 0);
  const [width, setWidth] = useState(orderItem?.width ?? 0);
  const [height, setHeight] = useState(orderItem?.height ?? 0);
  const [diagonal, setDiagonal] = useState(orderItem?.diagonal ?? 0);
  const [note, setNote] = useState(orderItem?.note ?? "");

  //const cleaningTypes = getCleaningTypes();

  const isPositiveNumber = (val) => {
    const n = Number(val);
    return n > 0 && !isNaN(n);
  };

  const errors = {
    width: width && !isPositiveNumber(width),
    height: height && !isPositiveNumber(height),
    diagonal: diagonal && !isPositiveNumber(diagonal),
  };

  // Auto-set price on type change
  const handleTypeChange = (e) => {
    const selected = e.target.value;
    setProductId(selected);
    const cleaningType = products.find((type) => type.id === selected);
    const basePrice = applyAdditions(cleaningType);
    setPrice(basePrice || 0);
  };

  const applyAdditions = useCallback(
    function applyAdditions(product) {
      let currentPrice = product.price;
      if (isExpress) {
        currentPrice = product.expressServicePrice;
      }

      return currentPrice;
    },
    [isExpress]
  );

  const totalPrice = useMemo(() => {
    if (!isPositiveNumber(price)) return 0;

    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(diagonal);

    if (isPositiveNumber(w) && isPositiveNumber(h)) {
      const total = +(w * h * price);

      return total;
    }

    if (isPositiveNumber(d)) {
      const total = +(d * d * Math.PI * price);

      return total;
    }

    return 0;
  }, [width, height, diagonal, price]);

  const isValid = productId && price;

  const handleAddClick = () => {
    if (!isValid || Object.values(errors).some(Boolean)) return;

    onAdd({
      id: orderItem?.id || null,
      productId,
      width: width || null,
      height: height || null,
      diagonal: diagonal || null,
      note: note.trim() || "",
    });

    // Reset form
    setProductId("");
    setPrice(0);
    setWidth("");
    setHeight("");
    setDiagonal("");
    setNote("");
  };

  // === Styles (unchanged) ===
  const labelStyle = {
    display: "block",
    fontWeight: "600",
    color: "#2D7DBF",
    marginBottom: 4,
  };

  const inputStyle = (error = false) => ({
    width: "100%",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: error ? "2px solid red" : "1px solid #2563eb",
    boxSizing: "border-box",
    marginTop: 4,
  });

  const errorTextStyle = {
    color: "red",
    fontSize: "0.875rem",
    marginTop: 4,
  };

  const fieldContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    border: "2px solid #2563eb",
    borderRadius: 4,
    backgroundColor: "#f8faff",
  };

  const addButtonStyle = {
    backgroundColor: "#2D7DBF",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "10px 16px",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: 8,
  };

  const dividerStyle = {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#2D7DBF",
    fontSize: "14px",
  };

  return (
    <fieldset style={fieldContainerStyle}>
      {renderHeader && renderHeader()}

      <label style={labelStyle}>
        Вид
        <select
          value={productId}
          onChange={handleTypeChange}
          style={inputStyle()}
        >
          <option value="">-- Изберете --</option>
          {products.map((cleaningType) => (
            <option key={cleaningType.id} value={cleaningType.id}>
              {cleaningType.name} - {applyAdditions(cleaningType).toFixed(2)}{" "}
              лв.
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Ширина
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={!width ? "" : width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={inputStyle(errors.width)}
        />
        {!!errors.width && (
          <small style={errorTextStyle}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <label style={labelStyle}>
        Височина
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={height ? height : ""}
          onChange={(e) => setHeight(Number(e.target.value))}
          style={inputStyle(errors.height)}
        />
        {!!errors.height && (
          <small style={errorTextStyle}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <div style={dividerStyle}>или</div>

      <label style={labelStyle}>
        Диагонал
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={diagonal ? diagonal : ""}
          onChange={(e) => setDiagonal(e.target.value)}
          style={inputStyle(errors.diagonal)}
        />
        {!!errors.diagonal && (
          <small style={errorTextStyle}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <label style={labelStyle}>
        Бележка
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Допълнителна информация..."
          style={{
            ...inputStyle(),
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </label>

      {isValid && (
        <div style={{ fontWeight: "bold", color: "#2D7DBF", fontSize: 16 }}>
          Обща цена: {totalPrice.toFixed(2)} лв.
        </div>
      )}

      <div
        style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            ...addButtonStyle,
            color: "#2D7DBF",
            backgroundColor: "initial",
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleAddClick}
          style={addButtonStyle}
          disabled={!isValid}
        >
          + Добави
        </button>
      </div>
    </fieldset>
  );
}
