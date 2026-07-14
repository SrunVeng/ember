import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Pencil } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useToastStore } from "../../../stores/toastStore";
import { QuotationDetailsCard } from "../components/QuotationDetailsCard";
import { useQuotationStore } from "../store/quotationStore";

export function QuotationDetailsPage() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const quotation = useQuotationStore((state) => state.getQuotationById(quotationId));
  const addToast = useToastStore((state) => state.addToast);

  if (!quotation) {
    return (
      <EmptyState
        title="Quotation not found"
        description="The quotation may have been deleted or the link may be outdated."
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
                downloadInvoice(quotation);
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
