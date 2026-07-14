import { AlertTriangle } from "lucide-react";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Textarea } from "../../../components/ui/Textarea";
import { SPECIAL_REQUEST_APPROVAL_WARNING } from "../constants/quotationConstants";

export function AdditionalChargesSection({ register, errors, watch }) {
  const specialRequest = watch("specialRequest");

  return (
    <Card>
      <CardHeader title="Additional Charges" />
      <CardBody className="space-y-4">
        <Checkbox
          id="specialRequest"
          label="Special request"
          helperText="Adds a special handling fee and routes the quotation for management approval."
          {...register("specialRequest")}
        />
        {specialRequest ? (
          <>
            <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>{SPECIAL_REQUEST_APPROVAL_WARNING}</p>
            </div>
            <Textarea
              id="specialRequestReason"
              label="Special request reason"
              required
              error={errors.specialRequestReason?.message}
              {...register("specialRequestReason")}
            />
          </>
        ) : null}
        <Checkbox
          id="localDelivery"
          label="Local delivery"
          helperText="Adds the configured local delivery fee."
          {...register("localDelivery")}
        />
      </CardBody>
    </Card>
  );
}
