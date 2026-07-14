import { cn } from "../../utils/classNames";

const variants = {
  primary: "border-transparent bg-slate-950 text-white hover:bg-slate-800",
  secondary: "border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
  danger: "border-transparent bg-red-600 text-white hover:bg-red-700",
  ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100",
};

const sizes = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  as: Component = "button",
  type = "button",
  icon: Icon,
  ...props
}) {
  const componentProps = Component === "button" ? { type } : {};

  return (
    <Component
      {...componentProps}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </Component>
  );
}
