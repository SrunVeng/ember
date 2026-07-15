import { AlertCircle } from "lucide-react";
import { PricingRuleCard } from "./PricingRuleCard";
import { PricingNumberField } from "./PricingRuleForm";

function pathKey(path) {
  return path.join(".");
}

function getFieldError(errors, path) {
  return errors[pathKey(path)];
}

function RuleRow({ title, description, children }) {
  return (
    <div className="grid gap-4 border-b border-slate-100 py-5 first:pt-0 last:border-b-0 last:pb-0 lg:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)]">
      <div>
        <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
}

function ThresholdFields({ basePath, code, rule, updateRule, errors }) {
  return (
    <>
      <PricingNumberField
        id={`${code}-threshold`}
        label="Threshold price"
        value={rule.thresholdPrice}
        error={getFieldError(errors, [...basePath, code, "thresholdPrice"])}
        onChange={(value) => updateRule([...basePath, code, "thresholdPrice"], value)}
      />
      <PricingNumberField
        id={`${code}-below`}
        label="Below threshold profit"
        value={rule.belowThresholdProfit}
        error={getFieldError(errors, [...basePath, code, "belowThresholdProfit"])}
        onChange={(value) => updateRule([...basePath, code, "belowThresholdProfit"], value)}
      />
      <PricingNumberField
        id={`${code}-above`}
        label="At/above threshold profit"
        value={rule.equalOrAboveThresholdProfit}
        error={getFieldError(errors, [...basePath, code, "equalOrAboveThresholdProfit"])}
        onChange={(value) => updateRule([...basePath, code, "equalOrAboveThresholdProfit"], value)}
      />
    </>
  );
}

function CategoryRuleRow({ basePath, code, rule, updateRule, errors, description }) {
  const fixedProfitPath = [...basePath, code, "fixedProfit"];

  return (
    <RuleRow title={rule.label} description={description}>
      {rule.thresholdPrice !== undefined ? (
        <ThresholdFields
          basePath={basePath}
          code={code}
          rule={rule}
          updateRule={updateRule}
          errors={errors}
        />
      ) : (
        <PricingNumberField
          id={`${code}-profit`}
          label="Profit added"
          value={rule.fixedProfit}
          error={getFieldError(errors, fixedProfitPath)}
          helperText="Dollar amount added to the calculated product cost."
          onChange={(value) => updateRule(fixedProfitPath, value)}
        />
      )}
    </RuleRow>
  );
}

export function LuxeRulesPanel({ taxRate, categories, updateRule, errors }) {
  return (
    <PricingRuleCard
      title="LUXE Rules"
      description="Tax and profit rules for EMBER & CO. LUXE quotations."
    >
      <RuleRow title="California tax" description="Applied to LUXE website prices before profit.">
        <PricingNumberField
          id="luxe-tax"
          label="Tax rate"
          format="percent"
          step="0.1"
          value={taxRate}
          error={getFieldError(errors, ["luxe", "taxRate"])}
          onChange={(value) => updateRule(["luxe", "taxRate"], value)}
        />
      </RuleRow>
      {categories.map(([code, rule]) => (
        <CategoryRuleRow
          key={code}
          basePath={["luxe", "categories"]}
          code={code}
          rule={rule}
          updateRule={updateRule}
          errors={errors}
          description={
            rule.thresholdPrice !== undefined
              ? "Profit changes based on the website price."
              : "Fixed profit added for this category."
          }
        />
      ))}
    </PricingRuleCard>
  );
}

export function EssentialRulesPanel({ categories, updateRule, errors }) {
  return (
    <PricingRuleCard
      title="Essential Rules"
      description="Profit and fee rules for daily essentials, electronics, and supplements."
    >
      {categories.map(([code, rule]) => (
        <RuleRow
          key={code}
          title={rule.label}
          description={
            rule.thresholdPrice !== undefined
              ? "Profit changes based on the website price."
              : "Percentage-based profit for this category."
          }
        >
          {rule.percentageRate !== undefined ? (
            <PricingNumberField
              id={`${code}-rate`}
              label="Profit rate"
              format="percent"
              step="0.1"
              value={rule.percentageRate}
              error={getFieldError(errors, ["essential", "categories", code, "percentageRate"])}
              onChange={(value) =>
                updateRule(["essential", "categories", code, "percentageRate"], value)
              }
            />
          ) : null}
          {rule.shippingCompanyFeeRate !== undefined ? (
            <PricingNumberField
              id={`${code}-fee-rate`}
              label="Shipping company fee"
              format="percent"
              step="0.1"
              value={rule.shippingCompanyFeeRate}
              error={getFieldError(errors, [
                "essential",
                "categories",
                code,
                "shippingCompanyFeeRate",
              ])}
              onChange={(value) =>
                updateRule(["essential", "categories", code, "shippingCompanyFeeRate"], value)
              }
            />
          ) : null}
          {rule.thresholdPrice !== undefined ? (
            <ThresholdFields
              basePath={["essential", "categories"]}
              code={code}
              rule={rule}
              updateRule={updateRule}
              errors={errors}
            />
          ) : null}
        </RuleRow>
      ))}
    </PricingRuleCard>
  );
}

export function FeesAndShippingPanel({
  specialRequestFeeRate,
  localDeliveryFee,
  shippingMethods,
  updateRule,
  updateShippingRate,
  errors,
}) {
  return (
    <PricingRuleCard
      title="Fees and Shipping"
      description="Shared fees used by the calculator and quotation form."
    >
      <RuleRow title="Special request" description="Extra fee when staff enable a special request.">
        <PricingNumberField
          id="special-request-fee"
          label="Fee rate"
          format="percent"
          step="0.1"
          value={specialRequestFeeRate}
          error={getFieldError(errors, ["specialRequest", "feeRate"])}
          onChange={(value) => updateRule(["specialRequest", "feeRate"], value)}
        />
      </RuleRow>
      <RuleRow title="Local delivery" description="Flat delivery fee for local customer delivery.">
        <PricingNumberField
          id="local-delivery-fee"
          label="Delivery fee"
          value={localDeliveryFee}
          error={getFieldError(errors, ["localDelivery", "fee"])}
          onChange={(value) => updateRule(["localDelivery", "fee"], value)}
        />
      </RuleRow>
      <RuleRow title="Shipping rates" description="Dollar rate multiplied by product weight.">
        {shippingMethods.map((method) => (
          <PricingNumberField
            key={method.id}
            id={`shipping-${method.id}`}
            label={`${method.name} per lb`}
            value={method.ratePerLb}
            error={getFieldError(errors, ["shippingMethods", method.id, "ratePerLb"])}
            onChange={(value) => updateShippingRate(method.id, value)}
          />
        ))}
      </RuleRow>
    </PricingRuleCard>
  );
}

export function ValidationNotice({ count }) {
  if (!count) {
    return null;
  }

  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{count} pricing value{count === 1 ? "" : "s"} need attention before saving.</p>
    </div>
  );
}
