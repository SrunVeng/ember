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
  addShippingMethod: (values) => {
    const next = [...get().shippingMethods, createShippingMethodRecord(values)];
    set({ shippingMethods: saveShippingMethods(next) });
  },
  updateShippingMethod: (id, values) => {
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
    set({ shippingMethods: saveShippingMethods(next) });
  },
  setShippingMethodActive: (id, active) => {
    const next = get().shippingMethods.map((method) =>
      method.id === id ? { ...method, active, updatedAt: new Date().toISOString() } : method,
    );
    set({ shippingMethods: saveShippingMethods(next) });
  },
  replaceShippingMethods: (shippingMethods) => {
    set({ shippingMethods: saveShippingMethods(shippingMethods) });
  },
}));
