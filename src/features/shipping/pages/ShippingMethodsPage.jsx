import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useToastStore } from "../../../stores/toastStore";
import { QUOTATION_STATUSES } from "../../quotations/constants/quotationConstants";
import { useQuotationStore } from "../../quotations/store/quotationStore";
import { ShippingMethodForm } from "../components/ShippingMethodForm";
import { ShippingMethodTable } from "../components/ShippingMethodTable";
import { useShippingMethodStore } from "../store/shippingMethodStore";

export function ShippingMethodsPage() {
  const methods = useShippingMethodStore((state) => state.shippingMethods);
  const addShippingMethod = useShippingMethodStore((state) => state.addShippingMethod);
  const updateShippingMethod = useShippingMethodStore((state) => state.updateShippingMethod);
  const setShippingMethodActive = useShippingMethodStore((state) => state.setShippingMethodActive);
  const quotations = useQuotationStore((state) => state.quotations);
  const addToast = useToastStore((state) => state.addToast);
  const modal = useDisclosure();
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodToToggle, setMethodToToggle] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMethods = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return methods.filter(
      (method) => !normalizedSearch || `${method.code} ${method.name}`.toLowerCase().includes(normalizedSearch),
    );
  }, [methods, search]);

  const methodUsedByDraft = methodToToggle
    ? quotations.some(
        (quotation) =>
          quotation.shippingMethodId === methodToToggle.id &&
          quotation.status === QUOTATION_STATUSES.DRAFT,
      )
    : false;

  function openCreateModal() {
    setEditingMethod(null);
    modal.open();
  }

  function openEditModal(method) {
    setEditingMethod(method);
    modal.open();
  }

  function handleSave(values) {
    const normalizedCode = values.code.trim().toUpperCase().replace(/\s+/g, "_");
    const duplicateCode = methods.some(
      (method) => method.code === normalizedCode && method.id !== editingMethod?.id,
    );

    if (duplicateCode) {
      addToast({
        type: "error",
        title: "Shipping code already exists",
        message: "Use a unique code so quotations can reference the correct method.",
      });
      return;
    }

    if (editingMethod) {
      updateShippingMethod(editingMethod.id, values);
      addToast({ type: "success", title: "Shipping method updated" });
    } else {
      addShippingMethod(values);
      addToast({ type: "success", title: "Shipping method added" });
    }
    modal.close();
  }

  function handleToggleActive() {
    setShippingMethodActive(methodToToggle.id, !methodToToggle.active);
    addToast({
      type: "success",
      title: methodToToggle.active ? "Shipping method disabled" : "Shipping method enabled",
    });
    setMethodToToggle(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipping Methods"
        description="Manage available shipping rates used by quotation forms and price calculations."
        actions={<Button icon={Plus} onClick={openCreateModal}>Add method</Button>}
      />
      <Card>
        <CardBody>
          <Input
            id="shipping-search"
            label="Search shipping methods"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </CardBody>
      </Card>
      {filteredMethods.length ? (
        <ShippingMethodTable
          methods={filteredMethods}
          onEdit={openEditModal}
          onToggleActive={setMethodToToggle}
        />
      ) : (
        <EmptyState title="No shipping methods found" description="Adjust filters or add a method." />
      )}
      <Modal isOpen={modal.isOpen} title={editingMethod ? "Edit Shipping Method" : "Add Shipping Method"} onClose={modal.close}>
        <ShippingMethodForm
          initialValues={editingMethod}
          onSubmit={handleSave}
          onCancel={modal.close}
        />
      </Modal>
      <ConfirmDialog
        isOpen={Boolean(methodToToggle)}
        title={`${methodToToggle?.active ? "Disable" : "Enable"} shipping method?`}
        description={
          methodUsedByDraft
            ? "This method is used by at least one draft quotation. Review drafts before disabling it."
            : "This changes whether the method is available on new quotation forms."
        }
        confirmLabel={methodToToggle?.active ? "Disable" : "Enable"}
        variant={methodToToggle?.active ? "danger" : "primary"}
        onCancel={() => setMethodToToggle(null)}
        onConfirm={handleToggleActive}
      />
    </div>
  );
}
