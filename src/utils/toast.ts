import { toast } from "sonner";

const TOAST_STYLES = {
  success: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    border: "none",
    color: "white",
  },
  error: {
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    border: "none",
    color: "white",
  },
  info: {
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    border: "none",
    color: "white",
  },
};

export const showToast = {
  success: (message: string) => 
    toast.success(message, { style: TOAST_STYLES.success }),
  
  error: (message: string) => 
    toast.error(message, { style: TOAST_STYLES.error }),
  
  info: (message: string) => 
    toast.info(message, { style: TOAST_STYLES.info }),
};

// toast common actions
export const actionToasts = {
  passwordMoved: () => showToast.error("Password moved to trash successfully"),
  passwordRestored: () => showToast.success("Password restored successfully"),
  passwordDeleted: () => showToast.error("Password permanently deleted"),
  categoryCreated: () => showToast.info("Category created successfully"),
  categoryDeleted: () => showToast.error("Category permanently deleted"),

  // common errors for passwords
  movePasswordFailed: () => showToast.error("Failed to move password to trash"),
  restorePasswordFailed: () => showToast.error("Failed to restore password"),
  deletePasswordFailed: () => showToast.error("Failed to delete password permanently"),
  
  // info disponible function
  info: (message: string) => showToast.info(message),
};
