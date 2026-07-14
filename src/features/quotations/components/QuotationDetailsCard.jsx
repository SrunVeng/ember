import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { formatCurrency } from "../../../utils/currency";
import { formatDateTime } from "../../../utils/date";
import { ApprovalStatusBadge } from "./ApprovalStatusBadge";
import { QuotationStatusBadge } from "./QuotationStatusBadge";

function DetailRow({ label, value }) {
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-2">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">{value || "Not provided"}</dd>
    </div>
  );
}

export function QuotationDetailsCard({ quotation }) {
  const priceRows = [
    ["Website price", quotation.websitePrice],
    ["California tax", quotation.taxAmount],
    ["Category profit", quotation.profitAmount],
    ["Shipping company fee", quotation.shippingCompanyFee],
    ["Shipping", quotation.shippingAmount],
    ["Special request fee", quotation.specialRequestFee],
    ["Local delivery fee", quotation.localDeliveryFee],
    ["Final selling price", quotation.finalSellingPrice],
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader title="Customer Information" />
        <CardBody>
          <dl>
            <DetailRow label="Name" value={quotation.customerName} />
            <DetailRow label="Phone" value={quotation.customerPhone} />
            <DetailRow label="Address" value={quotation.customerAddress} />
          </dl>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Product Information" />
        <CardBody>
          <dl>
            <DetailRow label="Business section" value={quotation.businessSection} />
            <DetailRow label="Product" value={quotation.productName} />
            <DetailRow label="Product URL" value={quotation.productUrl} />
            <DetailRow label="Category" value={quotation.productCategory} />
            <DetailRow label="Weight" value={`${quotation.estimatedWeight} lb`} />
          </dl>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Shipping Details" />
        <CardBody>
          <dl>
            <DetailRow label="Shipping method" value={quotation.shippingMethodName} />
            <DetailRow label="Shipping rate" value={`${formatCurrency(quotation.shippingRate)}/lb`} />
            <DetailRow label="Shipping amount" value={formatCurrency(quotation.shippingAmount)} />
          </dl>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Price Breakdown" />
        <CardBody>
          <dl>
            {priceRows.map(([label, value]) => (
              <DetailRow key={label} label={label} value={formatCurrency(value)} />
            ))}
          </dl>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Special Request Information" />
        <CardBody>
          <dl>
            <DetailRow label="Special request" value={quotation.specialRequest ? "Yes" : "No"} />
            <DetailRow label="Reason" value={quotation.specialRequestReason} />
            <DetailRow
              label="Approval"
              value={<ApprovalStatusBadge status={quotation.specialRequestApprovalStatus} />}
            />
            <DetailRow label="Rejection reason" value={quotation.specialRequestRejectionReason} />
          </dl>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Status and Audit" />
        <CardBody>
          <dl>
            <DetailRow label="Quotation status" value={<QuotationStatusBadge status={quotation.status} />} />
            <DetailRow label="Created by" value={quotation.createdBy} />
            <DetailRow label="Created at" value={formatDateTime(quotation.createdAt)} />
            <DetailRow label="Updated at" value={formatDateTime(quotation.updatedAt)} />
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
