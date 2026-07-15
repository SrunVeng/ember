import { useEffect, useMemo, useState } from "react";
import { CircleDollarSign, RotateCcw, Save, Truck, Undo2 } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { cn } from "../../../utils/classNames";
import { formatCurrency, formatPercent } from "../../../utils/currency";
import { useToastStore } from "../../../stores/toastStore";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import {
  EssentialRulesPanel,
  FeesAndShippingPanel,
  LuxeRulesPanel,
  ValidationNotice,
} from "../components/PricingRuleSections";
import { DEFAULT_PRICING_RULES } from "../config/defaultPricingRules";
import { usePricingRulesStore } from "../store/pricingRulesStore";

const TABS = [
  { id: "luxe", label: "LUXE", icon: CircleDollarSign },
  { id: "essential", label: "Essentials", icon: CircleDollarSign },
  { id: "fees", label: "Fees & Shipping", icon: Truck },
];

const NUMERIC_FIELD_LABELS = {
  taxRate: "Tax rate",
  fixedProfit: "Profit",
  thresholdPrice: "Threshold price",
  belowThresholdProfit: "Below threshold profit",
  equalOrAboveThresholdProfit: "At/above threshold profit",
  percentageRate: "Profit rate",
  shippingCompanyFeeRate: "Shipping company fee",
  feeRate: "Fee rate",
  fee: "Delivery fee",
};

function cloneRules(rules) {
  return JSON.parse(JSON.stringify(rules));
}

function pathKey(path) {
  return path.join(".");
}

function stableStringify(value) {
  return JSON.stringify(value);
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

function isNumericField(key) {
  return Object.prototype.hasOwnProperty.call(NUMERIC_FIELD_LABELS, key);
}

function validateNumber(value, label, options = {}) {
  const number = Number(value);

  if (value === "" || !Number.isFinite(number)) {
    return `${label} is required.`;
  }

  if (number < 0) {
    return `${label} cannot be negative.`;
  }

  if (options.mustBePositive && number <= 0) {
    return `${label} must be greater than 0.`;
  }

  return "";
}

function collectRuleErrors(source, path = [], errors = {}) {
  if (Array.isArray(source)) {
    source.forEach((item, index) => collectRuleErrors(item, [...path, index], errors));
    return errors;
  }

  if (!source || typeof source !== "object") {
    return errors;
  }

  Object.entries(source).forEach(([key, value]) => {
    const nextPath = [...path, key];

    if (isNumericField(key)) {
      const message = validateNumber(value, NUMERIC_FIELD_LABELS[key]);
      if (message) {
        errors[pathKey(nextPath)] = message;
      }
      return;
    }

    collectRuleErrors(value, nextPath, errors);
  });

  return errors;
}

function collectPricingErrors(rules, shippingMethods) {
  const errors = collectRuleErrors(rules);

  shippingMethods.forEach((method) => {
    const message = validateNumber(method.ratePerLb, `${method.name} rate`, { mustBePositive: true });
    if (message) {
      errors[pathKey(["shippingMethods", method.id, "ratePerLb"])] = message;
    }
  });

  return errors;
}

function normalizeNumericValues(source) {
  if (Array.isArray(source)) {
    return source.map(normalizeNumericValues);
  }

  if (!source || typeof source !== "object") {
    return source;
  }

  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      isNumericField(key) ? Number(value) : normalizeNumericValues(value),
    ]),
  );
}

function normalizeShippingMethods(shippingMethods) {
  const updatedAt = new Date().toISOString();

  return shippingMethods.map((method) => ({
    ...method,
    ratePerLb: Number(method.ratePerLb),
    updatedAt,
  }));
}

function getDisplayPercent(value) {
  return value === "" ? "Needs value" : formatPercent(value);
}

function getDisplayMoney(value) {
  return value === "" ? "Needs value" : formatCurrency(value);
}

function getTabForError(errorKey) {
  if (errorKey.startsWith("luxe.")) {
    return "luxe";
  }

  if (errorKey.startsWith("essential.")) {
    return "essential";
  }

  return "fees";
}

