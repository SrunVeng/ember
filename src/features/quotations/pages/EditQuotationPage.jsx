import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import { useToastStore } from "../../../stores/toastStore";
import { QuotationForm } from "../components/QuotationForm";
import { useQuotationRecord } from "../hooks/useQuotationRecord";
import { useQuotationStore } from "../store/quotationStore";
import { quotationToFormValues } from "../utils/quotationMapper";

export function EditQuotationPage() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const { quotation, isLoading, hasLoaded, loadError } = useQuotationRecord(quotationId);
  const updateQuotation = useQuotationStore((state) => state.updateQuotation);
  const categories = useCategoryStore((state) => state.categories);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
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

  async function handleSubmit(updatedQuotation) {
    try {
      await updateQuotation(quotation.id, updatedQuotation);
      addToast({ type: "success", title: "Quotation updated", message: quotation.quotationNumber });
      navigate(`/quotations/${quotation.id}`);
    } catch (error) {
      addToast({ type: "error", title: "Quotation was not saved", message: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Quotation" description={quotation.quotationNumber} />
      <QuotationForm
        defaultValues={quotationToFormValues(quotation)}
        existingQuotation={quotation}
        categories={categories}
        shippingMethods={shippingMethods}
        submitLabel="Save quotation"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
