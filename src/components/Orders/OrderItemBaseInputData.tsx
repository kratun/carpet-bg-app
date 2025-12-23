import { useState, useMemo, useCallback, ChangeEvent } from "react";
import ModalHeader from "../UI/Modal/ModalHeader";

import styles from "./OrderItemBaseInputData.module.css";
import { ProductType } from "../../types/product.type";
import { OrderItemDto, UpdateOrderItem } from "../../types";

interface OrderItemBaseInputDataProps {
  title?: string;
  orderItem?: OrderItemDto;
  products: ProductType[];
  isExpress?: boolean;
  onAdd: (item: Partial<OrderItemDto>) => void;
  onCancel: () => void;
}

export default function OrderItemBaseInputData({
  title,
  orderItem,
  products,
  isExpress = false,
  onAdd,
  onCancel,
}: OrderItemBaseInputDataProps) {
  const [productId, setProductId] = useState<string>(
    orderItem?.productId ?? ""
  );
  const [price, setPrice] = useState<number>(orderItem?.price ?? 0);
  const [width, setWidth] = useState<number | "">(orderItem?.width ?? "");
  const [height, setHeight] = useState<number | "">(orderItem?.height ?? "");
  const [diagonal, setDiagonal] = useState<number | "">(
    orderItem?.diagonal ?? ""
  );
  const [note, setNote] = useState(orderItem?.note ?? "");

  const isPositiveNumber = (val: number | string) => {
    const n = Number(val);
    return n > 0 && !isNaN(n);
  };

  const errors = {
    width: width !== "" && !isPositiveNumber(width),
    height: height !== "" && !isPositiveNumber(height),
    diagonal: diagonal !== "" && !isPositiveNumber(diagonal),
  };

  const applyAdditions = useCallback(
    (product: ProductType) => {
      if (!product) return 0;
      return isExpress
        ? product.expressServicePrice ?? product.price
        : product.price;
    },
    [isExpress]
  );

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setProductId(selectedId);
    const selectedProduct = products.find((p) => String(p.id) === selectedId);
    if (selectedProduct) setPrice(applyAdditions(selectedProduct));
  };

  const totalPrice = useMemo(() => {
    if (!isPositiveNumber(price)) return 0;

    const w = Number(width);
    const h = Number(height);
    const d = Number(diagonal);

    if (isPositiveNumber(w) && isPositiveNumber(h)) return +(w * h * price);

    if (isPositiveNumber(d)) {
      const radius = d / 2;
      return +(radius * radius * Math.PI * price);
    }

    return 0;
  }, [width, height, diagonal, price]);

  const isValid =
    productId !== "" &&
    isPositiveNumber(price) &&
    !Object.values(errors).some(Boolean);

  const handleAddClick = () => {
    if (!isValid) return;

    onAdd({
      id: orderItem?.id,
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

  return (
    <fieldset className={styles.fieldContainer}>
      <ModalHeader title={title} onClose={onCancel} />

      <label className={styles.label} htmlFor="productId">
        Вид
        <select
          id="productId"
          name="productId"
          value={productId}
          onChange={handleTypeChange}
          className={styles.input}
        >
          <option value="">-- Изберете --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} - {applyAdditions(p).toFixed(2)} лв.
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label} htmlFor="width">
        Ширина
        <input
          type="number"
          id="width"
          name="width"
          min={0.01}
          step={0.01}
          value={width}
          onChange={(e) =>
            setWidth(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={`${styles.input} ${errors.width ? styles.inputError : ""}`}
        />
        {errors.width && (
          <small className={styles.errorText}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <label className={styles.label} htmlFor="height">
        Височина
        <input
          type="number"
          id="height"
          name="height"
          min={0.01}
          step={0.01}
          value={height}
          onChange={(e) =>
            setHeight(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={`${styles.input} ${
            errors.height ? styles.inputError : ""
          }`}
        />
        {errors.height && (
          <small className={styles.errorText}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <div className={styles.divider}>или</div>

      <label className={styles.label} htmlFor="diagonal">
        Диагонал
        <input
          type="number"
          id="diagonal"
          name="diagonal"
          min={0.01}
          step={0.01}
          value={diagonal}
          onChange={(e) =>
            setDiagonal(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={`${styles.input} ${
            errors.diagonal ? styles.inputError : ""
          }`}
        />
        {errors.diagonal && (
          <small className={styles.errorText}>
            Моля, въведете положително число &gt; 0
          </small>
        )}
      </label>

      <label className={styles.label} htmlFor="note">
        Бележка
        <textarea
          id="note"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Допълнителна информация..."
          className={styles.input}
        />
      </label>

      {isValid && (
        <div className={styles.totalPrice}>
          Обща цена: {totalPrice.toFixed(2)} лв.
        </div>
      )}

      <div className={styles.buttonsContainer}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleAddClick}
          className={styles.addButton}
          disabled={!isValid}
        >
          + Добави
        </button>
      </div>
    </fieldset>
  );
}
