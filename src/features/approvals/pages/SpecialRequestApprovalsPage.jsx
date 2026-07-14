import { useMemo, useState } from "react";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useToastStore } from "../../../stores/toastStore";
import { ApprovalDecisionModal } from "../components/ApprovalDecisionModal";
import { ApprovalTable } from "../components/ApprovalTable";
import { getPendingSpecialRequestApprovals } from "../services/approvalService";
import { useQuotationStore } from "../../quotations/store/quotationStore";

export function SpecialRequestApprovalsPage() {
  const quotations = useQuotationStore((state) => state.quotations);
  const approveSpecialRequest = useQuotationStore((state) => state.approveSpecialRequest);
  const rejectSpecialRequest = useQuotationStore((state) => state.rejectSpecialRequest);
  const addToast = useToastStore((state) => state.addToast);
  const [quotationToReject, setQuotationToReject] = useState(null);

  const approvals = useMemo(() => getPendingSpecialRequestApprovals(quotations), [quotations]);

  function handleApprove(quotation) {
    approveSpecialRequest(quotation.id);
    addToast({ type: "success", title: "Special request approved", message: quotation.quotationNumber });
  }

  function handleReject(reason) {
    rejectSpecialRequest(quotationToReject.id, reason);
    addToast({ type: "success", title: "Special request rejected", message: quotationToReject.quotationNumber });
    setQuotationToReject(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Special Request Approvals"
        description="Review pending special request fees and approve or reject management exceptions."
      />
      {approvals.length ? (
        <ApprovalTable
          approvals={approvals}
          onApprove={handleApprove}
          onReject={setQuotationToReject}
        />
      ) : (
        <EmptyState title="No pending approvals" description="Special request approvals will appear here." />
      )}
      <ApprovalDecisionModal
        quotation={quotationToReject}
        onClose={() => setQuotationToReject(null)}
        onReject={handleReject}
      />
    </div>
  );
}
