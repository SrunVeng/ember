import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { quotationSchema } from "../schemas/quotationSchema";
import { QUOTATION_FORM_DEFAULTS } from "../utils/quotationMapper";

export function useQuotationForm(defaultValues) {
  return useForm({
    defaultValues: { ...QUOTATION_FORM_DEFAULTS, ...defaultValues },
    resolver: zodResolver(quotationSchema),
    mode: "onBlur",
  });
}
