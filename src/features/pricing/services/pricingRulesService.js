import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  removeCollection,
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

export function resetPricingRules() {
  removeCollection(COLLECTIONS.pricingRules);
  return DEFAULT_PRICING_RULES;
}
