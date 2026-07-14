import { z } from "zod";
import {
  BUSINESS_SECTIONS,
  PRICING_TYPES,
} from "../../quotations/constants/quotationConstants";

export const categorySchema = z
  .object({
    code: z.string().trim().min(2, "Code is required."),
    name: z.string().trim().min(2, "Category name is required."),
    businessSection: z.enum(Object.values(BUSINESS_SECTIONS)),
    pricingType: z.enum(Object.values(PRICING_TYPES)),
    fixedProfit: z.coerce.number().min(0, "Fixed profit cannot be negative."),
    percentageRate: z.coerce.number().min(0, "Percentage rate cannot be negative."),
    thresholdPrice: z.coerce.number().min(0, "Threshold cannot be negative."),
    belowThresholdProfit: z.coerce.number().min(0, "Below-threshold profit cannot be negative."),
    equalOrAboveThresholdProfit: z.coerce
      .number()
      .min(0, "Above-threshold profit cannot be negative."),
    active: z.boolean().optional(),
  })
  .superRefine((value, context) => {
    if (value.pricingType === PRICING_TYPES.FIXED && value.fixedProfit <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fixedProfit"],
        message: "Fixed profit must be greater than zero.",
      });
    }

    if (value.pricingType === PRICING_TYPES.PERCENTAGE && value.percentageRate <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["percentageRate"],
        message: "Percentage rate must be greater than zero.",
      });
    }

    if (value.pricingType === PRICING_TYPES.PRICE_THRESHOLD) {
      [
        ["thresholdPrice", value.thresholdPrice, "Threshold price must be greater than zero."],
        [
          "belowThresholdProfit",
          value.belowThresholdProfit,
          "Below-threshold profit must be greater than zero.",
        ],
        [
          "equalOrAboveThresholdProfit",
          value.equalOrAboveThresholdProfit,
          "Above-threshold profit must be greater than zero.",
        ],
      ].forEach(([path, fieldValue, message]) => {
        if (fieldValue <= 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [path],
            message,
          });
        }
      });
    }
  });
