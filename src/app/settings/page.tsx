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
      // save first so the test uses the latest credentials
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
      <div className="p-8 text-zinc-600 text-sm">Loading settings...</div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1>Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configure SMTP, scraping, and sending schedule
        </p>
      </div>

      <div className="space-y-6">
        {/* SMTP */}
        <section className="card">
          <h2 className="mb-5">SMTP configuration</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex items-center gap-3 pt-1">
              <button onClick={testSmtp} disabled={testing} className="btn-secondary">
                {testing ? "Testing..." : "Test connection"}
              </button>
              {smtpMsg && (
                <span className={`text-sm ${smtpMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                  {smtpMsg.text}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Sending */}
        <section className="card">
          <h2 className="mb-5">Sending limits</h2>
          <div>
            <label className="label">Daily email limit</label>
            <input
              className="input max-w-[160px]"
              type="number"
              min={1}
              max={500}
              value={settings.daily_send_limit || "10"}
              onChange={(e) => set("daily_send_limit", e.target.value)}
            />
            <p className="text-xs text-zinc-600 mt-1.5">
              Maximum emails sent per day across all accounts
            </p>
          </div>
        </section>

        {/* Schedule */}
        <section className="card">
          <h2 className="mb-5">Schedule</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Send hour (24h)</label>
              <input
                className="input max-w-[160px]"
                type="number"
                min={0}
                max={23}
                value={settings.send_hour || "9"}
                onChange={(e) => set("send_hour", e.target.value)}
              />
              <p className="text-xs text-zinc-600 mt-1.5">
                Hour to run the daily email send job (e.g. 9 = 09:00)
              </p>
            </div>
            <div>
              <label className="label">Scrape hours (comma-separated, 24h)</label>
              <input
                className="input max-w-[240px]"
                value={settings.scrape_hours || "8,14"}
                onChange={(e) => set("scrape_hours", e.target.value)}
                placeholder="8,14"
              />
              <p className="text-xs text-zinc-600 mt-1.5">
                Hours to run automatic scrape jobs (e.g. 8,14 = 08:00 and 14:00). Changing this restarts the scheduler immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Scraper */}
        <section className="card">
          <h2 className="mb-5">Scraper</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Default search query</label>
              <input
                className="input"
                value={settings.scrape_query || ""}
                onChange={(e) => set("scrape_query", e.target.value)}
                placeholder='e.g. "dentists in Amsterdam"'
              />
              <p className="text-xs text-zinc-600 mt-1.5">
                Used by automatic scrape jobs and as default in the Scraper page
              </p>
            </div>
            <div>
              <label className="label">Results per run</label>
              <input
                className="input max-w-[160px]"
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
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary px-6">
            {saving ? "Saving..." : "Save settings"}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved!</span>}
        </div>
      </div>
    </div>
  );
}