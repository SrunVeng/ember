import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import {
  BUSINESS_SECTIONS,
  BUSINESS_SECTION_LABELS,
  PRODUCT_CATEGORY_CODES,
  SUPPLEMENT_CONFIRMATION_WARNING,
} from "../constants/quotationConstants";

export function ProductInformationSection({
  register,
  errors,
  watch,
  setValue,
  categories,
  selectedCategory,
}) {
  const businessSection = watch("businessSection");
  const productCategory = watch("productCategory");
  const categoryOptions = categories
    .filter((category) => category.active && category.businessSection === businessSection)
    .map((category) => ({ value: category.code, label: category.name }));

  useEffect(() => {
    if (!productCategory) {
      return;
    }

    const categoryStillValid = categoryOptions.some((option) => option.value === productCategory);
    if (!categoryStillValid) {
      setValue("productCategory", "", { shouldValidate: true });
    }
  }, [categoryOptions, productCategory, setValue]);

  return (
    <Card>
      <CardHeader title="Product Information" />
      <CardBody className="space-y-4">
        <div className="form-section-grid">
          <Select
            id="businessSection"
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
            id="productCategory"
            label="Product category"
            required
            error={errors.productCategory?.message}
            options={categoryOptions}
            disabled={!businessSection}
            {...register("productCategory")}
          />
        </div>
        {selectedCategory?.code === PRODUCT_CATEGORY_CODES.SUPPLEMENTS ? (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{SUPPLEMENT_CONFIRMATION_WARNING}</p>
          </div>
        ) : null}
        <div className="form-section-grid">
          <Input
            id="productName"
            label="Product name"
            required
            error={errors.productName?.message}
            {...register("productName")}
          />
          <Input
            id="productUrl"
            label="Product URL"
            error={errors.productUrl?.message}
            {...register("productUrl")}
          />
          <Input
            id="websitePrice"
            label="Website price"
            required
            type="number"
            step="0.01"
            error={errors.websitePrice?.message}
            {...register("websitePrice")}
          />
          <Input
            id="estimatedWeight"
            label="Estimated weight (lb)"
            required
            type="number"
            step="0.01"
            error={errors.estimatedWeight?.message}
            {...register("estimatedWeight")}
          />
        </div>
      </CardBody>
    </Card>
  );
}
