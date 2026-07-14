import { APPROVAL_STATUSES, QUOTATION_STATUSES } from "../../quotations/constants/quotationConstants";
import { addMoney } from "../../pricing/utils/money";

export function getDashboardSummary(quotations, categories) {
  const totalQuotedValue = quotations.reduce(
    (total, quotation) => addMoney(total, quotation.finalSellingPrice),
    0,
  );

  return {
    totalQuotations: quotations.length,
    draftQuotations: quotations.filter((quotation) => quotation.status === QUOTATION_STATUSES.DRAFT).length,
    pendingApprovals: quotations.filter(
      (quotation) => quotation.specialRequestApprovalStatus === APPROVAL_STATUSES.PENDING,
    ).length,
    approvedQuotations: quotations.filter((quotation) => quotation.status === QUOTATION_STATUSES.APPROVED).length,
    totalQuotedValue,
    recentQuotations: [...quotations]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    categorySummary: categories.reduce(
      (summary, category) => ({
        ...summary,
        [category.businessSection]: (summary[category.businessSection] ?? 0) + 1,
      }),
      {},
    ),
  };
}
