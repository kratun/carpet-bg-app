import { useState } from "react";
import { ORDER_STATUSES } from "../../../../utils/statuses.utils.js";
import ManageOrderItemsActionsContainer from "../ManageOrderItems/ManageOrderItemsActionsContainer";

export default function LogisticDeliveryForm({
  order,
  onRevertStatus,
  onDeliveryConfirm,
}) {
  const { id, status, totalAmount } = order;
  const targetTotalAmount = totalAmount ?? 0;
  const [receivedAmount, setReceivedAmount] = useState(targetTotalAmount);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    if (!receivedAmount) {
      setError("Received amount cannot be empty.");
      return;
    }

    const parsedAmount = parseFloat(receivedAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Please enter a valid non-negative number for received amount.");
      return;
    }

    const isExact =
      parseFloat(receivedAmount) === parseFloat(targetTotalAmount.toFixed(2));

    if (!isExact) {
      const proceed = window.confirm(
        `Expected amount is $${targetTotalAmount}, but received $${receivedAmount}. Are you sure you want to confirm?`
      );
      if (!proceed) return;
    }
    onDeliveryConfirm?.({
      id,
      status,
      paidAmount: parsedAmount,
      deliveredItems: order.orderItems.map((i) => i.id),
    });
    // Proceed with confirmation (e.g., API call, dispatch action)
    alert(`Payment of $${receivedAmount} confirmed for order #${order.id}`);
  };

  const handleRevertStatus = async () => {
    try {
      setIsSubmitting(true);
      const nextStatus = ORDER_STATUSES.washingComplete;
      onRevertStatus?.(order.id, nextStatus);
    } catch (error) {
      console.error("Pickup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const logisticActionsContainer = {
    display: "flex",
    margin: "12px",
    gap: "16px",
    justifyContent: "space-between",
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Delivery Payment</h2>

      <div className="mb-2">
        <div className="text-sm text-gray-600">Order Total:</div>
        <div className="font-semibold text-lg">
          ${targetTotalAmount.toFixed(2)}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">
          Received Amount
        </label>
        <input
          type="number"
          className="border rounded p-2 w-full"
          value={receivedAmount}
          min={0}
          onChange={(e) => setReceivedAmount(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>

      <ManageOrderItemsActionsContainer style={logisticActionsContainer}>
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

        <button onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Confirming..." : "Confirm Delivery"}
        </button>
      </ManageOrderItemsActionsContainer>
    </div>
  );
}
