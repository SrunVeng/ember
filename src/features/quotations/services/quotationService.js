import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../../../services/persistenceService";
import { APPROVAL_STATUSES, QUOTATION_STATUSES } from "../constants/quotationConstants";

const EMPTY_QUOTATIONS = [];

export function getQuotations() {
  return getInitialCollection(COLLECTIONS.quotations, EMPTY_QUOTATIONS);
}

export async function loadQuotations() {
  return loadCollection(COLLECTIONS.quotations, EMPTY_QUOTATIONS, { persistFallback: true });
}

export function saveQuotations(quotations) {
  return saveCollection(COLLECTIONS.quotations, quotations);
}

export function findQuotationById(quotations, quotationId) {
  return quotations.find((quotation) => quotation.id === quotationId);
}

export function canMoveToCustomerStatus(quotation) {
  return (
    !quotation.specialRequest ||
    quotation.specialRequestApprovalStatus === APPROVAL_STATUSES.APPROVED
  );
}

export function setQuotationStatus(quotation, status) {
  if (
    [QUOTATION_STATUSES.APPROVED, QUOTATION_STATUSES.SENT].includes(status) &&
    !canMoveToCustomerStatus(quotation)
  ) {
    return {
      quotation,
      blocked: true,
      reason: "Special request approval is required before approving or sending this quotation.",
    };
  }

  return {
    quotation: {
      ...quotation,
      status,
      updatedAt: new Date().toISOString(),
    },
    blocked: false,
  };
}
