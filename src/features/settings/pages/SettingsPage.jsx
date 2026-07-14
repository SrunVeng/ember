import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PageHeader } from "../../../components/ui/PageHeader";
import { clearApplicationStorage } from "../../../services/storageService";
import { COLLECTIONS } from "../../../services/persistenceService";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useToastStore } from "../../../stores/toastStore";

export function SettingsPage() {
  const resetDialog = useDisclosure();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  function handleClearStorage() {
    clearApplicationStorage();
    addToast({ type: "success", title: "API data cleared", message: "Blob collections were reset." });
    resetDialog.close();
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Owner controls for Vercel Blob API collections and backend readiness."
      />
      <Card>
        <CardHeader
          title="Vercel Blob Collections"
          description="The app reads and writes data through the /api/storage backend route."
        />
        <CardBody className="space-y-4">
          <ul className="space-y-2 text-sm text-slate-600">
            {Object.entries(COLLECTIONS).map(([name, collection]) => (
              <li key={collection} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">{name}</span>: {collection}
              </li>
            ))}
          </ul>
          <Button variant="danger" onClick={resetDialog.open}>
            Clear saved feature data
          </Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Backend Readiness" />
        <CardBody>
          <p className="text-sm leading-6 text-slate-600">
            Services own persistence boundaries, so the UI talks to feature stores while the stores persist
            through the API-backed Vercel Blob collections.
          </p>
        </CardBody>
      </Card>
      <ConfirmDialog
        isOpen={resetDialog.isOpen}
        title="Clear Blob data?"
        description="This removes saved quotations, rules, categories, shipping methods, and preferences from the Vercel Blob API collections."
        confirmLabel="Clear saved data"
        onCancel={resetDialog.close}
        onConfirm={handleClearStorage}
      />
    </div>
  );
}
