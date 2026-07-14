import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { usePricingRulesStore } from "../../pricing/store/pricingRulesStore";
import { calculateQuotationPrice } from "../../pricing/services/pricingService";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";

export function useQuotationPricing(control) {
  const watchedValues = useWatch({ control });
  const rules = usePricingRulesStore((state) => state.rules);
  const categories = useCategoryStore((state) => state.categories);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);

  return useMemo(() => {
    const shippingMethod = shippingMethods.find(
      (method) => method.id === watchedValues.shippingMethodId,
    );
    const categoryDefinition = categories.find(
      (category) => category.code === watchedValues.productCategory,
    );
    const breakdown = calculateQuotationPrice(
      {
        ...watchedValues,
        shippingRate: shippingMethod?.ratePerLb ?? 0,
        categoryDefinition,
      },
      rules,
    );

    return {
      breakdown,
      shippingMethod,
      categoryDefinition,
    };
  }, [categories, rules, shippingMethods, watchedValues]);
}
