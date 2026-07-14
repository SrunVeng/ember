import { APPROVAL_STATUSES } from "../../quotations/constants/quotationConstants";

export function getPendingSpecialRequestApprovals(quotations) {
  return quotations.filter(
    (quotation) =>
      quotation.specialRequest &&
      quotation.specialRequestApprovalStatus === APPROVAL_STATUSES.PENDING,
  );
}
