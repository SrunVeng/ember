import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { Textarea } from "../../../components/ui/Textarea";

export function ApprovalDecisionModal({ quotation, onClose, onReject }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleReject() {
    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }

    onReject(reason);
    setReason("");
    setError("");
  }

  return (
    <Modal
      isOpen={Boolean(quotation)}
      title="Reject Special Request"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject}>
            Reject request
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          {quotation?.quotationNumber} · {quotation?.customerName}
        </p>
        <Textarea
          id="rejection-reason"
          label="Rejection reason"
          required
          value={reason}
          error={error}
          onChange={(event) => {
            setReason(event.target.value);
            setError("");
          }}
        />
      </div>
    </Modal>
  );
}
