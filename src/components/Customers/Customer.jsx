import { useState } from "react";
import SpeechTextarea from "../UI/SpeechTextarea/SpeechTextarea";
// import FormInput from "../UI/FormInput"; // Adjust the path if needed

export default function Customer({
  id,
  customerName,
  customerPhone,
  customerAddress,
  onSave,
  onCancel,
  renderHeader,
}) {
  const [name, setName] = useState(customerName ?? "");
  const [phone, setPhone] = useState(customerPhone ?? "");
  const [address, setAddress] = useState(customerAddress ?? "");
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
  });

  const errors = {
    phone: !phone,
    address: !address,
    name: !name,
  };

  const handleAddress = (value) => {
    setAddress(value);
  };

  const canNotSave = !phone || !address;

  const handleSaveClick = () => {
    const hasError = Object.values(errors).some(Boolean);
    const hasEmptyField = !phone || !address || !name;
    if (hasError || hasEmptyField) {
      return;
    }

    onSave({
      id,
      address,
      phone,
      name,
    });
  };

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
    padding: "0 16px 16px 16px",
    // marginTop: 24,
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

  return (
    <div style={fieldContainerStyle}>
      {renderHeader && renderHeader()}
      <label style={labelStyle}>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          style={inputStyle(errors.name && touched.name)}
          required
        />
        {errors.name && touched.name && (
          <small style={errorTextStyle}>Name is required</small>
        )}
      </label>
      <label style={labelStyle}>
        Phone
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          style={inputStyle(errors.phone && touched.phone)}
        />
        {errors.phone && touched.phone && (
          <small style={errorTextStyle}>Phone is required</small>
        )}
      </label>

      <label style={labelStyle}>
        Address
        <textarea
          value={address}
          onChange={(e) => handleAddress(e.target.value)}
          //onChange={(value) => setAddress((prev) => `${prev} ${value}`)}
          rows={3}
          placeholder="Допълнителна информация..."
          style={{
            ...inputStyle(),
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </label>
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
          onClick={() => handleSaveClick()}
          style={addButtonStyle}
          disabled={canNotSave}
        >
          + Добави ред
        </button>
      </div>
    </div>
  );
}
