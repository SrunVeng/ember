import { Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { CustomerInformationSection } from "./CustomerInformationSection";
import { ProductInformationSection } from "./ProductInformationSection";
import { ShippingSection } from "./ShippingSection";
import { AdditionalChargesSection } from "./AdditionalChargesSection";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { useQuotationForm } from "../hooks/useQuotationForm";
import { useQuotationPricing } from "../hooks/useQuotationPricing";
import { mapFormToQuotation } from "../utils/quotationMapper";

export function QuotationForm({
  defaultValues,
  existingQuotation,
  quotationNumber,
  categories,
  shippingMethods,
  submitLabel,
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useQuotationForm(defaultValues);
  const { breakdown, shippingMethod, categoryDefinition } = useQuotationPricing(control);

  async function handleValidSubmit(values) {
    const quotation = mapFormToQuotation({
      values,
      breakdown,
      shippingMethod,
      existingQuotation,
      quotationNumber,
    });
    await onSubmit(quotation);
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-6">
        <CustomerInformationSection register={register} errors={errors} />
        <ProductInformationSection
          register={register}
          errors={errors}
          watch={watch}
          setValue={setValue}
          categories={categories}
          selectedCategory={categoryDefinition}
        />
        <ShippingSection register={register} errors={errors} shippingMethods={shippingMethods} />
        <AdditionalChargesSection register={register} errors={errors} watch={watch} />
        <div className="flex justify-end">
          <Button type="submit" icon={Save} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
      <PriceSummaryCard breakdown={breakdown} />
    </form>
  );
}
