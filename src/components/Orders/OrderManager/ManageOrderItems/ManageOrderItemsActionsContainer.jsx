export default function ManageOrderItemsActionsContainer({ children }) {
  const containerStyle = {
    display: "flex",
    margin: 12,
    gap: 16,
    justifyContent: "space-between",
  };

  return <div style={containerStyle}>{children}</div>;
}
