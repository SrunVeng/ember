import { useMemo, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

const DEFAULT_FILTERS = {
  search: "",
  businessSection: "",
  status: "",
  approvalStatus: "",
};

export function useQuotationFilters(quotations) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(filters.search);

  const filteredQuotations = useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();

    return quotations.filter((quotation) => {
      const matchesSearch =
        !search ||
        [quotation.quotationNumber, quotation.customerName, quotation.productName]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesSection =
        !filters.businessSection || quotation.businessSection === filters.businessSection;
      const matchesStatus = !filters.status || quotation.status === filters.status;
      const matchesApproval =
        !filters.approvalStatus ||
        quotation.specialRequestApprovalStatus === filters.approvalStatus;

      return matchesSearch && matchesSection && matchesStatus && matchesApproval;
    });
  }, [debouncedSearch, filters.approvalStatus, filters.businessSection, filters.status, quotations]);

  return {
    filters,
    filteredQuotations,
    setFilter: (name, value) => setFilters((current) => ({ ...current, [name]: value })),
    clearFilters: () => setFilters(DEFAULT_FILTERS),
  };
}
