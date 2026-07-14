import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card, CardBody } from "../../../components/ui/Card";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Select } from "../../../components/ui/Select";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useToastStore } from "../../../stores/toastStore";
import {
  BUSINESS_SECTION_LABELS,
  BUSINESS_SECTIONS,
} from "../../quotations/constants/quotationConstants";
import { CategoryForm } from "../components/CategoryForm";
import { CategoryTable } from "../components/CategoryTable";
import { useCategoryStore } from "../store/categoryStore";

export function CategoriesPage() {
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const setCategoryActive = useCategoryStore((state) => state.setCategoryActive);
  const addToast = useToastStore((state) => state.addToast);
  const modal = useDisclosure();
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToToggle, setCategoryToToggle] = useState(null);
  const [search, setSearch] = useState("");
  const [businessSection, setBusinessSection] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesSearch =
        !normalizedSearch ||
        `${category.code} ${category.name}`.toLowerCase().includes(normalizedSearch);
      const matchesSection = !businessSection || category.businessSection === businessSection;
      return matchesSearch && matchesSection;
    });
  }, [businessSection, categories, search]);

  function openCreateModal() {
    setEditingCategory(null);
    modal.open();
  }

  function openEditModal(category) {
    setEditingCategory(category);
    modal.open();
  }

  function handleSave(values) {
    const normalizedCode = values.code.trim().toUpperCase().replace(/\s+/g, "_");
    const duplicateCode = categories.some(
      (category) => category.code === normalizedCode && category.id !== editingCategory?.id,
    );

    if (duplicateCode) {
      addToast({
        type: "error",
        title: "Category code already exists",
        message: "Use a unique code so pricing rules can resolve categories reliably.",
      });
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, values);
      addToast({ type: "success", title: "Category updated" });
    } else {
      addCategory(values);
      addToast({ type: "success", title: "Category added" });
    }
    modal.close();
  }

  function handleToggleActive() {
    setCategoryActive(categoryToToggle.id, !categoryToToggle.active);
    addToast({
      type: "success",
      title: categoryToToggle.active ? "Category disabled" : "Category enabled",
    });
    setCategoryToToggle(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        description="Manage category availability and the category-level rules used by quotation pricing."
        actions={<Button icon={Plus} onClick={openCreateModal}>Add category</Button>}
      />
      <Card>
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="category-search"
              label="Search categories"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              id="category-section-filter"
              label="Business section"
              value={businessSection}
              onChange={(event) => setBusinessSection(event.target.value)}
              placeholder="All sections"
              options={Object.values(BUSINESS_SECTIONS).map((value) => ({
                value,
                label: BUSINESS_SECTION_LABELS[value],
              }))}
            />
          </div>
        </CardBody>
      </Card>
      {filteredCategories.length ? (
        <CategoryTable
          categories={filteredCategories}
          onEdit={openEditModal}
          onToggleActive={setCategoryToToggle}
        />
      ) : (
        <EmptyState title="No categories found" description="Adjust filters or add a new category." />
      )}
      <Modal isOpen={modal.isOpen} title={editingCategory ? "Edit Category" : "Add Category"} onClose={modal.close}>
        <CategoryForm
          initialValues={editingCategory}
          onSubmit={handleSave}
          onCancel={modal.close}
        />
      </Modal>
      <ConfirmDialog
        isOpen={Boolean(categoryToToggle)}
        title={`${categoryToToggle?.active ? "Disable" : "Enable"} category?`}
        description="This changes whether the category is available on new quotation forms."
        confirmLabel={categoryToToggle?.active ? "Disable" : "Enable"}
        variant={categoryToToggle?.active ? "danger" : "primary"}
        onCancel={() => setCategoryToToggle(null)}
        onConfirm={handleToggleActive}
      />
    </div>
  );
}
