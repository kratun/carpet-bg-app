import { useState } from "react";
import Icon, { ICONS } from "../../../UI/Icons/Icon";

import ManageOrderItems from "../ManageOrderItems/ManageOrderItems";
import ActionsContainer from "../../../UI/Actions/ActionsContainer";

import {
  OrderDto,
  OrderItemDto,
  OrderStatuses,
  ProductType,
} from "../../../../types";
import styles from "./LogisticPickupForm.module.css";
import OrderItemBaseInputData from "../../OrderItemBaseInputData";

interface LogisticPickupFormProps {
  order: OrderDto;
  products: ProductType[];
  onAddOrderItem: (
    item: Partial<OrderItemDto>,
    orderId: OrderDto["id"]
  ) => void;
  onPickupConfirm?: (order: OrderDto) => void;
  onRevertStatus?: (orderId: OrderDto["id"], status: OrderStatuses) => void;
}

/* =======================
   Component
======================= */

export default function LogisticPickupForm({
  order,
  products,
  onAddOrderItem,
  onPickupConfirm,
  onRevertStatus,
}: LogisticPickupFormProps) {
  const items = order.orderItems ?? [];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* =======================
     Handlers
  ======================= */

  const handleAddOrderItem = (item: Partial<OrderItemDto>) => {
    onAddOrderItem(item, order.id);
  };

  const handleEditItem = (updatedItem: Partial<OrderItemDto>) => {
    alert("Edit item functionality is not implemented yet.");
    console.log("Edit item:", updatedItem);
  };

  const handleDeleteItem = (itemId: OrderItemDto["id"]) => {
    alert("Delete item functionality is not implemented yet.");
    console.log("Delete item with id:", itemId);
  };

  const handleConfirmPickup = async () => {
    try {
      setIsSubmitting(true);
      onPickupConfirm?.(order);
    } catch (error) {
      console.error("Pickup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertStatus = async () => {
    try {
      setIsSubmitting(true);
      onRevertStatus?.(order.id, OrderStatuses.new);
    } catch (error) {
      console.error("Status revert failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <ActionsContainer className={styles.logisticActionsContainer}>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={styles.actionButton}
        >
          <Icon name={ICONS.add} color="#2563eb" />
          Добави услуга
        </button>
      </ActionsContainer>

      <ManageOrderItems
        isExpress={order.isExpress}
        orderItems={items}
        products={products}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      <ActionsContainer className={styles.logisticActionsContainer}>
        <button
          type="button"
          onClick={handleRevertStatus}
          className={styles.actionButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Status reverting..." : "Revert Status"}
        </button>

        <button
          type="button"
          onClick={handleConfirmPickup}
          disabled={isSubmitting}
          className={styles.primaryButton}
        >
          {isSubmitting ? "Confirming..." : "Confirm Pickup"}
        </button>
      </ActionsContainer>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <OrderItemBaseInputData
              title="Добави услуга"
              products={products}
              isExpress={order.isExpress}
              onAdd={(item: Partial<OrderItemDto>) => {
                handleAddOrderItem(item);
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
