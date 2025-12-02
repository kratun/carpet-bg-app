import { useState } from "react";
import Icon, { ICONS } from "../../../UI/Icons/Icon";

import { ORDER_STATUSES } from "../../../../utils/statuses.util.js";

import ManageOrderItems from "../ManageOrderItems/ManageOrderItems";
import ManageOrderItemsActionsContainer from "../ManageOrderItems/ManageOrderItemsActionsContainer";
import OrderItemBaseInputData from "../../OrderItemBaseInputData";
import styles from "./LogisticPickupForm.module.css";

export default function LogisticPickupForm({
  order,
  products,
  onAddOrderItem,
  onEditOrderItem,
  onDeleteOrderItem,
  onPickupConfirm,
  onRevertStatus,
}) {
  const items = order.orderItems || [];
  //const [items, setItems] = useState(order.orderItems || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOrderItem = (item) => {
    onAddOrderItem(item, order.id);
  };

  const handleEditItem = (updatedItem) => {
    onEditOrderItem(updatedItem, order.id);
    // setItems((prev) =>
    //   prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    // );
  };

  const handleDeleteItem = (itemId) => {
    onDeleteOrderItem(itemId, order.id);
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

  const handleConfirmPickup = async () => {
    // if (items.length === 0) {
    //   //alert("You must add at least one order item before confirming pickup.");
    //   return;
    // }

    try {
      setIsSubmitting(true);

      // Replace with your actual API call or mutation
      // await fakeConfirmPickupApi({ orderId: order.id, items });

      //alert("Pickup confirmed.");
      onPickupConfirm?.(order); // Let parent refetch
    } catch (error) {
      console.error("Pickup failed:", error);
      // alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertStatus = async () => {
    // if (items.length === 0) {
    //   //alert("You must add at least one order item before confirming pickup.");
    //   return;
    // }

    try {
      setIsSubmitting(true);

      // Replace with your actual API call or mutation
      // await fakeConfirmPickupApi({ orderId: order.id, items });

      //alert("Pickup confirmed.");
      const nextStatus = ORDER_STATUSES.new;
      onRevertStatus?.(order.id, nextStatus); // Let parent refetch
    } catch (error) {
      console.error("Pickup failed:", error);
      // alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <ManageOrderItemsActionsContainer
        className={styles.logisticActionsContainer}
      >
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
        orderItems={items}
        products={products}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
      <ManageOrderItemsActionsContainer
        className={styles.logisticActionsContainer}
      >
        <button
          type="button"
          onClick={handleRevertStatus}
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
          {isSubmitting ? "Status reverting..." : "Revert Status"}
        </button>

        <button
          onClick={handleConfirmPickup}
          disabled={isSubmitting}
          // className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Confirming..." : "Confirm Pickup"}
        </button>
      </ManageOrderItemsActionsContainer>
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <OrderItemBaseInputData
              products={products}
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

// // Example mock function for simulating API call
// async function fakeConfirmPickupApi() {
//   return new Promise((resolve) => setTimeout(resolve, 1000));
// }
