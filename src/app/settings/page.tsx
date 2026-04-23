"use client";

import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";
import type { Settings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [smtpMsg, setSmtpMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // smtp_pass is not returned by the API — tracked separately
  const [smtpPass, setSmtpPass] = useState("");

  useEffect(() => {
    settingsApi.get()
      .then((s) => { setSettings(s); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const payload: Record<string, string> = { ...settings as Record<string, string> };
      if (smtpPass) payload.smtp_pass = smtpPass;
      await settingsApi.update(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function testSmtp() {
    setTesting(true);
    setSmtpMsg(null);
    try {
      const payload: Record<string, string> = { ...settings as Record<string, string> };
      if (smtpPass) payload.smtp_pass = smtpPass;
      await settingsApi.update(payload);

      const result = await settingsApi.testSmtp();
      setSmtpMsg({
        ok: result.success,
        text: result.success ? "Connection successful!" : result.error || "Connection failed",
      });
    } catch {
      setSmtpMsg({ ok: false, text: "Connection failed" });
    } finally {
      setTesting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem 2.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 672 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Configure SMTP, scraping, and sending schedule
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* SMTP */}
        <section className="card">
          <h2 style={{ marginBottom: '1.25rem' }}>SMTP configuration</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Host</label>
                <input
                  className="input"
                  value={settings.smtp_host || ""}
                  onChange={(e) => set("smtp_host", e.target.value)}
                  placeholder="mail.yourdomain.com"
                />
              </div>
              <div>
                <label className="label">Port</label>
                <input
                  className="input"
                  value={settings.smtp_port || "587"}
                  onChange={(e) => set("smtp_port", e.target.value)}
                  placeholder="587"
                />
              </div>
            </div>
            <div>
              <label className="label">Username (email address)</label>
              <input
                className="input"
                value={settings.smtp_user || ""}
                onChange={(e) => set("smtp_user", e.target.value)}
                placeholder="hello@yourdomain.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="Leave blank to keep existing password"
              />
            </div>
            <div>
              <label className="label">From name</label>
              <input
                className="input"
                value={settings.smtp_from_name || ""}
                onChange={(e) => set("smtp_from_name", e.target.value)}
                placeholder="John from Acme"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <button onClick={testSmtp} disabled={testing} className="btn btn-secondary">
                {testing ? "Testing..." : "Test connection"}
              </button>
              {smtpMsg && (
                <span style={{ fontSize: '0.875rem', color: smtpMsg.ok ? '#059669' : '#dc2626' }}>
                  {smtpMsg.text}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Sending */}
        <section className="card">
          <h2 style={{ marginBottom: '1.25rem' }}>Sending limits</h2>
          <div>
            <label className="label">Daily email limit</label>
            <input
              className="input"
              style={{ maxWidth: 160 }}
              type="number"
              min={1}
              max={500}
              value={settings.daily_send_limit || "10"}
              onChange={(e) => set("daily_send_limit", e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
              Maximum emails sent per day across all accounts
            </p>
          </div>
        </section>

        {/* Schedule */}
        <section className="card">
          <h2 style={{ marginBottom: '1.25rem' }}>Schedule</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Send hour (24h)</label>
              <input
                className="input"
                style={{ maxWidth: 160 }}
                type="number"
                min={0}
                max={23}
                value={settings.send_hour || "9"}
                onChange={(e) => set("send_hour", e.target.value)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                Hour to run the daily email send job (e.g. 9 = 09:00)
              </p>
            </div>
            <div>
              <label className="label">Scrape hours (comma-separated, 24h)</label>
              <input
                className="input"
                style={{ maxWidth: 240 }}
                value={settings.scrape_hours || "8,14"}
                onChange={(e) => set("scrape_hours", e.target.value)}
                placeholder="8,14"
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                Hours to run automatic scrape jobs (e.g. 8,14 = 08:00 and 14:00). Changing this restarts the scheduler immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Scraper */}
        <section className="card">
          <h2 style={{ marginBottom: '1.25rem' }}>Scraper</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="label">Default search query</label>
              <input
                className="input"
                value={settings.scrape_query || ""}
                onChange={(e) => set("scrape_query", e.target.value)}
                placeholder='e.g. "dentists in Amsterdam"'
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                Used by automatic scrape jobs and as default in the Scraper page
              </p>
            </div>
            <div>
              <label className="label">Results per run</label>
              <input
                className="input"
                style={{ maxWidth: 160 }}
                type="number"
                min={1}
                max={50}
                value={settings.scrape_results_per_run || "10"}
                onChange={(e) => set("scrape_results_per_run", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={save} disabled={saving} className="btn btn-primary" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
            {saving ? "Saving..." : "Save settings"}
          </button>
          {saved && <span style={{ fontSize: '0.875rem', color: '#059669' }}>Saved!</span>}
        </div>
      </div>
    </div>
  );
}