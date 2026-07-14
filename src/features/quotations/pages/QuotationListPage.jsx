import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Pagination } from "../../../components/ui/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { QuotationFilters } from "../components/QuotationFilters";
import { QuotationTable } from "../components/QuotationTable";
import { useQuotationFilters } from "../hooks/useQuotationFilters";
import { useQuotationStore } from "../store/quotationStore";

export function QuotationListPage() {
  const navigate = useNavigate();
  const quotations = useQuotationStore((state) => state.quotations);
  const { filters, filteredQuotations, setFilter, clearFilters } = useQuotationFilters(quotations);
  const { page, pageCount, paginatedItems, setPage } = usePagination(filteredQuotations, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Search customer quotations and open a record for details or changes."
        actions={
          <Button as={Link} to="/quotations/create" icon={Plus}>
            New quotation
          </Button>
        }
      />
      <QuotationFilters
        filters={filters}
        setFilter={(name, value) => {
          setFilter(name, value);
          setPage(1);
        }}
        clearFilters={() => {
          clearFilters();
          setPage(1);
        }}
        resultCount={filteredQuotations.length}
      />
      {paginatedItems.length ? (
        <div className="space-y-4">
          <QuotationTable quotations={paginatedItems} />
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      ) : (
        <EmptyState
          title="No quotations found"
          description="Create a quotation or adjust the current filters."
          actionLabel="Create quotation"
          onAction={() => navigate("/quotations/create")}
        />
      )}
    </div>
  );
}
