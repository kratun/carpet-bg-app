// import { useState } from "react";

import Icon, { ICONS } from "../../../UI/Icons/Icon";

import { ORDER_ITEM_STATUSES } from "../../../../utils/statuses.utils";

export default function ManageOrderItems({
  title,
  orderItems,
  products,
  isExpress,
  onEdit,
  onDelete,
  onChangeStatus,
}) {
  const handleEditItem = (e, item, index) => {
    e.preventDefault();
    onEdit(item, index);
  };

  const handleChangeStatus = (e, item) => {
    e.preventDefault();
    onChangeStatus(item);
  };

  function getPrice(id) {
    if (!Array.isArray(products)) return null;

    const product = products.find((p) => p.id === id);
    if (!product) return null;

    const price = isExpress ? product.expressServicePrice : product.price;
    return price ?? null;
  }

  function getCleaningTypeDisplayName(id) {
    if (!Array.isArray(products)) return "Зареждане...";

    const product = products.find((p) => p.id === id);
    if (!product) return "Непозната услуга";

    return product.name;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div>{title}</div>
        {(!orderItems || !orderItems.length) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 12px 16px 12px",
            }}
          >
            Няма налични услуги
          </div>
        )}
        {(!products || !products.length) && (
          <div style={{ padding: "12px" }}>Зареждане на продукти...</div>
        )}
        {products &&
          !!products.length &&
          orderItems.map((row, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 12px 16px 12px",
              }}
            >
              <div style={{ flex: 1, marginRight: 16 }}>
                <p style={{ margin: 0, fontWeight: "bold", color: "#1e3a8a" }}>
                  {index + 1}. {getCleaningTypeDisplayName(row.productId)}
                  {` - ${
                    getPrice(row.productId) !== null
                      ? `${getPrice(row.productId).toFixed(2)} лв./м2`
                      : "Цена неизвестна"
                  }`}
                </p>
                <p style={{ margin: "4px 0 0", color: "#333" }}>
                  {row.width &&
                    row.height &&
                    `${row.width.toFixed(2)} x ${row.height.toFixed(2)} м.`}
                  {row.diagonal &&
                    row.diagonal > 0 &&
                    `Диагонал: ${row.diagonal} м.`}

                  {row.note && ` — ${row.note}`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {onEdit && (
                  <button
                    type="button"
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: 6,
                      cursor: "pointer",
                    }}
                    onClick={(e) => handleEditItem(e, row, index)}
                  >
                    <Icon name={ICONS.edit} color="#2563eb" />
                  </button>
                )}
                {onChangeStatus && (
                  <button
                    type="button"
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: 6,
                      cursor: "pointer",
                    }}
                    onClick={(e) => handleChangeStatus(e, row)}
                  >
                    <Icon
                      size={20}
                      name={
                        row.status === ORDER_ITEM_STATUSES.washingComplete
                          ? ICONS.checkCircle
                          : ICONS.playCircle
                      }
                      color={
                        row.status === ORDER_ITEM_STATUSES.washingComplete
                          ? "#2563eb"
                          : "#f97316"
                      }
                      strokeWidth={2.5}
                    />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: 6,
                      cursor: "pointer",
                    }}
                    onClick={() => onDelete(index)}
                  >
                    <Icon name={ICONS.delete} color="red" />
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
