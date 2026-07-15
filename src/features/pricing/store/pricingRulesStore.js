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
  saveRules: async (rules) => {
    const saved = await savePricingRules(rules);
    set({ rules: saved, isHydrated: true });
  },
  resetRules: async () => {
    const rules = await resetPricingRules();
    set({ rules, isHydrated: true });
    return rules;
  },
}));
