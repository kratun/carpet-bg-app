/* eslint-disable no-unused-vars */
import { createContext, useContext } from "react";
import { toast } from "sonner";

const ToastContext = createContext({
  toastSuccess: (message) => {},
  toastError: (message) => {},
  toastInfo: (message) => {},
  toastWarning: (message) => {},
  toastCustom: (message, options) => {},
});

/**
 * Wrap your app with this provider.
 */
export const ToastProvider = ({ children }) => {
  const toastSuccess = (message) => toast.success(message);
  const toastError = (message) => toast.error(message);
  const toastInfo = (message) => toast(message); // default/info toast
  const toastWarning = (message) =>
    toast(message, { style: { background: "#facc15", color: "#1e3a8a" } }); // yellow background
  const toastCustom = (message, options) => toast(message, options);

  return (
    <ToastContext.Provider
      value={{ toastSuccess, toastError, toastInfo, toastWarning, toastCustom }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
