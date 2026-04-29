"use client";

import { useEffect, useState } from "react";
import { emailsApi } from "@/lib/api";
import type { EmailLog, EmailTemplate } from "@/lib/types";

type Tab = "logs" | "templates";

export default function EmailsPage() {
  const [tab, setTab] = useState<Tab>("logs");

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Emails</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Send logs and email templates
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        {(["logs", "templates"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--color-accent)' : 'transparent'}`,
              marginBottom: -1,
              color: tab === t ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: 'none',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'color 0.15s',
            }}
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
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No emails sent yet</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{log.lead?.companyName}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{log.lead?.email}</td>
                  <td style={{ color: 'var(--color-text-secondary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.subject}</td>
                  <td>
                    <span className={log.status === "sent" ? "badge-sent" : "badge-failed"}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Template list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Templates</h2>
          <button onClick={startCreate} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
            + New
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            No templates yet
          </div>
        ) : (
          templates.map((t) => (
            <div key={t.id} className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>{t.name}</span>
                    {t.isActive && <span className="badge-replied">active</span>}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  {!t.isActive && (
                    <button onClick={() => setActive(t.id)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#059669' }}>
                      Set active
                    </button>
                  )}
                  <button onClick={() => startEdit(t)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#dc2626' }}>
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
          <h2 style={{ marginBottom: '1rem' }}>{creating ? "New template" : "Edit template"}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                className="input"
                style={{ fontFamily: 'monospace', fontSize: '0.75rem', resize: 'none' }}
                rows={12}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder={"Hi,\n\nI came across {{companyName}}...\n\nBest,\n[Your name]"}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                Available placeholders: {"{{companyName}}"} {"{{email}}"} {"{{website}}"} {"{{phone}}"}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              <button onClick={save} disabled={saving} className="btn btn-primary">
                {saving ? "Saving..." : "Save template"}
              </button>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Select a template to edit or create a new one
        </div>
      )}
    </div>
  );
}