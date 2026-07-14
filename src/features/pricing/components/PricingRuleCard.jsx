import { Card, CardBody, CardHeader } from "../../../components/ui/Card";

export function PricingRuleCard({ title, description, children }) {
  return (
    <Card>
      <CardHeader title={title} description={description} />
      <CardBody className="space-y-4">{children}</CardBody>
    </Card>
  );
}
