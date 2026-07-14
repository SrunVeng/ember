import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import {
  BUSINESS_SECTION_LABELS,
  BUSINESS_SECTIONS,
  PRICING_TYPES,
} from "../../quotations/constants/quotationConstants";
import { CATEGORY_FORM_DEFAULTS } from "../services/categoryService";
import { categorySchema } from "../schemas/categorySchema";

const pricingTypeOptions = [
  { value: PRICING_TYPES.FIXED, label: "Fixed profit" },
  { value: PRICING_TYPES.PERCENTAGE, label: "Percentage profit" },
  { value: PRICING_TYPES.PRICE_THRESHOLD, label: "Price threshold" },
];

export function CategoryForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...CATEGORY_FORM_DEFAULTS, ...initialValues },
    resolver: zodResolver(categorySchema),
  });
  const pricingType = watch("pricingType");

  useEffect(() => {
    reset({ ...CATEGORY_FORM_DEFAULTS, ...initialValues });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-section-grid">
        <Input id="category-code" label="Code" required error={errors.code?.message} {...register("code")} />
        <Input id="category-name" label="Name" required error={errors.name?.message} {...register("name")} />
        <Select
          id="category-section"
          label="Business section"
          required
          error={errors.businessSection?.message}
          options={Object.values(BUSINESS_SECTIONS).map((value) => ({
            value,
            label: BUSINESS_SECTION_LABELS[value],
          }))}
          {...register("businessSection")}
        />
        <Select
          id="category-pricing-type"
          label="Pricing type"
          required
          error={errors.pricingType?.message}
          options={pricingTypeOptions}
          {...register("pricingType")}
        />
      </div>
      {pricingType === PRICING_TYPES.FIXED ? (
        <Input
          id="fixed-profit"
          label="Fixed profit"
          type="number"
          step="0.01"
          required
          error={errors.fixedProfit?.message}
          {...register("fixedProfit")}
        />
      ) : null}
      {pricingType === PRICING_TYPES.PERCENTAGE ? (
        <Input
          id="percentage-rate"
          label="Percentage rate"
          helperText="Use decimal format, for example 0.15 for 15%."
          type="number"
          step="0.01"
          required
          error={errors.percentageRate?.message}
          {...register("percentageRate")}
        />
      ) : null}
      {pricingType === PRICING_TYPES.PRICE_THRESHOLD ? (
        <div className="form-section-grid">
          <Input
            id="threshold-price"
            label="Threshold price"
            type="number"
            step="0.01"
            required
            error={errors.thresholdPrice?.message}
            {...register("thresholdPrice")}
          />
          <Input
            id="below-threshold-profit"
            label="Below-threshold profit"
            type="number"
            step="0.01"
            required
            error={errors.belowThresholdProfit?.message}
            {...register("belowThresholdProfit")}
          />
          <Input
            id="equal-threshold-profit"
            label="Equal or above profit"
            type="number"
            step="0.01"
            required
            error={errors.equalOrAboveThresholdProfit?.message}
            {...register("equalOrAboveThresholdProfit")}
          />
        </div>
      ) : null}
      <Checkbox id="category-active" label="Active" {...register("active")} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save category
        </Button>
      </div>
    </form>
  );
}
