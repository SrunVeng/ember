import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ClipboardList, DollarSign, FilePenLine } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Table } from "../../../components/ui/Table";
import { formatCurrency } from "../../../utils/currency";
import { formatDate } from "../../../utils/date";
import { useCategoryStore } from "../../categories/store/categoryStore";
import { ApprovalStatusBadge } from "../../quotations/components/ApprovalStatusBadge";
import { QuotationStatusBadge } from "../../quotations/components/QuotationStatusBadge";
import { BUSINESS_SECTION_LABELS } from "../../quotations/constants/quotationConstants";
import { useQuotationStore } from "../../quotations/store/quotationStore";
import { getDashboardSummary } from "../services/dashboardService";

const recentColumns = [
  { key: "quotationNumber", label: "Quotation" },
  { key: "customerName", label: "Customer" },
  { key: "productName", label: "Product" },
  { key: "finalSellingPrice", label: "Final Price", render: (row) => formatCurrency(row.finalSellingPrice) },
  { key: "status", label: "Status", render: (row) => <QuotationStatusBadge status={row.status} /> },
  {
    key: "specialRequestApprovalStatus",
    label: "Approval",
    render: (row) => <ApprovalStatusBadge status={row.specialRequestApprovalStatus} />,
  },
  { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
];

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
          </div>
          <span className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const quotations = useQuotationStore((state) => state.quotations);
  const categories = useCategoryStore((state) => state.categories);
  const summary = getDashboardSummary(quotations, categories);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A working overview of quotation volume, approvals, value, and configured pricing categories."
        actions={
          <Button as={Link} to="/quotations/create">
            New quotation
          </Button>
        }
      />
      {summary.pendingApprovals ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium">
                {summary.pendingApprovals} special request approval
                {summary.pendingApprovals === 1 ? " is" : "s are"} waiting for review.
              </p>
            </div>
            <Button as={Link} to="/approvals" variant="secondary" size="sm">
              Review approvals
            </Button>
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total Quotations" value={summary.totalQuotations} icon={ClipboardList} />
        <SummaryCard title="Draft Quotations" value={summary.draftQuotations} icon={FilePenLine} />
        <SummaryCard title="Pending Approvals" value={summary.pendingApprovals} icon={AlertTriangle} />
        <SummaryCard title="Approved Quotations" value={summary.approvedQuotations} icon={CheckCircle2} />
        <SummaryCard title="Total Quoted Value" value={formatCurrency(summary.totalQuotedValue)} icon={DollarSign} />
      </div>
      {quotations.length ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <Card>
            <CardHeader title="Recent Quotations" />
            <CardBody>
              <Table
                columns={recentColumns}
                rows={summary.recentQuotations}
                getRowKey={(quotation) => quotation.id}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Pricing Category Summary" />
            <CardBody className="space-y-3">
              {Object.entries(BUSINESS_SECTION_LABELS).map(([section, label]) => (
                <div key={section} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <Badge variant="info">{summary.categorySummary[section] ?? 0} categories</Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No quotations yet"
          description="Create the first quotation to see dashboard metrics."
          actionLabel="Create quotation"
          onAction={() => navigate("/quotations/create")}
        />
      )}
    </div>
  );
}
