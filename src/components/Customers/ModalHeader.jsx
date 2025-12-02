import React from "react";

export default function ModalHeader({ title, onClose, closeButtonStyle }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 600,
      }}
    >
      <p>{title}</p>
      <button
        onClick={onClose}
        style={closeButtonStyle}
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  );
}
