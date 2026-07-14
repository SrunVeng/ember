import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { useShippingMethodStore } from "../../shipping/store/shippingMethodStore";
import { useToastStore } from "../../../stores/toastStore";
import { QuotationForm } from "../components/QuotationForm";
import { useQuotationStore } from "../store/quotationStore";
import { createQuotationNumber } from "../utils/quotationNumber";

export function CreateQuotationPage() {
  const navigate = useNavigate();
  const quotations = useQuotationStore((state) => state.quotations);
  const addQuotation = useQuotationStore((state) => state.addQuotation);
  const categories = useCategoryStore((state) => state.categories);
  const shippingMethods = useShippingMethodStore((state) => state.shippingMethods);
  const addToast = useToastStore((state) => state.addToast);
  const quotationNumber = useMemo(() => createQuotationNumber(quotations.length), [quotations.length]);

  async function handleSubmit(quotation) {
    try {
      await addQuotation(quotation);
      addToast({ type: "success", title: "Quotation created", message: quotation.quotationNumber });
      navigate(`/quotations/${quotation.id}`);
    } catch (error) {
      addToast({ type: "error", title: "Quotation was not saved", message: error.message });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Quotation"
        description="Build a quotation with live pricing, shipping, special request, and delivery calculations."
      />
      <QuotationForm
        quotationNumber={quotationNumber}
        categories={categories}
        shippingMethods={shippingMethods}
        submitLabel="Create quotation"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
