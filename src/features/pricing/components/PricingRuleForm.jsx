import { FormError } from "../../../components/ui/FormError";
import { cn } from "../../../utils/classNames";

const inputClass =
  "block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100";

function toDisplayValue(value, format) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  return format === "percent" ? Number(value) * 100 : value;
}

function toStoredValue(value, format) {
  if (value === "") {
    return "";
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }

  return format === "percent" ? parsed / 100 : parsed;
}

export function PricingNumberField({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  format = "money",
  step = "0.01",
  min = "0",
  prefix,
  suffix,
}) {
  const errorId = error ? `${id}-error` : undefined;
  const fieldPrefix = prefix ?? (format === "money" ? "$" : "");
  const fieldSuffix = suffix ?? (format === "percent" ? "%" : "");

  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <span className="relative block">
        {fieldPrefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            {fieldPrefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          min={min}
          step={step}
          value={toDisplayValue(value, format)}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(
            inputClass,
            fieldPrefix && "pl-7",
            fieldSuffix && "pr-9",
            error && "border-red-400 focus:border-red-600",
          )}
          onChange={(event) => onChange(toStoredValue(event.target.value, format))}
        />
        {fieldSuffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
            {fieldSuffix}
          </span>
        ) : null}
      </span>
      {helperText && !error ? <p className="mt-1 text-xs leading-5 text-slate-500">{helperText}</p> : null}
      <FormError id={errorId}>{error}</FormError>
    </label>
  );
}
