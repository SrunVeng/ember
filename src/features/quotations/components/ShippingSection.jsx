import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Select } from "../../../components/ui/Select";
import { formatCurrency } from "../../../utils/currency";

export function ShippingSection({ register, errors, shippingMethods }) {
  const options = shippingMethods
    .filter((method) => method.active)
    .map((method) => ({
      value: method.id,
      label: `${method.name} (${formatCurrency(method.ratePerLb)}/lb)`,
    }));

  return (
    <Card>
      <CardHeader title="Shipping" />
      <CardBody>
        <Select
          id="shippingMethodId"
          label="Shipping method"
          required
          error={errors.shippingMethodId?.message}
          options={options}
          {...register("shippingMethodId")}
        />
      </CardBody>
    </Card>
  );
}
