import { PricingRuleCard } from "./PricingRuleCard";
import { PricingNumberField } from "./PricingRuleForm";

export function LuxeTaxSection({ taxRate, updateRule }) {
  return (
    <PricingRuleCard title="LUXE Tax" description="California sales tax applied to LUXE products.">
      <PricingNumberField
        id="luxe-tax"
        label="Tax rate"
        helperText="Use decimal format, for example 0.09 for 9%."
        value={taxRate}
        onChange={(value) => updateRule(["luxe", "taxRate"], value)}
      />
    </PricingRuleCard>
  );
}

export function SpecialRequestFeeSection({ feeRate, updateRule }) {
  return (
    <PricingRuleCard title="Special Request Fee" description="Applied when a special request is enabled.">
      <PricingNumberField
        id="special-request-fee"
        label="Fee rate"
        helperText="Use decimal format, for example 0.15 for 15%."
        value={feeRate}
        onChange={(value) => updateRule(["specialRequest", "feeRate"], value)}
      />
    </PricingRuleCard>
  );
}

function ThresholdFields({ basePath, code, rule, updateRule }) {
  return (
    <div className="mt-3 grid gap-3">
      <PricingNumberField
        id={`${code}-threshold`}
        label="Threshold price"
        value={rule.thresholdPrice}
        onChange={(value) => updateRule([...basePath, code, "thresholdPrice"], value)}
      />
      <PricingNumberField
        id={`${code}-below`}
        label="Below threshold profit"
        value={rule.belowThresholdProfit}
        onChange={(value) => updateRule([...basePath, code, "belowThresholdProfit"], value)}
      />
      <PricingNumberField
        id={`${code}-above`}
        label="Equal or above profit"
        value={rule.equalOrAboveThresholdProfit}
        onChange={(value) => updateRule([...basePath, code, "equalOrAboveThresholdProfit"], value)}
      />
    </div>
  );
}

export function LuxeCategoryProfitsSection({ categories, updateRule }) {
  return (
    <PricingRuleCard title="LUXE Category Profits" description="Fixed and threshold profit rules.">
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map(([code, rule]) => (
          <div key={code} className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">{rule.label}</h3>
            {rule.thresholdPrice !== undefined ? (
              <ThresholdFields
                basePath={["luxe", "categories"]}
                code={code}
                rule={rule}
                updateRule={updateRule}
              />
            ) : (
              <PricingNumberField
                id={`${code}-profit`}
                label="Fixed profit"
                value={rule.fixedProfit}
                onChange={(value) => updateRule(["luxe", "categories", code, "fixedProfit"], value)}
              />
            )}
          </div>
        ))}
      </div>
    </PricingRuleCard>
  );
}

export function EssentialCategoryRulesSection({ categories, updateRule }) {
  return (
    <PricingRuleCard title="Essential Category Rules" description="Profit and fee rules for everyday products.">
      <div className="grid gap-4">
        {categories.map(([code, rule]) => (
          <div key={code} className="rounded-lg border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">{rule.label}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {rule.percentageRate !== undefined ? (
                <PricingNumberField
                  id={`${code}-rate`}
                  label="Profit rate"
                  value={rule.percentageRate}
                  helperText="Use decimal format."
                  onChange={(value) =>
                    updateRule(["essential", "categories", code, "percentageRate"], value)
                  }
                />
              ) : null}
              {rule.shippingCompanyFeeRate !== undefined ? (
                <PricingNumberField
                  id={`${code}-fee-rate`}
                  label="Shipping company fee rate"
                  value={rule.shippingCompanyFeeRate}
                  helperText="Use decimal format."
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
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </PricingRuleCard>
  );
}

export function ShippingRatesSection({ shippingMethods, updateShippingRate }) {
  return (
    <PricingRuleCard title="Shipping Methods" description="Rates used by quotation shipping calculations.">
      <div className="grid gap-4 md:grid-cols-2">
        {shippingMethods.map((method) => (
          <PricingNumberField
            key={method.id}
            id={`shipping-${method.id}`}
            label={`${method.name} rate per lb`}
            value={method.ratePerLb}
            onChange={(value) => updateShippingRate(method.id, value)}
          />
        ))}
      </div>
    </PricingRuleCard>
  );
}

export function LocalDeliveryFeeSection({ fee, updateRule }) {
  return (
    <PricingRuleCard title="Local Delivery Fee" description="Applied when local delivery is enabled.">
      <PricingNumberField
        id="local-delivery-fee"
        label="Local delivery fee"
        value={fee}
        onChange={(value) => updateRule(["localDelivery", "fee"], value)}
      />
    </PricingRuleCard>
  );
}
