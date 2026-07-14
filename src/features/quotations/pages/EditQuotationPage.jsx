import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import { useToastStore } from "../../../stores/toastStore";
import { QuotationForm } from "../components/QuotationForm";
import { useQuotationStore } from "../store/quotationStore";
import { quotationToFormValues } from "../utils/quotationMapper";

export function EditQuotationPage() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const quotation = useQuotationStore((state) => state.getQuotationById(quotationId));
  const updateQuotation = useQuotationStore((state) => state.updateQuotation);
  const categories = useCategoryStore((state) => state.categories);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
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

  async function handleSubmit(updatedQuotation) {
    updateQuotation(quotation.id, updatedQuotation);
    addToast({ type: "success", title: "Quotation updated", message: quotation.quotationNumber });
    navigate(`/quotations/${quotation.id}`);
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
