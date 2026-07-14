import { X } from "lucide-react";
import { useToastStore } from "../../stores/toastStore";
import { Button } from "./Button";
import { cn } from "../../utils/classNames";

const tone = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn("rounded-xl border p-4 shadow-soft", tone[toast.type] ?? tone.info)}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{toast.title}</p>
              {toast.message ? <p className="mt-1 text-sm">{toast.message}</p> : null}
            </div>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Dismiss notification"
              onClick={() => removeToast(toast.id)}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
