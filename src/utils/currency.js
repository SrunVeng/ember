import { roundMoney } from "../features/pricing/utils/money";

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundMoney(value));
}

export function formatPercent(value) {
  return `${roundMoney(Number(value) * 100)}%`;
}
