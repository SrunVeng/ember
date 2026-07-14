import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../../../services/persistenceService";
import { SHIPPING_METHOD_CODES } from "../../quotations/constants/quotationConstants";
import { DEFAULT_PRICING_RULES } from "../../pricing/config/defaultPricingRules";

function timestamp() {
  return new Date().toISOString();
}

export function getDefaultShippingMethods() {
  return Object.entries(DEFAULT_PRICING_RULES.shipping).map(([code, method]) => ({
    id: `ship-${code.toLowerCase()}`,
    code,
    name: method.label,
    ratePerLb: method.ratePerLb,
    active: true,
    createdAt: timestamp(),
    updatedAt: timestamp(),
  }));
}

export function getShippingMethods() {
  return getInitialCollection(COLLECTIONS.shippingMethods, getDefaultShippingMethods());
}

export async function loadShippingMethods() {
  return loadCollection(COLLECTIONS.shippingMethods, getDefaultShippingMethods(), {
    persistFallback: true,
  });
}

export function saveShippingMethods(methods) {
  return saveCollection(COLLECTIONS.shippingMethods, methods);
}

export function createShippingMethodRecord(values) {
  const code = values.code.trim().toUpperCase().replace(/\s+/g, "_");
  return {
    id: `ship-${Date.now()}`,
    code,
    name: values.name.trim(),
    ratePerLb: Number(values.ratePerLb),
    active: values.active ?? true,
    createdAt: timestamp(),
    updatedAt: timestamp(),
  };
}

export const SHIPPING_FORM_DEFAULTS = {
  code: "",
  name: "",
  ratePerLb: 0,
  active: true,
};

export const RESERVED_SHIPPING_CODES = Object.values(SHIPPING_METHOD_CODES);
