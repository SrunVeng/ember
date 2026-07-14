import { Badge } from "../../../components/ui/Badge";
import {
  QUOTATION_STATUSES,
  QUOTATION_STATUS_LABELS,
} from "../constants/quotationConstants";

const variants = {
  [QUOTATION_STATUSES.DRAFT]: "neutral",
  [QUOTATION_STATUSES.PENDING_APPROVAL]: "warning",
  [QUOTATION_STATUSES.APPROVED]: "success",
  [QUOTATION_STATUSES.SENT]: "info",
  [QUOTATION_STATUSES.CANCELLED]: "danger",
};

export function QuotationStatusBadge({ status }) {
  return <Badge variant={variants[status] ?? "neutral"}>{QUOTATION_STATUS_LABELS[status]}</Badge>;
}
