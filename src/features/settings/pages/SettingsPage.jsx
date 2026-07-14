import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { PageHeader } from "../../../components/ui/PageHeader";
import { STORAGE_KEYS } from "../../../lib/storage/storageKeys";
import { clearApplicationStorage } from "../../../services/storageService";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useToastStore } from "../../../stores/toastStore";

export function SettingsPage() {
  const resetDialog = useDisclosure();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  function handleClearStorage() {
    clearApplicationStorage();
    addToast({ type: "success", title: "Local data cleared", message: "Reloading default mock data." });
    resetDialog.close();
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Starter controls for local persistence and future application preferences."
      />
      <Card>
        <CardHeader
          title="Storage"
          description="Vercel Blob is used through the /api/storage backend route when deployed. Local storage remains a development fallback."
        />
        <CardBody className="space-y-4">
          <ul className="space-y-2 text-sm text-slate-600">
            {Object.entries(STORAGE_KEYS).map(([name, key]) => (
              <li key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-800">{name}</span>: {key}
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
            Services own persistence boundaries, so storage can move from local fallback to Vercel Blob
            or a relational API without rewriting page or component markup.
          </p>
        </CardBody>
      </Card>
      <ConfirmDialog
        isOpen={resetDialog.isOpen}
        title="Clear local data?"
        description="This removes saved quotations, rules, categories, shipping methods, and preferences from local fallback storage and requests deletion from the remote storage API."
        confirmLabel="Clear saved data"
        onCancel={resetDialog.close}
        onConfirm={handleClearStorage}
      />
    </div>
  );
}
