import { cn } from "../../utils/classNames";

export function Checkbox({ label, id, helperText, className, ...props }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-900"
        {...props}
      />
      <span>
        <span className="block font-medium text-slate-800">{label}</span>
        {helperText ? <span className="mt-1 block text-slate-500">{helperText}</span> : null}
      </span>
    </label>
  );
}
