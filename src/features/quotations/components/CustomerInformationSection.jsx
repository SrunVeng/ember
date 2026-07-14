import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";

export function CustomerInformationSection({ register, errors }) {
  return (
    <Card>
      <CardHeader title="Customer Information" />
      <CardBody className="space-y-4">
        <div className="form-section-grid">
          <Input
            id="customerName"
            label="Customer name"
            required
            error={errors.customerName?.message}
            {...register("customerName")}
          />
          <Input
            id="customerPhone"
            label="Customer phone"
            error={errors.customerPhone?.message}
            {...register("customerPhone")}
          />
        </div>
        <Textarea
          id="customerAddress"
          label="Customer address"
          error={errors.customerAddress?.message}
          {...register("customerAddress")}
        />
      </CardBody>
    </Card>
  );
}
