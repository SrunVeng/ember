import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Table } from "../../../components/ui/Table";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "ratePerLb", label: "Rate per lb", render: (row) => formatCurrency(row.ratePerLb) },
  {
    key: "active",
    label: "Status",
    render: (row) => <Badge variant={row.active ? "success" : "neutral"}>{row.active ? "Active" : "Disabled"}</Badge>,
  },
  { key: "updatedAt", label: "Updated", render: (row) => formatDate(row.updatedAt) },
];

export function ShippingMethodTable({ methods, onEdit, onToggleActive }) {
  return (
    <Table
      columns={columns}
      rows={methods}
      getRowKey={(method) => method.id}
      renderActions={(method) => (
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(method)}>
            Edit
          </Button>
          <Button
            variant={method.active ? "danger" : "secondary"}
            size="sm"
            onClick={() => onToggleActive(method)}
          >
            {method.active ? "Disable" : "Enable"}
          </Button>
        </div>
      )}
    />
  );
}
