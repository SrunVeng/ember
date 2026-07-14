const PREFIX = "ember.pricing.v1";

export const STORAGE_KEYS = {
  quotations: `${PREFIX}.quotations`,
  pricingRules: `${PREFIX}.rules`,
  categories: `${PREFIX}.categories`,
  shippingMethods: `${PREFIX}.shippingMethods`,
  appPreferences: `${PREFIX}.preferences`,
  authSession: `${PREFIX}.authSession`,
};

export const FEATURE_STORAGE_KEYS = [
  STORAGE_KEYS.quotations,
  STORAGE_KEYS.pricingRules,
  STORAGE_KEYS.categories,
  STORAGE_KEYS.shippingMethods,
  STORAGE_KEYS.appPreferences,
];
