"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import TemplateTable from "@/components/ui/templates/TemplateTable";
import TemplateModal from "@/components/ui/templates/TemplateModal";
import Pagination from "@/components/ui/templates/Pagination";
import INITIAL_MOCK_TEMPLATES_DATA from "@/data/templates.json";
// import { templatesApi } from "@/lib/api"; // TODO: uncomment when backend is ready
// import { useUser } from "@clerk/nextjs"; // TODO: uncomment when backend is ready
// import { toast } from "sonner"; // TODO: uncomment when backend is ready

// ─── Original Template Type (for backend) ─────────────────────────────────────

export type OriginalTemplate = {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  usageCount: number;
  createdAt: string;
};

// ─── Table Template Type ──────────────────────────────────────────────────────

export type Template = {
  id: number;
  name: string;
  subject: string;
  body: string;
  steps: number;
  lastUpdated: string;
  usedIn: number;
  replyRate: number;
  trend: "up" | "down";
  status: "in_flight" | "draft";
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
// Loaded from src/data/templates.json

const INITIAL_MOCK_TEMPLATES = INITIAL_MOCK_TEMPLATES_DATA as Template[];

const PER_PAGE = 5;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  // ── Backend (TODO: uncomment when backend is ready) ────────────────────────
  // const { user } = useUser();
  // const [loading, setLoading] = useState(true);
  //
  // async function fetchTemplates() {
  //   try {
  //     setLoading(true);
  //     const res = await templatesApi.getAll();
  //     setTemplates(res.data);
  //   } catch {
  //     setTemplates([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  //
  // async function handleSave() {
  //   try {
  //     setSaving(true);
  //     const vars = [...form.body.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  //     if (editingTemplate) {
  //       await templatesApi.update(editingTemplate.id, {
  //         ...form,
  //         variables: vars,
  //         usageCount: editingTemplate.usageCount,
  //         createdAt: editingTemplate.createdAt,
  //       });
  //     } else {
  //       await templatesApi.create({ ...form, variables: vars });
  //     }
  //     setShowModal(false);
  //     setEditingTemplate(null);
  //     setForm({ name: "", subject: "", body: "", category: "Cold Outreach" });
  //     fetchTemplates();
  //   } catch {
  //     toast.error("Failed to save template.");
  //   } finally {
  //     setSaving(false);
  //   }
  // }
  //
  // async function handleDelete(id: number) {
  //   if (!confirm("Delete this template?")) return;
  //   try {
  //     await templatesApi.delete(id);
  //     fetchTemplates();
  //   } catch {
  //     toast.error("Failed to delete.");
  //   }
  // }
  //
  // async function handleDuplicate(id: number) {
  //   try {
  //     await templatesApi.duplicate(id);
  //     fetchTemplates();
  //   } catch {
  //     toast.error("Failed to duplicate.");
  //   }
  // }

  // ── Local state ────────────────────────────────────────────────────────────

  const [templates, setTemplates] = useState<Template[]>(
    INITIAL_MOCK_TEMPLATES,
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    category: "Cold Outreach",
  });
  const [saving, setSaving] = useState(false);

  // ── Filtered + paginated data ──────────────────────────────────────────────

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * PER_PAGE,
    safeCurrentPage * PER_PAGE,
  );

  // ── ?new=true modal trigger ────────────────────────────────────────────────

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "true") {
      setShowModal(true);
    }
  }, []);

  // ── Local helpers ──────────────────────────────────────────────────────────

  function openEdit(t: Template) {
    setEditingTemplate(t);
    setForm({
      name: t.name,
      subject: t.subject,
      body: t.body,
      category: "Cold Outreach",
    });
    setShowModal(true);
  }

  function handleSaveLocal() {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, name: form.name, subject: form.subject, body: form.body }
            : t,
        ),
      );
    } else {
      const newTemplate: Template = {
        id: Date.now(),
        name: form.name,
        subject: form.subject,
        body: form.body,
        steps: 0,
        lastUpdated: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        usedIn: 0,
        replyRate: 0,
        trend: "up",
        status: "draft",
      };
      setTemplates((prev) => [newTemplate, ...prev]);
    }

    setShowModal(false);
    setEditingTemplate(null);
    setForm({ name: "", subject: "", body: "", category: "Cold Outreach" });
  }

  function handleDeleteLocal(id: number) {
    if (!confirm("Delete this template?")) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  function handleDuplicateLocal(id: number) {
    const original = templates.find((t) => t.id === id);
    if (!original) return;
    const duplicate: Template = {
      ...original,
      id: Date.now(),
      name: `${original.name} (Copy)`,
    };
    setTemplates((prev) => [duplicate, ...prev]);
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

  // ── Render ─────────────────────────────────────────────────────────────────

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
          onEdit={openEdit}
          onDelete={handleDeleteLocal}
          onDuplicate={handleDuplicateLocal}
          onCreateNew={openCreate}
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
          editingTemplate={editingTemplate}
          form={form}
          saving={saving}
          onFormChange={setForm}
          onSave={() => {
            setSaving(true);
            setTimeout(() => {
              handleSaveLocal();
              setSaving(false);
            }, 300);
          }}
          onClose={() => {
            setShowModal(false);
            setEditingTemplate(null);
          }}
        />
      )}
    </div>
  );
}
