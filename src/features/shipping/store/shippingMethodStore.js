import { create } from "zustand";
import {
  createShippingMethodRecord,
  getShippingMethods,
  loadShippingMethods,
  saveShippingMethods,
} from "../services/shippingMethodService";

export const useShippingMethodStore = create((set, get) => ({
  shippingMethods: getShippingMethods(),
  isHydrated: false,
  hydrateShippingMethods: async () => {
    const shippingMethods = await loadShippingMethods();
    set({ shippingMethods, isHydrated: true });
  },
  addShippingMethod: async (values) => {
    const next = [...get().shippingMethods, createShippingMethodRecord(values)];
    const saved = await saveShippingMethods(next);
    set({ shippingMethods: saved, isHydrated: true });
  },
  updateShippingMethod: async (id, values) => {
    const next = get().shippingMethods.map((method) =>
      method.id === id
        ? {
            ...method,
            ...values,
            code: values.code.trim().toUpperCase().replace(/\s+/g, "_"),
            name: values.name.trim(),
            ratePerLb: Number(values.ratePerLb),
            updatedAt: new Date().toISOString(),
          }
        : method,
    );
    const saved = await saveShippingMethods(next);
    set({ shippingMethods: saved, isHydrated: true });
  },
  setShippingMethodActive: async (id, active) => {
    const next = get().shippingMethods.map((method) =>
      method.id === id ? { ...method, active, updatedAt: new Date().toISOString() } : method,
    );
    const saved = await saveShippingMethods(next);
    set({ shippingMethods: saved, isHydrated: true });
  },
  replaceShippingMethods: async (shippingMethods) => {
    const saved = await saveShippingMethods(shippingMethods);
    set({ shippingMethods: saved, isHydrated: true });
  },
}));
