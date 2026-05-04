"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Copy, Edit2, Search } from "lucide-react";
import { templatesApi } from "@/lib/api";

type Template = {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  usageCount: number;
  createdAt: string;
};

const CATEGORIES = ["All", "Cold Outreach", "Follow-up", "Re-engagement", "Partnership", "Other"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", body: "", category: "Cold Outreach" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTemplates(); }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await templatesApi.getAll();
      setTemplates(res.data);
    } catch { setTemplates([]); } finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const vars = [...form.body.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]);
      if (editingTemplate) {
        await templatesApi.update(editingTemplate.id, { ...form, variables: vars, userId: 4, usageCount: editingTemplate.usageCount, createdAt: editingTemplate.createdAt });
      } else {
        await templatesApi.create({ ...form, variables: vars, userId: 4 });
      }
      setShowModal(false);
      setEditingTemplate(null);
      setForm({ name: "", subject: "", body: "", category: "Cold Outreach" });
      fetchTemplates();
    } catch { alert("Failed to save template."); } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this template?")) return;
    try { await templatesApi.delete(id); fetchTemplates(); } catch { alert("Failed to delete."); }
  }

  async function handleDuplicate(id: number) {
    try { await templatesApi.duplicate(id); fetchTemplates(); } catch { alert("Failed to duplicate."); }
  }

  function openEdit(t: Template) {
    setEditingTemplate(t);
    setForm({ name: t.name, subject: t.subject, body: t.body, category: t.category });
    setShowModal(true);
  }

  const filtered = templates.filter(t =>
    (category === "All" || t.category === category) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-500 text-sm mt-1">Reusable email templates for your copilots.</p>
        </div>
        <button onClick={() => { setEditingTemplate(null); setForm({ name: "", subject: "", body: "", category: "Cold Outreach" }); setShowModal(true); }} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <Plus size={15} /> New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white" placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText size={20} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No templates found</h2>
          <p className="text-sm text-gray-500 mb-5">Create your first reusable email template.</p>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <Plus size={15} /> New Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{t.subject}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">{t.category}</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-3 mb-3 leading-relaxed">{t.body}</p>
              {t.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {t.variables.map(v => (
                    <span key={v} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono">{`{{${v}}}`}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">{t.usageCount} uses</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDuplicate(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                    <Copy size={13} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{editingTemplate ? "Edit Template" : "New Template"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Template Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Cold outreach v1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subject Line</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Quick question about {{company}}" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Body <span className="text-gray-400 font-normal ml-1">Use {"{{variable}}"} for dynamic fields</span></label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" rows={8} placeholder="Hi {{firstName}},&#10;&#10;I noticed that {{company}} ..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingTemplate(null); }} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : editingTemplate ? "Save Changes" : "Create Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
