import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

interface Toast {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
}

interface ToastContextValue {
  show: (message: string, kind?: Toast["kind"]) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const icon = { success: CheckCircle2, error: AlertTriangle, info: Info };
  const color = { success: "border-success text-success", error: "border-danger text-danger", info: "border-signal text-signal" };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm" role="region" aria-label="Notifications">
        {toasts.map((t) => {
          const Icon = icon[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={`flex items-start gap-2 rounded-md border bg-ink-800 px-4 py-3 shadow-lg ${color[t.kind]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm text-mist-100 flex-1">{t.message}</p>
              <button onClick={() => remove(t.id)} aria-label="Dismiss notification" className="text-mist-400 hover:text-mist-100">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
