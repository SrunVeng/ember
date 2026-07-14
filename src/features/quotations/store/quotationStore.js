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
  addQuotation: (quotation) => {
    const next = [quotation, ...get().quotations];
    set({ quotations: saveQuotations(next) });
  },
  updateQuotation: (quotationId, values) => {
    const next = get().quotations.map((quotation) =>
      quotation.id === quotationId ? { ...quotation, ...values, updatedAt: new Date().toISOString() } : quotation,
    );
    set({ quotations: saveQuotations(next) });
  },
  deleteQuotation: (quotationId) => {
    const next = get().quotations.filter((quotation) => quotation.id !== quotationId);
    set({ quotations: saveQuotations(next) });
  },
  getQuotationById: (quotationId) => findQuotationById(get().quotations, quotationId),
  updateStatus: (quotationId, status) => {
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
    set({ quotations: saveQuotations(next) });
    return result;
  },
  approveSpecialRequest: (quotationId) => {
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
    set({ quotations: saveQuotations(next) });
  },
  rejectSpecialRequest: (quotationId, rejectionReason) => {
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
    set({ quotations: saveQuotations(next) });
  },
  replaceQuotations: (quotations) => {
    set({ quotations: saveQuotations(quotations) });
  },
}));
