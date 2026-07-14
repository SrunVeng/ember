import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../../../services/persistenceService";
import {
  BUSINESS_SECTIONS,
  PRODUCT_CATEGORY_CODES,
  PRICING_TYPES,
} from "../../quotations/constants/quotationConstants";
import { DEFAULT_PRICING_RULES } from "../../pricing/config/defaultPricingRules";

function timestamp() {
  return new Date().toISOString();
}

function createDefaultCategories() {
  const luxeCategories = Object.entries(DEFAULT_PRICING_RULES.luxe.categories).map(
    ([code, rule]) => ({
      id: `cat-${code.toLowerCase()}`,
      code,
      name: rule.label,
      businessSection: BUSINESS_SECTIONS.LUXE,
      pricingType: rule.pricingType,
      fixedProfit: rule.fixedProfit ?? 0,
      percentageRate: rule.percentageRate ?? 0,
      thresholdPrice: rule.thresholdPrice ?? 0,
      belowThresholdProfit: rule.belowThresholdProfit ?? 0,
      equalOrAboveThresholdProfit: rule.equalOrAboveThresholdProfit ?? 0,
      active: true,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    }),
  );
  const essentialCategories = Object.entries(DEFAULT_PRICING_RULES.essential.categories).map(
    ([code, rule]) => ({
      id: `cat-${code.toLowerCase()}`,
      code,
      name: rule.label,
      businessSection: BUSINESS_SECTIONS.ESSENTIAL,
      pricingType: rule.pricingType,
      fixedProfit: rule.fixedProfit ?? 0,
      percentageRate: rule.percentageRate ?? 0,
      shippingCompanyFeeRate: rule.shippingCompanyFeeRate ?? 0,
      thresholdPrice: rule.thresholdPrice ?? 0,
      belowThresholdProfit: rule.belowThresholdProfit ?? 0,
      equalOrAboveThresholdProfit: rule.equalOrAboveThresholdProfit ?? 0,
      requiresManagementConfirmation: Boolean(rule.requiresManagementConfirmation),
      active: true,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    }),
  );

  return [...luxeCategories, ...essentialCategories];
}

export function getDefaultCategories() {
  return createDefaultCategories();
}

export function getCategories() {
  return getInitialCollection(COLLECTIONS.categories, getDefaultCategories());
}

export async function loadCategories() {
  return loadCollection(COLLECTIONS.categories, getDefaultCategories(), { persistFallback: true });
}

export function saveCategories(categories) {
  return saveCollection(COLLECTIONS.categories, categories);
}

export function getCategoryByCode(categories, code) {
  return categories.find((category) => category.code === code);
}

export function createCategoryRecord(values) {
  const code = values.code.trim().toUpperCase().replace(/\s+/g, "_");
  return {
    id: `cat-${Date.now()}`,
    code,
    name: values.name.trim(),
    businessSection: values.businessSection,
    pricingType: values.pricingType,
    fixedProfit: Number(values.fixedProfit ?? 0),
    percentageRate: Number(values.percentageRate ?? 0),
    thresholdPrice: Number(values.thresholdPrice ?? 0),
    belowThresholdProfit: Number(values.belowThresholdProfit ?? 0),
    equalOrAboveThresholdProfit: Number(values.equalOrAboveThresholdProfit ?? 0),
    active: values.active ?? true,
    createdAt: timestamp(),
    updatedAt: timestamp(),
  };
}

export const CATEGORY_FORM_DEFAULTS = {
  code: "",
  name: "",
  businessSection: BUSINESS_SECTIONS.LUXE,
  pricingType: PRICING_TYPES.FIXED,
  fixedProfit: 0,
  percentageRate: 0,
  thresholdPrice: 0,
  belowThresholdProfit: 0,
  equalOrAboveThresholdProfit: 0,
  active: true,
};

export const RESERVED_CATEGORY_CODES = Object.values(PRODUCT_CATEGORY_CODES);
