import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/classNames";
import { FormError } from "./FormError";

const selectClass =
  "block h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm font-medium text-slate-950 shadow-sm transition hover:border-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100";

export function Select({
  label,
  id,
  error,
  helperText,
  required,
  options = [],
  placeholder = "Select an option",
  className,
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className="block" htmlFor={id}>
      {label ? (
        <span className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="text-red-600">*</span> : null}
        </span>
      ) : null}
      <span className="relative block">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn(selectClass, error && "border-red-400 focus:border-red-600", className)}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </span>
      </span>
      {helperText && !error ? <p className="mt-1 text-sm text-slate-500">{helperText}</p> : null}
      <FormError id={errorId}>{error}</FormError>
    </label>
  );
}
