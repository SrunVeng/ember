import assert from "node:assert/strict";
import { BUSINESS_SECTIONS, PRODUCT_CATEGORY_CODES } from "../src/features/quotations/constants/quotationConstants.js";
import { DEFAULT_PRICING_RULES } from "../src/features/pricing/config/defaultPricingRules.js";
import {
  calculateQuotationPrice,
  calculateSpecialRequestFee,
  calculateLocalDeliveryFee,
} from "../src/features/pricing/services/pricingService.js";

function calculate(input) {
  return calculateQuotationPrice(input, DEFAULT_PRICING_RULES);
}

assert.deepEqual(
  calculate({
    businessSection: BUSINESS_SECTIONS.LUXE,
    productCategory: PRODUCT_CATEGORY_CODES.REGULAR_SKINCARE,
    websitePrice: 100,
    estimatedWeight: 2,
    shippingRate: 10,
    specialRequest: false,
    localDelivery: false,
  }),
  {
    websitePrice: 100,
    taxAmount: 9,
    profitAmount: 10,
    shippingCompanyFee: 0,
    shippingAmount: 20,
    specialRequestFee: 0,
    localDeliveryFee: 0,
    finalSellingPrice: 139,
  },
);

assert.equal(
  calculate({
    businessSection: BUSINESS_SECTIONS.ESSENTIAL,
    productCategory: PRODUCT_CATEGORY_CODES.DAILY_ESSENTIALS,
    websitePrice: 100,
    estimatedWeight: 2,
    shippingRate: 10,
  }).finalSellingPrice,
  135,
);

assert.equal(
  calculate({
    businessSection: BUSINESS_SECTIONS.ESSENTIAL,
    productCategory: PRODUCT_CATEGORY_CODES.ELECTRONICS,
    websitePrice: 100,
    estimatedWeight: 2,
    shippingRate: 10,
  }).finalSellingPrice,
  155,
);

assert.equal(
  calculate({
    businessSection: BUSINESS_SECTIONS.ESSENTIAL,
    productCategory: PRODUCT_CATEGORY_CODES.SUPPLEMENTS,
    websitePrice: 25,
    estimatedWeight: 1,
    shippingRate: 10,
  }).finalSellingPrice,
  43,
);

assert.equal(
  calculateSpecialRequestFee({
    websitePrice: 100,
    specialRequest: true,
    rules: DEFAULT_PRICING_RULES,
  }),
  15,
);

assert.equal(
  calculateLocalDeliveryFee({
    localDelivery: true,
    rules: DEFAULT_PRICING_RULES,
  }),
  2,
);

console.log("Pricing calculations verified.");
