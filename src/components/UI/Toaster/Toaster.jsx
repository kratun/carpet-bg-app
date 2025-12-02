import { Toaster as SonnerToaster, toast as soamnrToast } from "sonner";

export default function Toaster({ action }) {
  return (
    <SonnerToaster
      position="top-center"
      action={action}
      toastOptions={{
        style: {
          background: "#2D7DBF",
          color: "white",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
        duration: 3000,
      }}
    />
  );
}

export const toast = soamnrToast;
