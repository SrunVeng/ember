import { PRICING_TYPES } from "../../quotations/constants/quotationConstants";
import { multiplyMoney, roundMoney } from "./money";

export function calculateRuleProfit(websitePrice, rule) {
  if (!rule) {
    return 0;
  }

  if (rule.pricingType === PRICING_TYPES.PERCENTAGE || rule.profitType === PRICING_TYPES.PERCENTAGE) {
    return multiplyMoney(websitePrice, rule.percentageRate ?? rule.profitRate ?? rule.profitValue);
  }

  if (
    rule.pricingType === PRICING_TYPES.PRICE_THRESHOLD ||
    rule.profitType === PRICING_TYPES.PRICE_THRESHOLD
  ) {
    return roundMoney(
      websitePrice < Number(rule.thresholdPrice ?? rule.threshold ?? 0)
        ? rule.belowThresholdProfit
        : rule.equalOrAboveThresholdProfit,
    );
  }

  return roundMoney(rule.fixedProfit ?? rule.profitValue ?? 0);
}
