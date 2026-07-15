import { useEffect, useState } from "react";
import { useToastStore } from "../../../stores/toastStore";
import { useQuotationStore } from "../store/quotationStore";

export function useQuotationRecord(quotationId) {
  const quotation = useQuotationStore((state) => state.getQuotationById(quotationId));
  const fetchQuotationById = useQuotationStore((state) => state.fetchQuotationById);
  const addToast = useToastStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(!quotation);
  const [hasLoaded, setHasLoaded] = useState(Boolean(quotation));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadQuotation() {
      if (!quotationId) {
        setIsLoading(false);
        setHasLoaded(true);
        return;
      }

      if (quotation) {
        setIsLoading(false);
        setHasLoaded(true);
        setLoadError("");
        return;
      }

      setIsLoading(true);
      setLoadError("");

      try {
        await fetchQuotationById(quotationId);
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setLoadError(error.message);
        addToast({
          type: "error",
          title: "Quotation could not be loaded",
          message: error.message,
        });
      } finally {
        if (isCurrent) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    }

    loadQuotation();

    return () => {
      isCurrent = false;
    };
  }, [addToast, fetchQuotationById, quotation, quotationId]);

  return { quotation, isLoading, hasLoaded, loadError };
}
