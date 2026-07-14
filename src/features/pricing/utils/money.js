import { toNumber } from "../../../utils/number";

export function roundMoney(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
}

export function addMoney(...values) {
  return roundMoney(values.reduce((total, value) => total + toNumber(value), 0));
}

export function multiplyMoney(amount, rate) {
  return roundMoney(toNumber(amount) * toNumber(rate));
}
