import { useEffect, useState } from "react";
import { Building2, Database, Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Textarea } from "../../../components/ui/Textarea";
import { COLLECTIONS } from "../../../services/persistenceService";
import { useAppStore } from "../../../stores/appStore";
import { useToastStore } from "../../../stores/toastStore";

function createProfileForm(companyProfile = {}) {
  return {
    companyName: companyProfile.companyName || "",
    phone: companyProfile.phone || "",
    email: companyProfile.email || "",
    address: companyProfile.address || "",
    invoiceNote: companyProfile.invoiceNote || "",
  };
}

export function SettingsPage() {
  const companyProfile = useAppStore((state) => state.preferences.companyProfile);
  const updateCompanyProfile = useAppStore((state) => state.updateCompanyProfile);
  const addToast = useToastStore((state) => state.addToast);
  const [form, setForm] = useState(() => createProfileForm(companyProfile));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(createProfileForm(companyProfile));
  }, [companyProfile]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.companyName.trim()) {
      setErrors({ companyName: "Company name is required." });
      return;
    }

    setIsSaving(true);

    try {
      await updateCompanyProfile(form);
      addToast({ type: "success", title: "Business profile saved" });
    } catch (error) {
      addToast({ type: "error", title: "Settings were not saved", message: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Settings"
        description="Owner settings for company details used on customer invoices."
      />
      <Card>
        <CardHeader
          title="Invoice Business Profile"
          description="These details appear on downloaded customer invoices."
          action={<Building2 className="h-5 w-5 text-slate-500" aria-hidden="true" />}
        />
        <CardBody>
          <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
            <Input
              id="company-name"
              label="Company name"
              required
              value={form.companyName}
              error={errors.companyName}
              onChange={(event) => updateField("companyName", event.target.value)}
            />
            <Input
              id="company-phone"
              label="Phone"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
            <Input
              id="company-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            <Input
              id="company-address"
              label="Address"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
            <div className="lg:col-span-2">
              <Textarea
                id="invoice-note"
                label="Invoice note"
                value={form.invoiceNote}
                onChange={(event) => updateField("invoiceNote", event.target.value)}
              />
            </div>
            <div className="flex justify-end lg:col-span-2">
              <Button type="submit" icon={Save} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save settings"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader
          title="Data Connection"
          description="Saved settings and feature data are stored through the backend API."
          action={<Database className="h-5 w-5 text-slate-500" aria-hidden="true" />}
        />
        <CardBody>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {Object.entries(COLLECTIONS).map(([name, collection]) => (
              <div key={collection} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <dt className="font-semibold text-slate-900">{name}</dt>
                <dd className="mt-1 text-slate-600">{collection}</dd>
              </div>
            ))}
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
