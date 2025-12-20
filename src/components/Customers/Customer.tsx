import { useState, ReactNode } from "react";

import { validatePhoneNumber } from "../../utils";

import styles from "./Customer.module.css";

export interface CustomerModel {
  userId?: string | undefined;
  phoneNumber: string;
  userFullName: string;
  displayAddress: string;
}

export interface CustomerProps {
  userId?: string | undefined;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  onSave: (data: CustomerModel) => void;
  onCancel: () => void;
  renderHeader?: () => ReactNode;
}

interface TouchedState {
  name: boolean;
  phoneNumber: boolean;
  address: boolean;
}

export default function Customer({
  userId,
  customerName = "",
  customerPhone = "",
  customerAddress = "",
  onSave,
  onCancel,
  renderHeader,
}: CustomerProps) {
  const [name, setName] = useState<string>(customerName);
  const [phoneNumber, setPhoneNumber] = useState<string>(customerPhone);
  const [address, setAddress] = useState<string>(customerAddress);

  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    phoneNumber: false,
    address: false,
  });

  const errors = {
    name: !name,
    phoneNumber: !validatePhoneNumber(phoneNumber),
    address: !address,
  };

  const canNotSave = errors.name || errors.phoneNumber || errors.address;

  const handleSaveClick = () => {
    if (canNotSave) return;

    const payload: CustomerModel = {
      userId,
      userFullName: name,
      phoneNumber,
      displayAddress: address,
    };

    onSave(payload);
  };

  const handlePhoneNumberChange = (value: string) => {
    const currentValue = value?.trim() || "";
    setPhoneNumber(() => {
      setTouched((t) => ({ ...t, phoneNumber: true }));
      return currentValue;
    });
  };

  return (
    <div className={styles.container}>
      {renderHeader?.()}

      {/* Name */}
      <label className={styles.label}>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          className={`${styles.input} ${
            errors.name && touched.name ? styles.inputError : ""
          }`}
          required
        />
        {errors.name && touched.name && (
          <small className={styles.errorText}>Name is required</small>
        )}
      </label>

      {/* Phone */}
      <label className={styles.label}>
        Phone
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
          onBlur={(e) => handlePhoneNumberChange(e.target.value)}
          className={`${styles.input} ${
            errors.phoneNumber && touched.phoneNumber ? styles.inputError : ""
          }`}
        />
        {!phoneNumber && errors.phoneNumber && touched.phoneNumber && (
          <small className={styles.errorText}>Phone is required</small>
        )}
        {phoneNumber && errors.phoneNumber && touched.phoneNumber && (
          <small className={styles.errorText}>Phone must be valid</small>
        )}
      </label>

      {/* Address */}
      <label className={styles.label}>
        Address
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder="Допълнителна информация..."
          className={styles.textarea}
        />
        {errors.address && touched.address && (
          <small className={styles.errorText}>Address is required</small>
        )}
      </label>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.button} ${styles.cancelButton}`}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSaveClick}
          className={styles.button}
          disabled={canNotSave}
        >
          + Добави ред
        </button>
      </div>
    </div>
  );
}
