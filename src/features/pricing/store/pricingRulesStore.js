import { create } from "zustand";
import {
  getPricingRules,
  loadPricingRules,
  resetPricingRules,
  savePricingRules,
} from "../services/pricingRulesService";

export const usePricingRulesStore = create((set) => ({
  rules: getPricingRules(),
  isHydrated: false,
  hydratePricingRules: async () => {
    const rules = await loadPricingRules();
    set({ rules, isHydrated: true });
  },
  saveRules: (rules) => set({ rules: savePricingRules(rules) }),
  resetRules: () => set({ rules: resetPricingRules() }),
}));
