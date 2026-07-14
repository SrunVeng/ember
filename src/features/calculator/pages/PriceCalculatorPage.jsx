import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Select } from "../../../components/ui/Select";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { usePricingRulesStore } from "../../pricing/store/pricingRulesStore";
import { calculateQuotationPrice } from "../../pricing/services/pricingService";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import { PriceSummaryCard } from "../../quotations/components/PriceSummaryCard";
import {
  BUSINESS_SECTION_LABELS,
  BUSINESS_SECTIONS,
  PRODUCT_CATEGORY_CODES,
  SUPPLEMENT_CONFIRMATION_WARNING,
} from "../../quotations/constants/quotationConstants";

const DEFAULT_INPUTS = {
  businessSection: BUSINESS_SECTIONS.LUXE,
  productCategory: "",
  websitePrice: "",
  estimatedWeight: "",
  shippingMethodId: "",
  specialRequest: false,
  localDelivery: false,
};

function toOptions(items) {
  return items.map((item) => ({ value: item.value, label: item.label }));
}

export function PriceCalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const categories = useCategoryStore((state) => state.categories);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
  const rules = usePricingRulesStore((state) => state.rules);

  const categoryOptions = useMemo(
    () =>
      categories
        .filter(
          (category) =>
            category.active && category.businessSection === inputs.businessSection,
        )
        .map((category) => ({ value: category.code, label: category.name })),
    [categories, inputs.businessSection],
  );
  const activeShippingOptions = useMemo(
    () =>
      shippingMethods
        .filter((method) => method.active)
        .map((method) => ({ value: method.id, label: method.name })),
    [shippingMethods],
  );

  useEffect(() => {
    if (!inputs.productCategory && categoryOptions[0]) {
      setInputs((current) => ({ ...current, productCategory: categoryOptions[0].value }));
      return;
    }

    const stillValid = categoryOptions.some((option) => option.value === inputs.productCategory);
    if (inputs.productCategory && !stillValid) {
      setInputs((current) => ({
        ...current,
        productCategory: categoryOptions[0]?.value ?? "",
      }));
    }
  }, [categoryOptions, inputs.productCategory]);

  useEffect(() => {
    if (!inputs.shippingMethodId && activeShippingOptions[0]) {
      setInputs((current) => ({ ...current, shippingMethodId: activeShippingOptions[0].value }));
    }
  }, [activeShippingOptions, inputs.shippingMethodId]);

  const shippingMethod = shippingMethods.find((method) => method.id === inputs.shippingMethodId);
  const selectedCategory = categories.find((category) => category.code === inputs.productCategory);

  const breakdown = useMemo(
    () =>
      calculateQuotationPrice(
        {
          ...inputs,
          shippingRate: shippingMethod?.ratePerLb ?? 0,
          categoryDefinition: selectedCategory,
        },
        rules,
      ),
    [inputs, rules, selectedCategory, shippingMethod],
  );

  function updateInput(name, value) {
    setInputs((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Price Calculator"
        description="Staff can quickly calculate a selling price before creating a full customer quotation."
        actions={
          <Button as={Link} to="/quotations/create" icon={ArrowRight}>
            Create quotation
          </Button>
        }
      />
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <div className="flex gap-3">
          <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p>This calculator uses the active owner-managed pricing rules, categories, and shipping rates.</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader title="Selling Price Inputs" description="Enter the product details needed for pricing." />
          <CardBody className="space-y-5">
            <div className="form-section-grid">
              <Select
                id="calculator-business-section"
                label="Business section"
                value={inputs.businessSection}
                options={toOptions(
                  Object.values(BUSINESS_SECTIONS).map((value) => ({
                    value,
                    label: BUSINESS_SECTION_LABELS[value],
                  })),
                )}
                onChange={(event) => updateInput("businessSection", event.target.value)}
              />
              <Select
                id="calculator-product-category"
                label="Product category"
                value={inputs.productCategory}
                options={categoryOptions}
                onChange={(event) => updateInput("productCategory", event.target.value)}
              />
              <Input
                id="calculator-website-price"
                label="Website price"
                type="number"
                step="0.01"
                min="0"
                value={inputs.websitePrice}
                onChange={(event) => updateInput("websitePrice", event.target.value)}
              />
              <Input
                id="calculator-weight"
                label="Estimated weight (lb)"
                type="number"
                step="0.01"
                min="0"
                value={inputs.estimatedWeight}
                onChange={(event) => updateInput("estimatedWeight", event.target.value)}
              />
              <Select
                id="calculator-shipping-method"
                label="Shipping method"
                value={inputs.shippingMethodId}
                options={activeShippingOptions}
                onChange={(event) => updateInput("shippingMethodId", event.target.value)}
              />
            </div>
            {selectedCategory?.code === PRODUCT_CATEGORY_CODES.SUPPLEMENTS ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                {SUPPLEMENT_CONFIRMATION_WARNING}
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <Checkbox
                id="calculator-special-request"
                label="Special request"
                helperText="Adds the configured special request fee."
                checked={inputs.specialRequest}
                onChange={(event) => updateInput("specialRequest", event.target.checked)}
              />
              <Checkbox
                id="calculator-local-delivery"
                label="Local delivery"
                helperText="Adds the configured local delivery fee."
                checked={inputs.localDelivery}
                onChange={(event) => updateInput("localDelivery", event.target.checked)}
              />
            </div>
            <Button variant="secondary" icon={Calculator} onClick={() => setInputs(DEFAULT_INPUTS)}>
              Reset calculator
            </Button>
          </CardBody>
        </Card>
        <PriceSummaryCard breakdown={breakdown} />
      </div>
    </div>
  );
}
