import { create } from "zustand";
import {
  findQuotationById,
  getQuotations,
  loadQuotationById,
  loadQuotations,
  saveQuotations,
  setQuotationStatus,
} from "../services/quotationService";
import { APPROVAL_STATUSES } from "../constants/quotationConstants";

export const useQuotationStore = create((set, get) => {
  async function hydrateFromApi() {
    try {
      const quotations = await loadQuotations();
      set({ quotations, isHydrated: true, loadError: "" });
      return quotations;
    } catch (error) {
      set({ isHydrated: true, loadError: error.message });
      throw error;
    }
  }

  async function getWritableQuotations() {
    if (get().isHydrated) {
      return get().quotations;
    }

    return hydrateFromApi();
  }

  async function persistQuotations(quotations) {
    const saved = await saveQuotations(quotations);
    set({ quotations: saved, isHydrated: true, loadError: "" });
    return saved;
  }

  return {
    quotations: getQuotations(),
    isHydrated: false,
    loadError: "",
    hydrateQuotations: async () => {
      try {
        const quotations = await loadQuotations();

        if (!get().isHydrated) {
          set({ quotations, isHydrated: true, loadError: "" });
        }
      } catch (error) {
        if (!get().isHydrated) {
          set({ isHydrated: true, loadError: error.message });
        }

        throw error;
      }
    },
    fetchQuotationById: async (quotationId) => {
      const { quotation, quotations } = await loadQuotationById(quotationId);
      set({ quotations, isHydrated: true, loadError: "" });
      return quotation;
    },
    addQuotation: async (quotation) => {
      const quotations = await getWritableQuotations();
      const next = [quotation, ...quotations.filter((item) => item.id !== quotation.id)];
      await persistQuotations(next);
      return quotation;
    },
    updateQuotation: async (quotationId, values) => {
      const quotations = await getWritableQuotations();
      const next = quotations.map((quotation) =>
        quotation.id === quotationId ? { ...quotation, ...values, updatedAt: new Date().toISOString() } : quotation,
      );
      await persistQuotations(next);
    },
    deleteQuotation: async (quotationId) => {
      const quotations = await getWritableQuotations();
      const next = quotations.filter((quotation) => quotation.id !== quotationId);
      await persistQuotations(next);
    },
    getQuotationById: (quotationId) => findQuotationById(get().quotations, quotationId),
    updateStatus: async (quotationId, status) => {
      const quotations = await getWritableQuotations();
      const quotation = findQuotationById(quotations, quotationId);
      if (!quotation) {
        return { blocked: true, reason: "Quotation was not found." };
      }

      const result = setQuotationStatus(quotation, status);
      if (result.blocked) {
        return result;
      }

      const next = quotations.map((item) =>
        item.id === quotationId ? result.quotation : item,
      );
      await persistQuotations(next);
      return result;
    },
    approveSpecialRequest: async (quotationId) => {
      const quotations = await getWritableQuotations();
      const next = quotations.map((quotation) =>
        quotation.id === quotationId
          ? {
              ...quotation,
              specialRequestApprovalStatus: APPROVAL_STATUSES.APPROVED,
              specialRequestRejectionReason: "",
              updatedAt: new Date().toISOString(),
            }
          : quotation,
      );
      await persistQuotations(next);
    },
    rejectSpecialRequest: async (quotationId, rejectionReason) => {
      const quotations = await getWritableQuotations();
      const next = quotations.map((quotation) =>
        quotation.id === quotationId
          ? {
              ...quotation,
              specialRequestApprovalStatus: APPROVAL_STATUSES.REJECTED,
              specialRequestRejectionReason: rejectionReason.trim(),
              updatedAt: new Date().toISOString(),
            }
          : quotation,
      );
      await persistQuotations(next);
    },
    replaceQuotations: async (quotations) => {
      await persistQuotations(quotations);
    },
  };
});
