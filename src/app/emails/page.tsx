"use client";

import { useEffect, useState } from "react";
import { emailsApi } from "@/lib/api";
import type { EmailLog, EmailTemplate } from "@/lib/types";

type Tab = "logs" | "templates";

export default function EmailsPage() {
  const [tab, setTab] = useState<Tab>("logs");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1>Emails</h1>
        <p className="text-sm text-zinc-500 mt-1">Send logs and email templates</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {(["logs", "templates"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px capitalize ${tab === t
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "logs" ? <LogsTab /> : <TemplatesTab />}
    </div>
  );
}

// ─── Logs tab ─────────────────────────────────────────────────────────────────

function LogsTab() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    emailsApi.logs({ limit: 50 })
      .then((r) => setLogs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card p-0 overflow-hidden">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Sent at</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-zinc-600">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-zinc-600">No emails sent yet</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="font-medium text-zinc-100">{log.lead?.companyName}</td>
                  <td className="text-zinc-400 font-mono text-xs">{log.lead?.email}</td>
                  <td className="text-zinc-400 max-w-[240px] truncate">{log.subject}</td>
                  <td>
                    <span className={log.status === "sent" ? "badge-sent" : "badge-failed"}>
                      {log.status}
                    </span>
                  </td>
                  <td className="text-zinc-500 text-xs">
                    {new Date(log.sentAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Templates tab ────────────────────────────────────────────────────────────

function TemplatesTab() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const emptyForm = { name: "", subject: "", body: "" };
  const [form, setForm] = useState(emptyForm);

  async function load() {
    emailsApi.templates().then(setTemplates).catch(console.error);
  }

  useEffect(() => { load(); }, []);

  function startEdit(t: EmailTemplate) {
    setEditing(t);
    setCreating(false);
    setForm({ name: t.name, subject: t.subject, body: t.body });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    setSaving(true);
    try {
      if (creating) {
        await emailsApi.createTemplate(form);
      } else if (editing) {
        await emailsApi.updateTemplate(editing.id, form);
      }
      await load();
      setEditing(null);
      setCreating(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function setActive(id: number) {
    await emailsApi.updateTemplate(id, { isActive: true });
    await load();
  }

  async function deleteTemplate(id: number) {
    if (!confirm("Delete this template?")) return;
    await emailsApi.deleteTemplate(id);
    await load();
  }

  const showForm = editing || creating;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Template list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2>Templates</h2>
          <button onClick={startCreate} className="btn-primary text-xs py-1.5 px-3">
            + New
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="card text-sm text-zinc-500 text-center py-8">No templates yet</div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="card cursor-pointer hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-zinc-100">{t.name}</span>
                    {t.isActive && <span className="badge-replied">active</span>}
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{t.subject}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!t.isActive && (
                    <button onClick={() => setActive(t.id)} className="btn-ghost text-xs py-1 px-2 text-emerald-400">
                      Set active
                    </button>
                  )}
                  <button onClick={() => startEdit(t)} className="btn-ghost text-xs py-1 px-2">
                    Edit
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="btn-ghost text-xs py-1 px-2 text-red-500">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor */}
      {showForm ? (
        <div className="card">
          <h2 className="mb-4">{creating ? "New template" : "Edit template"}</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Cold outreach v1"
              />
            </div>
            <div>
              <label className="label">Subject</label>
              <input
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Use {{companyName}} for personalisation"
              />
            </div>
            <div>
              <label className="label">Body</label>
              <textarea
                className="input font-mono text-xs resize-none"
                rows={12}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder={"Hi,\n\nI came across {{companyName}}...\n\nBest,\n[Your name]"}
              />
              <p className="text-xs text-zinc-600 mt-1">
                Available placeholders: {"{{companyName}}"} {"{{email}}"} {"{{website}}"} {"{{phone}}"}
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save template"}
              </button>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-center text-zinc-600 text-sm">
          Select a template to edit or create a new one
        </div>
      )}
    </div>
  );
}