"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import TemplateTable from "@/components/ui/templates/TemplateTable";
import TemplateModal from "@/components/ui/templates/TemplateModal";
import Pagination from "@/components/ui/templates/Pagination";
import { templatesApi } from "@/lib/api";
import { toast } from "sonner";
import type {
  Template,
  TemplateStep,
  TemplateForm,
} from "@/lib/types/templates";

const PER_PAGE = 10;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState<TemplateForm>({
    name: "",
    subject: "",
    body: "",
    category: "Cold Outreach",
  });
  const [saving, setSaving] = useState(false);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await templatesApi.getAll();
      setTemplates(res.data);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "true") {
      setShowModal(true);
    }
  }, []);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * PER_PAGE,
    safeCurrentPage * PER_PAGE,
  );

  async function handleSave(steps: TemplateStep[]) {
    try {
      setSaving(true);
      const vars = [...form.body.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
      if (editingTemplate) {
        await templatesApi.update(editingTemplate.id, {
          ...form,
          variables: vars,
          steps,
          usageCount: editingTemplate.usageCount,
          createdAt: editingTemplate.createdAt,
        });
      } else {
        await templatesApi.create({ ...form, variables: vars, steps });
      }
      setShowModal(false);
      setEditingTemplate(null);
      setForm({ name: "", subject: "", body: "", category: "Cold Outreach" });
      fetchTemplates();
    } catch {
      toast.error("Failed to save template.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    // needs sonner to be implemented
    if (!confirm("Delete this template?")) return;
    try {
      await templatesApi.delete(id);
      fetchTemplates();
    } catch {
      toast.error("Failed to delete.");
    }
  }

  async function handleDuplicate(id: number) {
    try {
      await templatesApi.duplicate(id);
      fetchTemplates();
    } catch {
      toast.error("Failed to duplicate.");
    }
  }

  function openEdit(t: Template) {
    setEditingTemplate(t);
    setForm({
      name: t.name,
      subject: t.subject ?? "",
      body: t.body ?? "",
      category: t.category ?? "Cold Outreach",
    });
    setShowModal(true);
  }

  function openCreate() {
    setEditingTemplate(null);
    setForm({ name: "", subject: "", body: "", category: "Cold Outreach" });
    setShowModal(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return (
    <div className="p-4 sm:p-5 w-full max-w-6xl mx-auto flex flex-col min-h-[calc(100vh-2.5rem)]">
      <DashboardHeader
        title="Email templates"
        description="Create and manage reusable email templates for your campaigns."
        actionLabel="Create New Email Template"
        onAction={openCreate}
      />

      <div className="flex flex-col flex-1">
        <TemplateTable
          templates={paginated}
          filteredCount={filtered.length}
          search={search}
          onSearchChange={handleSearchChange}
          onEdit={(t) => openEdit(t as Template)}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onCreateNew={openCreate}
          loading={loading}
        />

        {filtered.length > 0 && (
          <div className="mt-auto pt-3">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {showModal && (
        <TemplateModal
          key={editingTemplate?.id ?? "new"}
          editingTemplate={editingTemplate}
          initialSteps={editingTemplate?.steps}
          form={form}
          saving={saving}
          onFormChange={setForm}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}
