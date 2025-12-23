import { MouseEvent } from "react";
import Icon, { ICONS } from "../../../UI/Icons/Icon";

import {
  OrderItemDto,
  OrderItemStatuses,
  ProductType,
} from "../../../../types";
import styles from "./ManageOrderItems.module.css";

export type ManageOrderItemsProps = {
  title?: string;
  orderItems: Partial<OrderItemDto>[];
  products: ProductType[];
  isExpress?: boolean;
  onEdit?: (item: Partial<OrderItemDto>, index: number) => void;
  onDelete?: (itemId: string) => void;
  onChangeStatus?: (item: Partial<OrderItemDto>) => void;
};

export default function ManageOrderItems({
  title,
  orderItems,
  products,
  isExpress = false,
  onEdit,
  onDelete,
  onChangeStatus,
}: ManageOrderItemsProps) {
  const handleEditItem = (
    e: MouseEvent<HTMLButtonElement>,
    item: Partial<OrderItemDto>,
    index: number
  ) => {
    e.preventDefault();
    onEdit?.(item, index);
  };

  const handleChangeStatus = (
    e: MouseEvent<HTMLButtonElement>,
    item: Partial<OrderItemDto>
  ) => {
    e.preventDefault();

    if (item.status === OrderItemStatuses.washingComplete) {
      return;
    }

    onChangeStatus?.(item);
  };

  const getProduct = (id?: string | null) => products.find((p) => p.id === id);

  const getPrice = (id?: string | null): number | null => {
    const product = getProduct(id);
    if (!product) return null;

    return isExpress
      ? product.expressServicePrice ?? product.price
      : product.price;
  };

  const getProductName = (id?: string | null): string => {
    const product = getProduct(id);
    return product?.name ?? "Непозната услуга";
  };

  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}

      {!orderItems.length && (
        <div className={styles.empty}>Няма налични услуги</div>
      )}

      {!products.length && (
        <div className={styles.loading}>Зареждане на продукти...</div>
      )}

      {products.length > 0 &&
        orderItems.map((item, index) => {
          const price = getPrice(item.productId);
          const itemId = item.id ?? index + "";
          return (
            <div key={itemId} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <p className={styles.itemTitle}>
                  {index + 1}. {getProductName(item.productId)}
                  {price !== null
                    ? ` - ${price.toFixed(2)} лв./м²`
                    : " - Цена неизвестна"}
                </p>

                <p className={styles.itemDetails}>
                  {item.width &&
                    item.height &&
                    `${item.width.toFixed(2)} × ${item.height.toFixed(2)} м.`}

                  {item.diagonal && ` Диагонал: ${item.diagonal} м.`}

                  {item.note && ` — ${item.note}`}
                </p>
              </div>

              <div className={styles.actions}>
                {onEdit && (
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={(e) => handleEditItem(e, item, index)}
                  >
                    <Icon name={ICONS.edit} color="#2563eb" />
                  </button>
                )}

                {onChangeStatus && (
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={(e) => handleChangeStatus(e, item)}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2.5}
                      name={
                        item.status === OrderItemStatuses.washingComplete
                          ? ICONS.checkCircle
                          : ICONS.playCircle
                      }
                      color={
                        item.status === OrderItemStatuses.washingComplete
                          ? "#2563eb"
                          : "#f97316"
                      }
                    />
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => onDelete(itemId)}
                  >
                    <Icon name={ICONS.delete} color="red" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
