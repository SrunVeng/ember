import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../../../services/persistenceService";
import { DEFAULT_PRICING_RULES } from "../config/defaultPricingRules";

export function getPricingRules() {
  return getInitialCollection(COLLECTIONS.pricingRules, DEFAULT_PRICING_RULES);
}

export async function loadPricingRules() {
  return loadCollection(COLLECTIONS.pricingRules, DEFAULT_PRICING_RULES, {
    persistFallback: true,
  });
}

export function savePricingRules(rules) {
  return saveCollection(COLLECTIONS.pricingRules, rules);
}

export async function resetPricingRules() {
  await saveCollection(COLLECTIONS.pricingRules, DEFAULT_PRICING_RULES);
  return DEFAULT_PRICING_RULES;
}
