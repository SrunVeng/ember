import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import {
  APPROVAL_STATUS_LABELS,
  APPROVAL_STATUSES,
  BUSINESS_SECTION_LABELS,
  BUSINESS_SECTIONS,
  QUOTATION_STATUS_LABELS,
  QUOTATION_STATUSES,
} from "../constants/quotationConstants";

function toOptions(labels, values) {
  return values.map((value) => ({ value, label: labels[value] }));
}

export function QuotationFilters({ filters, setFilter, clearFilters, resultCount }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Input
          id="quotation-search"
          label="Search"
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          placeholder="Number, customer, product"
        />
        <Select
          id="business-section-filter"
          label="Business section"
          value={filters.businessSection}
          onChange={(event) => setFilter("businessSection", event.target.value)}
          options={toOptions(BUSINESS_SECTION_LABELS, Object.values(BUSINESS_SECTIONS))}
          placeholder="All sections"
        />
        <Select
          id="status-filter"
          label="Quotation status"
          value={filters.status}
          onChange={(event) => setFilter("status", event.target.value)}
          options={toOptions(QUOTATION_STATUS_LABELS, Object.values(QUOTATION_STATUSES))}
          placeholder="All statuses"
        />
        <Select
          id="approval-filter"
          label="Approval status"
          value={filters.approvalStatus}
          onChange={(event) => setFilter("approvalStatus", event.target.value)}
          options={toOptions(APPROVAL_STATUS_LABELS, Object.values(APPROVAL_STATUSES))}
          placeholder="All approvals"
        />
        <div className="flex items-end gap-3">
          <Button variant="secondary" className="w-full" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{resultCount} matching records</p>
    </div>
  );
}
