export function createQuotationNumber(existingCount = 0) {
  const year = new Date().getFullYear();
  const sequence = String(existingCount + 1).padStart(4, "0");
  return `EMB-${year}-${sequence}`;
}
