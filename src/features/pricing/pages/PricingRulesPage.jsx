import { useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useToastStore } from "../../../stores/toastStore";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import {
  EssentialCategoryRulesSection,
  LocalDeliveryFeeSection,
  LuxeCategoryProfitsSection,
  LuxeTaxSection,
  ShippingRatesSection,
  SpecialRequestFeeSection,
} from "../components/PricingRuleSections";
import { DEFAULT_PRICING_RULES } from "../config/defaultPricingRules";
import { usePricingRulesStore } from "../store/pricingRulesStore";

function cloneRules(rules) {
  return JSON.parse(JSON.stringify(rules));
}

function setNestedValue(source, path, value) {
  const next = cloneRules(source);
  let cursor = next;
  path.slice(0, -1).forEach((key) => {
    cursor = cursor[key];
  });
  cursor[path[path.length - 1]] = value;
  return next;
}

function hasInvalidNumbers(value) {
  if (typeof value === "number") {
    return !Number.isFinite(value) || value <= 0;
  }

  if (Array.isArray(value)) {
    return value.some(hasInvalidNumbers);
  }

  if (value && typeof value === "object") {
    return Object.values(value).some(hasInvalidNumbers);
  }

  return false;
}

export function PricingRulesPage() {
  const rules = usePricingRulesStore((state) => state.rules);
  const saveRules = usePricingRulesStore((state) => state.saveRules);
  const resetRules = usePricingRulesStore((state) => state.resetRules);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
  const replaceShippingMethods = useShippingMethodStore((state) => state.replaceShippingMethods);
  const addToast = useToastStore((state) => state.addToast);
  const resetDialog = useDisclosure();
  const [draftRules, setDraftRules] = useState(() => cloneRules(rules));
  const [draftShipping, setDraftShipping] = useState(() => shippingMethods);

  const luxeCategories = useMemo(() => Object.entries(draftRules.luxe.categories), [draftRules]);
  const essentialCategories = useMemo(() => Object.entries(draftRules.essential.categories), [draftRules]);

  function updateRule(path, value) {
    setDraftRules((current) => setNestedValue(current, path, value));
  }

  function updateShippingRate(methodId, ratePerLb) {
    setDraftShipping((current) =>
      current.map((method) =>
        method.id === methodId ? { ...method, ratePerLb, updatedAt: new Date().toISOString() } : method,
      ),
    );
  }

  async function handleSave() {
    if (hasInvalidNumbers(draftRules) || hasInvalidNumbers(draftShipping)) {
      addToast({
        type: "error",
        title: "Invalid pricing value",
        message: "Pricing values must be valid positive numbers.",
      });
      return;
    }

    try {
      await saveRules(draftRules);
      await replaceShippingMethods(draftShipping);
      addToast({ type: "success", title: "Pricing rules saved" });
    } catch (error) {
      addToast({ type: "error", title: "Pricing rules were not saved", message: error.message });
    }
  }

  async function handleReset() {
    const nextShipping = draftShipping.map((method) => ({
      ...method,
      ratePerLb: DEFAULT_PRICING_RULES.shipping[method.code]?.ratePerLb ?? method.ratePerLb,
      updatedAt: new Date().toISOString(),
    }));

    try {
      const nextRules = await resetRules();
      await replaceShippingMethods(nextShipping);
      setDraftRules(cloneRules(nextRules));
      setDraftShipping(nextShipping);
      resetDialog.close();
      addToast({ type: "success", title: "Pricing rules reset" });
    } catch (error) {
      addToast({ type: "error", title: "Pricing rules were not reset", message: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing Rules"
        description="Adjust the business rules used by quotation calculations. Changes apply to new live calculations after saving."
        actions={
          <>
            <Button variant="secondary" icon={RotateCcw} onClick={resetDialog.open}>
              Reset defaults
            </Button>
            <Button icon={Save} onClick={handleSave}>
              Save rules
            </Button>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <LuxeTaxSection taxRate={draftRules.luxe.taxRate} updateRule={updateRule} />
        <SpecialRequestFeeSection feeRate={draftRules.specialRequest.feeRate} updateRule={updateRule} />
        <LuxeCategoryProfitsSection categories={luxeCategories} updateRule={updateRule} />
        <EssentialCategoryRulesSection categories={essentialCategories} updateRule={updateRule} />
        <ShippingRatesSection shippingMethods={draftShipping} updateShippingRate={updateShippingRate} />
        <LocalDeliveryFeeSection fee={draftRules.localDelivery.fee} updateRule={updateRule} />
      </div>
      <ConfirmDialog
        isOpen={resetDialog.isOpen}
        title="Reset pricing rules?"
        description="This restores default tax, profit, fee, and local delivery values."
        confirmLabel="Reset"
        onCancel={resetDialog.close}
        onConfirm={handleReset}
      />
    </div>
  );
}
