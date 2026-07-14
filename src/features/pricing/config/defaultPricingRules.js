import {
  BUSINESS_SECTIONS,
  PRODUCT_CATEGORY_CODES,
  PRICING_TYPES,
  SHIPPING_METHOD_CODES,
} from "../../quotations/constants/quotationConstants";

export const DEFAULT_PRICING_RULES = {
  luxe: {
    taxRate: 0.09,
    categories: {
      [PRODUCT_CATEGORY_CODES.SMALL_MAKEUP]: {
        label: "Small Makeup",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 5,
      },
      [PRODUCT_CATEGORY_CODES.LIP_PRODUCTS]: {
        label: "Lip Products",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 7,
      },
      [PRODUCT_CATEGORY_CODES.FOUNDATION]: {
        label: "Foundation",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 8,
      },
      [PRODUCT_CATEGORY_CODES.SMALL_EYESHADOW_PALETTE]: {
        label: "Small Eyeshadow Palette",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 7,
      },
      [PRODUCT_CATEGORY_CODES.LARGE_EYESHADOW_PALETTE]: {
        label: "Large Eyeshadow Palette",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 10,
      },
      [PRODUCT_CATEGORY_CODES.MINI_SKINCARE]: {
        label: "Mini Skincare",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 7,
      },
      [PRODUCT_CATEGORY_CODES.REGULAR_SKINCARE]: {
        label: "Regular Skincare",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 10,
      },
      [PRODUCT_CATEGORY_CODES.MINI_HAIRCARE]: {
        label: "Mini Haircare",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 8,
      },
      [PRODUCT_CATEGORY_CODES.REGULAR_HAIRCARE]: {
        label: "Regular Haircare",
        pricingType: PRICING_TYPES.FIXED,
        fixedProfit: 10,
      },
      [PRODUCT_CATEGORY_CODES.PERFUME]: {
        label: "Perfume",
        pricingType: PRICING_TYPES.PRICE_THRESHOLD,
        thresholdPrice: 50,
        belowThresholdProfit: 15,
        equalOrAboveThresholdProfit: 25,
      },
    },
  },
  essential: {
    categories: {
      [PRODUCT_CATEGORY_CODES.DAILY_ESSENTIALS]: {
        label: "Daily Essentials",
        pricingType: PRICING_TYPES.PERCENTAGE,
        percentageRate: 0.15,
      },
      [PRODUCT_CATEGORY_CODES.ELECTRONICS]: {
        label: "Electronics",
        pricingType: PRICING_TYPES.PERCENTAGE,
        shippingCompanyFeeRate: 0.1,
        percentageRate: 0.25,
      },
      [PRODUCT_CATEGORY_CODES.SUPPLEMENTS]: {
        label: "Vitamins and Supplements",
        pricingType: PRICING_TYPES.PRICE_THRESHOLD,
        thresholdPrice: 30,
        belowThresholdProfit: 8,
        equalOrAboveThresholdProfit: 10,
        requiresManagementConfirmation: true,
      },
    },
  },
  shipping: {
    [SHIPPING_METHOD_CODES.AIR_CARGO]: {
      label: "Air Cargo",
      ratePerLb: 10,
    },
    [SHIPPING_METHOD_CODES.EXPRESS]: {
      label: "Express Shipping",
      ratePerLb: 14,
    },
  },
  specialRequest: {
    feeRate: 0.15,
    requiresApproval: true,
  },
  localDelivery: {
    fee: 2,
  },
  labels: {
    [BUSINESS_SECTIONS.LUXE]: "EMBER & CO. LUXE",
    [BUSINESS_SECTIONS.ESSENTIAL]: "EMBER & CO. ESSENTIAL",
  },
};
