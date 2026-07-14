import { useMemo, useState } from "react";

export function usePagination(items, pageSize = 8) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (Math.min(page, pageCount) - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, page, pageCount, pageSize]);

  return {
    page: Math.min(page, pageCount),
    pageCount,
    paginatedItems,
    setPage,
  };
}
