import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { formatCurrency } from "../../../utils/currency";

function SummaryRow({ label, value, hidden }) {
  if (hidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{formatCurrency(value)}</span>
    </div>
  );
}

export function PriceSummaryCard({ breakdown }) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader title="Live Price Summary" description="Updates automatically as the quotation changes." />
      <CardBody className="space-y-3">
        <SummaryRow label="Website price" value={breakdown.websitePrice} />
        <SummaryRow label="California tax" value={breakdown.taxAmount} hidden={!breakdown.taxAmount} />
        <SummaryRow label="Category profit" value={breakdown.profitAmount} hidden={!breakdown.profitAmount} />
        <SummaryRow
          label="Shipping company fee"
          value={breakdown.shippingCompanyFee}
          hidden={!breakdown.shippingCompanyFee}
        />
        <SummaryRow label="Shipping cost" value={breakdown.shippingAmount} hidden={!breakdown.shippingAmount} />
        <SummaryRow
          label="Special request fee"
          value={breakdown.specialRequestFee}
          hidden={!breakdown.specialRequestFee}
        />
        <SummaryRow
          label="Local delivery fee"
          value={breakdown.localDeliveryFee}
          hidden={!breakdown.localDeliveryFee}
        />
        <div className="border-t border-slate-200 pt-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-700">Final selling price</span>
            <span className="text-2xl font-bold text-slate-950">
              {formatCurrency(breakdown.finalSellingPrice)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
