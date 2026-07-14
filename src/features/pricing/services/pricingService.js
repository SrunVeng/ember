import {
  BUSINESS_SECTIONS,
  PRODUCT_CATEGORY_CODES,
} from "../../quotations/constants/quotationConstants";
import { calculateRuleProfit } from "../utils/calculation";
import { addMoney, multiplyMoney, roundMoney } from "../utils/money";

function getCategoryRule({ businessSection, productCategory, rules, categoryDefinition }) {
  const configuredRule =
    businessSection === BUSINESS_SECTIONS.LUXE
      ? rules.luxe.categories[productCategory]
      : rules.essential.categories[productCategory];

  return configuredRule ?? (categoryDefinition?.active !== false ? categoryDefinition : undefined);
}

export function calculateTax({ businessSection, websitePrice, rules }) {
  if (businessSection !== BUSINESS_SECTIONS.LUXE) {
    return 0;
  }

  return multiplyMoney(websitePrice, rules.luxe.taxRate);
}

export function calculateProfit({ websitePrice, categoryRule }) {
  return calculateRuleProfit(websitePrice, categoryRule);
}

export function calculateShippingCompanyFee({ productCategory, websitePrice, categoryRule }) {
  if (productCategory !== PRODUCT_CATEGORY_CODES.ELECTRONICS) {
    return 0;
  }

  return multiplyMoney(websitePrice, categoryRule?.shippingCompanyFeeRate ?? 0);
}

export function calculateShipping({ estimatedWeight, shippingRate }) {
  return multiplyMoney(estimatedWeight, shippingRate);
}

export function calculateSpecialRequestFee({ websitePrice, specialRequest, rules }) {
  return specialRequest ? multiplyMoney(websitePrice, rules.specialRequest.feeRate) : 0;
}

export function calculateLocalDeliveryFee({ localDelivery, rules }) {
  return localDelivery ? roundMoney(rules.localDelivery.fee) : 0;
}

export function calculateQuotationPrice(input, rules) {
  const websitePrice = roundMoney(input.websitePrice);
  const categoryRule = getCategoryRule({
    businessSection: input.businessSection,
    productCategory: input.productCategory,
    rules,
    categoryDefinition: input.categoryDefinition,
  });
  const taxAmount = calculateTax({
    businessSection: input.businessSection,
    websitePrice,
    rules,
  });
  const profitAmount = calculateProfit({ websitePrice, categoryRule });
  const shippingCompanyFee = calculateShippingCompanyFee({
    productCategory: input.productCategory,
    websitePrice,
    categoryRule,
  });
  const shippingAmount = calculateShipping({
    estimatedWeight: input.estimatedWeight,
    shippingRate: input.shippingRate,
  });
  const specialRequestFee = calculateSpecialRequestFee({
    websitePrice,
    specialRequest: input.specialRequest,
    rules,
  });
  const localDeliveryFee = calculateLocalDeliveryFee({
    localDelivery: input.localDelivery,
    rules,
  });

  return {
    websitePrice,
    taxAmount,
    profitAmount,
    shippingCompanyFee,
    shippingAmount,
    specialRequestFee,
    localDeliveryFee,
    finalSellingPrice: addMoney(
      websitePrice,
      taxAmount,
      profitAmount,
      shippingCompanyFee,
      shippingAmount,
      specialRequestFee,
      localDeliveryFee,
    ),
  };
}
