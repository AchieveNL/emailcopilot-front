"use client";

import { useEffect, useState, useCallback } from "react";
import { scraperApi, settingsApi } from "@/lib/api";
import type { ScrapeJob } from "@/lib/types";

function JobBadge({ status }: { status: ScrapeJob["status"] }) {
  const map = {
    running: "badge-running",
    done: "badge-done",
    failed: "badge-failed",
  };
  return <span className={map[status]}>{status}</span>;
}

export default function ScraperPage() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  const loadJobs = useCallback(async () => {
    try {
      const r = await scraperApi.jobs({ limit: 20 });
      setJobs(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    settingsApi.get().then((s) => setQuery(s.scrape_query || "")).catch(console.error);
  }, [loadJobs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (jobs.some((j) => j.status === "running")) loadJobs();
    }, 5000);
    return () => clearInterval(interval);
  }, [jobs, loadJobs]);

  async function trigger() {
    setTriggering(true);
    setMsg("");
    try {
      await scraperApi.trigger(query || undefined);
      setMsg("Scrape job started — page will update automatically.");
      await loadJobs();
    } catch {
      setMsg("Failed to trigger scrape job.");
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 896 }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Scraper</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Find companies on Google Maps and extract their emails
        </p>
      </div>

      {/* Trigger card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Run a scrape job</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            className="input"
            style={{ flex: 1 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "dentists in Amsterdam"'
            onKeyDown={(e) => e.key === "Enter" && trigger()}
          />
          <button
            onClick={trigger}
            disabled={triggering}
            className="btn btn-primary"
            style={{ flexShrink: 0 }}
          >
            {triggering ? "Starting..." : "Run scrape"}
          </button>
        </div>
        {msg && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: msg.includes("Failed") ? '#dc2626' : '#059669' }}>
            {msg}
          </p>
        )}
        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Leave query blank to use the default from Settings. The job runs in the
          background — this page polls automatically while a job is running.
        </p>
      </div>

      {/* Job history */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
          <h2>Job history</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Query</th>
                <th>Status</th>
                <th>Leads found</th>
                <th>Started</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>No scrape jobs yet</td></tr>
              ) : (
                jobs.map((job) => {
                  const duration =
                    job.finishedAt
                      ? Math.round(
                        (new Date(job.finishedAt).getTime() -
                          new Date(job.ranAt).getTime()) /
                        1000
                      )
                      : null;
                  return (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 500, color: 'var(--color-text-primary)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.query}
                      </td>
                      <td><JobBadge status={job.status} /></td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>
                        {job.status === "running" ? (
                          <span style={{ color: '#d97706' }}>Running...</span>
                        ) : (
                          job.leadsFound
                        )}
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        {new Date(job.ranAt).toLocaleString()}
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        {duration !== null ? `${duration}s` : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}