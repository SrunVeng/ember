import { create } from "zustand";
import {
  findQuotationById,
  getQuotations,
  loadQuotations,
  saveQuotations,
  setQuotationStatus,
} from "../services/quotationService";
import { APPROVAL_STATUSES } from "../constants/quotationConstants";

export const useQuotationStore = create((set, get) => ({
  quotations: getQuotations(),
  isHydrated: false,
  hydrateQuotations: async () => {
    const quotations = await loadQuotations();
    set({ quotations, isHydrated: true });
  },
  addQuotation: async (quotation) => {
    const next = [quotation, ...get().quotations];
    const saved = await saveQuotations(next);
    set({ quotations: saved });
    return quotation;
  },
  updateQuotation: async (quotationId, values) => {
    const next = get().quotations.map((quotation) =>
      quotation.id === quotationId ? { ...quotation, ...values, updatedAt: new Date().toISOString() } : quotation,
    );
    const saved = await saveQuotations(next);
    set({ quotations: saved });
  },
  deleteQuotation: async (quotationId) => {
    const next = get().quotations.filter((quotation) => quotation.id !== quotationId);
    const saved = await saveQuotations(next);
    set({ quotations: saved });
  },
  getQuotationById: (quotationId) => findQuotationById(get().quotations, quotationId),
  updateStatus: async (quotationId, status) => {
    const quotation = findQuotationById(get().quotations, quotationId);
    if (!quotation) {
      return { blocked: true, reason: "Quotation was not found." };
    }

    const result = setQuotationStatus(quotation, status);
    if (result.blocked) {
      return result;
    }

    const next = get().quotations.map((item) =>
      item.id === quotationId ? result.quotation : item,
    );
    const saved = await saveQuotations(next);
    set({ quotations: saved });
    return result;
  },
  approveSpecialRequest: async (quotationId) => {
    const next = get().quotations.map((quotation) =>
      quotation.id === quotationId
        ? {
            ...quotation,
            specialRequestApprovalStatus: APPROVAL_STATUSES.APPROVED,
            specialRequestRejectionReason: "",
            updatedAt: new Date().toISOString(),
          }
        : quotation,
    );
    const saved = await saveQuotations(next);
    set({ quotations: saved });
  },
  rejectSpecialRequest: async (quotationId, rejectionReason) => {
    const next = get().quotations.map((quotation) =>
      quotation.id === quotationId
        ? {
            ...quotation,
            specialRequestApprovalStatus: APPROVAL_STATUSES.REJECTED,
            specialRequestRejectionReason: rejectionReason.trim(),
            updatedAt: new Date().toISOString(),
          }
        : quotation,
    );
    const saved = await saveQuotations(next);
    set({ quotations: saved });
  },
  replaceQuotations: async (quotations) => {
    const saved = await saveQuotations(quotations);
    set({ quotations: saved });
  },
}));
