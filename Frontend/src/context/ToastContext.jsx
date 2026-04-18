import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <span className="flex-shrink-0">{icons[t.type]}</span>
            <span className="flex-1 text-sm">{t.message}</span>
            <button onClick={() => remove(t.id)} className="flex-shrink-0 hover:opacity-70">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
