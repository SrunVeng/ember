import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { ApprovalStatusBadge } from "./ApprovalStatusBadge";
import { QuotationStatusBadge } from "./QuotationStatusBadge";

const columns = [
  { key: "quotationNumber", label: "Quotation Number" },
  { key: "customerName", label: "Customer" },
  { key: "productName", label: "Product" },
  { key: "productCategory", label: "Category" },
  { key: "websitePrice", label: "Website Price", render: (row) => formatCurrency(row.websitePrice) },
  { key: "finalSellingPrice", label: "Final Price", render: (row) => formatCurrency(row.finalSellingPrice) },
  { key: "status", label: "Status", render: (row) => <QuotationStatusBadge status={row.status} /> },
  {
    key: "specialRequestApprovalStatus",
    label: "Approval Status",
    render: (row) => <ApprovalStatusBadge status={row.specialRequestApprovalStatus} />,
  },
  { key: "createdAt", label: "Created Date", render: (row) => formatDate(row.createdAt) },
];

export function QuotationTable({ quotations }) {
  return (
    <Table
      columns={columns}
      rows={quotations}
      getRowKey={(quotation) => quotation.id}
      renderActions={(quotation) => (
        <div className="flex justify-end gap-2">
          <Button
            as={Link}
            to={`/quotations/${quotation.id}`}
            variant="ghost"
            size="sm"
            icon={Eye}
            aria-label={`View ${quotation.quotationNumber}`}
          >
            Open
          </Button>
        </div>
      )}
    />
  );
}
