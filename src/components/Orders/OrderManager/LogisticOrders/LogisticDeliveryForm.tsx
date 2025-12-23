import { useState } from "react";
import ActionsContainer from "../../../UI/Actions/ActionsContainer";
import { OrderDto, OrderStatuses } from "../../../../types";
import styles from "./LogisticDeliveryForm.module.css";

interface DeliveryConfirmPayload {
  id: string;
  status: string;
  paidAmount: number;
  deliveredItems: string[];
}

interface LogisticDeliveryFormProps {
  order: OrderDto;
  onRevertStatus?: (orderId: string, nextStatus: OrderStatuses) => void;
  onDeliveryConfirm?: () => void;
}

export default function LogisticDeliveryForm({
  order,
  onRevertStatus,
  onDeliveryConfirm,
}: LogisticDeliveryFormProps) {
  const targetTotalAmount = order.totalAmount ?? 0;

  const [receivedAmount, setReceivedAmount] = useState<string>(
    targetTotalAmount.toFixed(2)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setError(null);

    if (!receivedAmount.trim()) {
      setError("Received amount cannot be empty.");
      return;
    }

    const parsedAmount = Number(receivedAmount);

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Please enter a valid non-negative number.");
      return;
    }

    const isExact =
      Number(parsedAmount.toFixed(2)) === Number(targetTotalAmount.toFixed(2));

    if (!isExact) {
      const proceed = window.confirm(
        `Expected amount is ${targetTotalAmount.toFixed(
          2
        )}, but received ${parsedAmount.toFixed(
          2
        )}. Are you sure you want to confirm?`
      );

      if (!proceed) return;
    }

    onDeliveryConfirm?.();
  };

  const handleRevertStatus = async () => {
    try {
      setIsSubmitting(true);
      onRevertStatus?.(order.id, OrderStatuses.washingComplete);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Delivery Payment</h2>

      <div className={styles.totalSection}>
        <span className={styles.totalLabel}>Order Total:</span>
        <span className={styles.totalAmount}>
          {targetTotalAmount.toFixed(2)}
        </span>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="receivedAmount" className={styles.label}>
          Received Amount
        </label>
        <input
          id="receivedAmount"
          name="receivedAmount"
          type="number"
          min={0}
          step="0.01"
          value={receivedAmount}
          onChange={(e) => setReceivedAmount(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>

      <ActionsContainer className={styles.actions}>
        <button
          type="button"
          onClick={handleRevertStatus}
          className={styles.secondaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Status reverting..." : "Revert Status"}
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className={styles.primaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirming..." : "Confirm Delivery"}
        </button>
      </ActionsContainer>
    </div>
  );
}
