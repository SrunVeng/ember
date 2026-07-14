import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "../../components/ui/ToastContainer";
import { useCategoryStore } from "../../features/categories/store/categoryStore";
import { usePricingRulesStore } from "../../features/pricing/store/pricingRulesStore";
import { useQuotationStore } from "../../features/quotations/store/quotationStore";
import { useShippingMethodStore } from "../../features/shipping/store/shippingMethodStore";
import { useAppStore } from "../../stores/appStore";
import { ErrorBoundary } from "../ErrorBoundary";

export function AppProviders({ children }) {
  useEffect(() => {
    useAppStore.getState().hydratePreferences();
    usePricingRulesStore.getState().hydratePricingRules();
    useCategoryStore.getState().hydrateCategories();
    useShippingMethodStore.getState().hydrateShippingMethods();
    useQuotationStore.getState().hydrateQuotations();
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
