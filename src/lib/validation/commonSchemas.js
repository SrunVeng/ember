import { z } from "zod";

export const positiveMoneySchema = z.coerce
  .number({ invalid_type_error: "Enter a valid amount." })
  .positive("Amount must be greater than zero.");

export const nonNegativeMoneySchema = z.coerce
  .number({ invalid_type_error: "Enter a valid amount." })
  .min(0, "Amount cannot be negative.");

export const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((value) => {
    if (!value) {
      return true;
    }

    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Enter a valid URL.");
