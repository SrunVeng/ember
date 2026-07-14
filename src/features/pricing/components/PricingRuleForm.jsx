import { Input } from "../../../components/ui/Input";

export function PricingNumberField({ id, label, value, onChange, helperText, step = "0.01" }) {
  return (
    <Input
      id={id}
      label={label}
      type="number"
      step={step}
      min="0"
      value={value}
      helperText={helperText}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
