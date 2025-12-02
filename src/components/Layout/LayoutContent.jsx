export default function LayoutContent({ children }) {
  return (
    <div
      style={{
        maxWidth: "1920px",
        margin: "auto",
      }}
    >
      <main>{children}</main>
    </div>
  );
}
