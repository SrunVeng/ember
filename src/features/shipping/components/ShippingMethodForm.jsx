import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Input } from "../../../components/ui/Input";
import { SHIPPING_FORM_DEFAULTS } from "../services/shippingMethodService";
import { shippingMethodSchema } from "../schemas/shippingMethodSchema";

export function ShippingMethodForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { ...SHIPPING_FORM_DEFAULTS, ...initialValues },
    resolver: zodResolver(shippingMethodSchema),
  });

  useEffect(() => {
    reset({ ...SHIPPING_FORM_DEFAULTS, ...initialValues });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-section-grid">
        <Input id="shipping-code" label="Code" required error={errors.code?.message} {...register("code")} />
        <Input id="shipping-name" label="Name" required error={errors.name?.message} {...register("name")} />
        <Input
          id="shipping-rate"
          label="Rate per lb"
          type="number"
          step="0.01"
          required
          error={errors.ratePerLb?.message}
          {...register("ratePerLb")}
        />
      </div>
      <Checkbox id="shipping-active" label="Active" {...register("active")} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save method
        </Button>
      </div>
    </form>
  );
}
