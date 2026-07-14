export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const normalized = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(normalized) ? normalized : fallback;
}

export function clampPositive(value) {
  return Math.max(0, toNumber(value));
}
