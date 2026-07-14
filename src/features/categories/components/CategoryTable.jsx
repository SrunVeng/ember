import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { formatDate } from "../../../utils/date";
import { BUSINESS_SECTION_LABELS } from "../../quotations/constants/quotationConstants";

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  {
    key: "businessSection",
    label: "Business Section",
    render: (row) => BUSINESS_SECTION_LABELS[row.businessSection],
  },
  { key: "pricingType", label: "Pricing Type" },
  {
    key: "active",
    label: "Status",
    render: (row) => <Badge variant={row.active ? "success" : "neutral"}>{row.active ? "Active" : "Disabled"}</Badge>,
  },
  { key: "updatedAt", label: "Updated", render: (row) => formatDate(row.updatedAt) },
];

export function CategoryTable({ categories, onEdit, onToggleActive }) {
  return (
    <Table
      columns={columns}
      rows={categories}
      getRowKey={(category) => category.id}
      renderActions={(category) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(category)}>
            Edit
          </Button>
          <Button
            variant={category.active ? "danger" : "secondary"}
            size="sm"
            onClick={() => onToggleActive(category)}
          >
            {category.active ? "Disable" : "Enable"}
          </Button>
        </div>
      )}
    />
  );
}
