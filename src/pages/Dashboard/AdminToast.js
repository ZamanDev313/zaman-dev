import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const AdminToastContext = createContext(null);

export function AdminToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({
      id: Date.now() + Math.random(),
      message,
      type,
    });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const value = { showToast, dismissToast };

  return (
    <AdminToastContext.Provider value={value}>
      {children}

      <div
        className="admin-toast-viewport"
        aria-live="polite"
        aria-atomic="true"
      >
        {toast && (
          <div
            key={toast.id}
            className={`admin-toast admin-toast-${toast.type}`}
            role={toast.type === "error" ? "alert" : "status"}
          >
            <span className="admin-toast-icon" aria-hidden="true">
              {toast.type === "error" ? (
                <FiAlertCircle />
              ) : toast.type === "info" ? (
                <FiInfo />
              ) : (
                <FiCheckCircle />
              )}
            </span>

            <p className="admin-toast-message">{toast.message}</p>

            <button
              type="button"
              className="admin-toast-close"
              onClick={dismissToast}
              aria-label="Dismiss notification"
            >
              <FiX />
            </button>
          </div>
        )}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error(
      "useAdminToast must be used inside AdminToastProvider."
    );
  }

  return context;
}