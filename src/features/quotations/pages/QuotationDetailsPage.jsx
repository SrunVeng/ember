import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useAppStore } from "../../../stores/appStore";
import { useToastStore } from "../../../stores/toastStore";
import { QuotationDetailsCard } from "../components/QuotationDetailsCard";
import { useQuotationRecord } from "../hooks/useQuotationRecord";

export function QuotationDetailsPage() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const { quotation, isLoading, hasLoaded, loadError } = useQuotationRecord(quotationId);
  const companyProfile = useAppStore((state) => state.preferences.companyProfile);
  const addToast = useToastStore((state) => state.addToast);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Loading quotation" description="Fetching the quotation from the API." />
        <Card>
          <CardBody>
            <LoadingSpinner label="Loading quotation" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (hasLoaded && !quotation) {
    return (
      <EmptyState
        title="Quotation not found"
        description={loadError || "The quotation may have been deleted or the link may be outdated."}
        actionLabel="Back to quotations"
        onAction={() => navigate("/quotations")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={quotation.quotationNumber}
        description={`${quotation.customerName} · ${quotation.productName}`}
        actions={
          <>
            <Button as={Link} to={`/quotations/${quotation.id}/edit`} variant="secondary" icon={Pencil}>
              Edit
            </Button>
            <Button
              variant="primary"
              icon={Download}
              onClick={async () => {
                const { downloadInvoice } = await import("../../invoices/services/invoiceService");
                downloadInvoice(quotation, companyProfile);
                addToast({ type: "success", title: "Invoice downloaded" });
              }}
            >
              Download invoice
            </Button>
          </>
        }
      />
      <QuotationDetailsCard quotation={quotation} />
    </div>
  );
}
