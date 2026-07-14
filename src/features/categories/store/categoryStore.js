import { create } from "zustand";
import {
  createCategoryRecord,
  getCategories,
  loadCategories,
  saveCategories,
} from "../services/categoryService";

export const useCategoryStore = create((set, get) => ({
  categories: getCategories(),
  isHydrated: false,
  hydrateCategories: async () => {
    const categories = await loadCategories();
    set({ categories, isHydrated: true });
  },
  addCategory: async (values) => {
    const next = [...get().categories, createCategoryRecord(values)];
    const saved = await saveCategories(next);
    set({ categories: saved });
  },
  updateCategory: async (id, values) => {
    const next = get().categories.map((category) =>
      category.id === id
        ? {
            ...category,
            ...values,
            code: values.code.trim().toUpperCase().replace(/\s+/g, "_"),
            name: values.name.trim(),
            fixedProfit: Number(values.fixedProfit ?? 0),
            percentageRate: Number(values.percentageRate ?? 0),
            thresholdPrice: Number(values.thresholdPrice ?? 0),
            belowThresholdProfit: Number(values.belowThresholdProfit ?? 0),
            equalOrAboveThresholdProfit: Number(values.equalOrAboveThresholdProfit ?? 0),
            updatedAt: new Date().toISOString(),
          }
        : category,
    );
    const saved = await saveCategories(next);
    set({ categories: saved });
  },
  setCategoryActive: async (id, active) => {
    const next = get().categories.map((category) =>
      category.id === id ? { ...category, active, updatedAt: new Date().toISOString() } : category,
    );
    const saved = await saveCategories(next);
    set({ categories: saved });
  },
}));
