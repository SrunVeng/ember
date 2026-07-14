import { z } from "zod";
import { optionalUrlSchema } from "../../../lib/validation/commonSchemas";
import {
  BUSINESS_SECTIONS,
  PRODUCT_CATEGORY_CODES,
  QUOTATION_STATUSES,
} from "../constants/quotationConstants";

export const quotationSchema = z
  .object({
    customerName: z.string().trim().min(1, "Customer name is required."),
    customerPhone: z.string().trim().optional(),
    customerAddress: z.string().trim().optional(),
    businessSection: z.enum(Object.values(BUSINESS_SECTIONS), {
      message: "Business section is required.",
    }),
    productName: z.string().trim().min(1, "Product name is required."),
    productUrl: optionalUrlSchema,
    productCategory: z.enum(Object.values(PRODUCT_CATEGORY_CODES), {
      message: "Product category is required.",
    }),
    websitePrice: z.coerce.number().positive("Website price must be greater than zero."),
    estimatedWeight: z.coerce.number().positive("Estimated weight must be greater than zero."),
    shippingMethodId: z.string().trim().min(1, "Shipping method is required."),
    specialRequest: z.boolean().default(false),
    specialRequestReason: z.string().trim().optional(),
    localDelivery: z.boolean().default(false),
    status: z.enum(Object.values(QUOTATION_STATUSES)).optional(),
  })
  .superRefine((value, context) => {
    if (value.specialRequest && !value.specialRequestReason?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialRequestReason"],
        message: "Special request reason is required.",
      });
    }
  });