export function PricingRulesPage() {
  const rules = usePricingRulesStore((state) => state.rules);
  const rulesHydrated = usePricingRulesStore((state) => state.isHydrated);
  const saveRules = usePricingRulesStore((state) => state.saveRules);
  const resetRules = usePricingRulesStore((state) => state.resetRules);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
  const shippingHydrated = useShippingMethodStore((state) => state.isHydrated);
  const replaceShippingMethods = useShippingMethodStore((state) => state.replaceShippingMethods);
  const addToast = useToastStore((state) => state.addToast);
  const resetDialog = useDisclosure();
  const [draftRules, setDraftRules] = useState(() => cloneRules(rules));
  const [draftShipping, setDraftShipping] = useState(() => shippingMethods);
  const [activeTab, setActiveTab] = useState("luxe");
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!hasUserEdited) {
      setDraftRules(cloneRules(rules));
    }
  }, [hasUserEdited, rules]);

  useEffect(() => {
    if (!hasUserEdited) {
      setDraftShipping(shippingMethods);
    }
  }, [hasUserEdited, shippingMethods]);

  const luxeCategories = useMemo(() => Object.entries(draftRules.luxe.categories), [draftRules]);
  const essentialCategories = useMemo(() => Object.entries(draftRules.essential.categories), [draftRules]);
  const validationErrors = useMemo(
    () => collectPricingErrors(draftRules, draftShipping),
    [draftRules, draftShipping],
  );
  const displayedErrors = showValidation ? validationErrors : {};
  const validationCount = Object.keys(displayedErrors).length;
  const hasUnsavedChanges = useMemo(
    () =>
      hasUserEdited &&
      (stableStringify(draftRules) !== stableStringify(rules) ||
        stableStringify(draftShipping) !== stableStringify(shippingMethods)),
    [draftRules, draftShipping, hasUserEdited, rules, shippingMethods],
  );
  const isHydrated = rulesHydrated && shippingHydrated;

  const summaryItems = [
    { label: "LUXE tax", value: getDisplayPercent(draftRules.luxe.taxRate) },
    { label: "Special request", value: getDisplayPercent(draftRules.specialRequest.feeRate) },
    { label: "Local delivery", value: getDisplayMoney(draftRules.localDelivery.fee) },
    { label: "Shipping methods", value: String(draftShipping.length) },
  ];

  function markEdited() {
    setHasUserEdited(true);
    setShowValidation(false);
  }

  function updateRule(path, value) {
    markEdited();
    setDraftRules((current) => setNestedValue(current, path, value));
  }

  function updateShippingRate(methodId, ratePerLb) {
    markEdited();
    setDraftShipping((current) =>
      current.map((method) =>
        method.id === methodId ? { ...method, ratePerLb } : method,
      ),
    );
  }

  function handleDiscard() {
    setDraftRules(cloneRules(rules));
    setDraftShipping(shippingMethods);
    setHasUserEdited(false);
    setShowValidation(false);
  }

  async function handleSave() {
    if (!hasUnsavedChanges) {
      return;
    }

    if (Object.keys(validationErrors).length) {
      setActiveTab(getTabForError(Object.keys(validationErrors)[0]));
      setShowValidation(true);
      addToast({
        type: "error",
        title: "Check pricing values",
        message: "Some pricing fields need a valid number before saving.",
      });
      return;
    }

    const normalizedRules = normalizeNumericValues(draftRules);
    const normalizedShipping = normalizeShippingMethods(draftShipping);

    setIsSaving(true);

    try {
      await saveRules(normalizedRules);
      await replaceShippingMethods(normalizedShipping);
      setDraftRules(cloneRules(normalizedRules));
      setDraftShipping(normalizedShipping);
      setHasUserEdited(false);
      setShowValidation(false);
      addToast({ type: "success", title: "Pricing rules saved" });
    } catch (error) {
      addToast({ type: "error", title: "Pricing rules were not saved", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReset() {
    const nextShipping = draftShipping.map((method) => ({
      ...method,
      ratePerLb: DEFAULT_PRICING_RULES.shipping[method.code]?.ratePerLb ?? method.ratePerLb,
      updatedAt: new Date().toISOString(),
    }));

    setIsSaving(true);

    try {
      const nextRules = await resetRules();
      await replaceShippingMethods(nextShipping);
      setDraftRules(cloneRules(nextRules));
      setDraftShipping(nextShipping);
      setHasUserEdited(false);
      setShowValidation(false);
      resetDialog.close();
      addToast({ type: "success", title: "Pricing rules reset" });
    } catch (error) {
      addToast({ type: "error", title: "Pricing rules were not reset", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing Rules"
        description="Owner configuration for calculator and quotation pricing."
        actions={
          <>
            <Button variant="secondary" icon={RotateCcw} onClick={resetDialog.open} disabled={!isHydrated || isSaving}>
              Reset defaults
            </Button>
            <Button variant="secondary" icon={Undo2} onClick={handleDiscard} disabled={!hasUnsavedChanges || isSaving}>
              Discard
            </Button>
            <Button icon={Save} onClick={handleSave} disabled={!hasUnsavedChanges || isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </>
        }
      />

      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {summaryItems.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="block text-xs font-medium text-slate-500">{item.label}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-slate-950">{item.value}</span>
                </div>
              ))}
            </div>
            <Badge variant={hasUnsavedChanges ? "warning" : "success"}>
              {hasUnsavedChanges ? "Unsaved changes" : "Saved"}
            </Badge>
          </div>
          <ValidationNotice count={validationCount} />
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pricing rule sections">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {!isHydrated ? (
        <Card>
          <CardBody>
            <LoadingSpinner label="Loading pricing rules" />
          </CardBody>
        </Card>
      ) : null}

      {isHydrated && activeTab === "luxe" ? (
        <LuxeRulesPanel
          taxRate={draftRules.luxe.taxRate}
          categories={luxeCategories}
          updateRule={updateRule}
          errors={displayedErrors}
        />
      ) : null}

      {isHydrated && activeTab === "essential" ? (
        <EssentialRulesPanel
          categories={essentialCategories}
          updateRule={updateRule}
          errors={displayedErrors}
        />
      ) : null}

      {isHydrated && activeTab === "fees" ? (
        <FeesAndShippingPanel
          specialRequestFeeRate={draftRules.specialRequest.feeRate}
          localDeliveryFee={draftRules.localDelivery.fee}
          shippingMethods={draftShipping}
          updateRule={updateRule}
          updateShippingRate={updateShippingRate}
          errors={displayedErrors}
        />
      ) : null}

      <ConfirmDialog
        isOpen={resetDialog.isOpen}
        title="Reset pricing rules?"
        description="This restores default tax, profit, fee, local delivery, and shipping values."
        confirmLabel="Reset defaults"
        onCancel={resetDialog.close}
        onConfirm={handleReset}
      />
    </div>
  );
}
