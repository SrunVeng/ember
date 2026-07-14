import { cn } from "../../utils/classNames";
import { FormError } from "./FormError";

const textareaClass =
  "block min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100";

export function Textarea({ label, id, error, helperText, required, className, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className="block" htmlFor={id}>
      {label ? (
        <span className="mb-1 flex items-center gap-1 text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="text-red-600">*</span> : null}
        </span>
      ) : null}
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        className={cn(textareaClass, error && "border-red-400 focus:border-red-600", className)}
        {...props}
      />
      {helperText && !error ? <p className="mt-1 text-sm text-slate-500">{helperText}</p> : null}
      <FormError id={errorId}>{error}</FormError>
    </label>
  );
}
