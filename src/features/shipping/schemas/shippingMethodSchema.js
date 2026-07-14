import { z } from "zod";

export const shippingMethodSchema = z.object({
  code: z.string().trim().min(2, "Code is required."),
  name: z.string().trim().min(2, "Name is required."),
  ratePerLb: z.coerce.number().positive("Rate must be greater than zero."),
  active: z.boolean().optional(),
});
