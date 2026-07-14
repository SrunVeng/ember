import { Badge } from "../../../components/ui/Badge";
import {
  APPROVAL_STATUSES,
  APPROVAL_STATUS_LABELS,
} from "../constants/quotationConstants";

const variants = {
  [APPROVAL_STATUSES.NOT_REQUIRED]: "neutral",
  [APPROVAL_STATUSES.PENDING]: "warning",
  [APPROVAL_STATUSES.APPROVED]: "success",
  [APPROVAL_STATUSES.REJECTED]: "danger",
};

export function ApprovalStatusBadge({ status }) {
  return <Badge variant={variants[status] ?? "neutral"}>{APPROVAL_STATUS_LABELS[status]}</Badge>;
}
