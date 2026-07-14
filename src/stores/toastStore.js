import { create } from "zustand";

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = createToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, type: "info", ...toast }],
    }));

    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, toast.duration ?? 3500);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
