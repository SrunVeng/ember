import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";

const columns = [
  { key: "quotationNumber", label: "Quotation Number" },
  { key: "customerName", label: "Customer" },
  { key: "productName", label: "Product" },
  { key: "websitePrice", label: "Website Price", render: (row) => formatCurrency(row.websitePrice) },
  { key: "specialRequestFee", label: "Request Fee", render: (row) => formatCurrency(row.specialRequestFee) },
  { key: "specialRequestReason", label: "Reason" },
  { key: "createdBy", label: "Created By" },
  { key: "createdAt", label: "Created Date", render: (row) => formatDate(row.createdAt) },
];

export function ApprovalTable({ approvals, onApprove, onReject }) {
  return (
    <Table
      columns={columns}
      rows={approvals}
      getRowKey={(quotation) => quotation.id}
      renderActions={(quotation) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => onApprove(quotation)}>
            Approve
          </Button>
          <Button variant="danger" size="sm" onClick={() => onReject(quotation)}>
            Reject
          </Button>
        </div>
      )}
    />
  );
}
