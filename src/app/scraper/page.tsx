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
    // load default query from settings
    settingsApi.get().then((s) => setQuery(s.scrape_query || "")).catch(console.error);
  }, [loadJobs]);

  // poll every 5s to pick up job status changes while running
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
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1>Scraper</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Find companies on Google Maps and extract their emails
        </p>
      </div>

      {/* Trigger card */}
      <div className="card mb-6">
        <h2 className="mb-4">Run a scrape job</h2>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "dentists in Amsterdam"'
            onKeyDown={(e) => e.key === "Enter" && trigger()}
          />
          <button
            onClick={trigger}
            disabled={triggering}
            className="btn btn-primary shrink-0"
          >
            {triggering ? "Starting..." : "Run scrape"}
          </button>
        </div>
        {msg && (
          <p className={`mt-3 text-sm ${msg.includes("Failed") ? "text-red-400" : "text-emerald-400"}`}>
            {msg}
          </p>
        )}
        <p className="mt-3 text-xs text-zinc-600">
          Leave query blank to use the default from Settings. The job runs in the
          background — this page polls automatically while a job is running.
        </p>
      </div>

      {/* Job history */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
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
                <tr><td colSpan={5} className="text-center py-12 text-zinc-600">Loading...</td></tr>
              ) : jobs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-zinc-600">No scrape jobs yet</td></tr>
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
                      <td className="font-medium text-zinc-100 max-w-[240px] truncate">
                        {job.query}
                      </td>
                      <td><JobBadge status={job.status} /></td>
                      <td className="text-zinc-300">
                        {job.status === "running" ? (
                          <span className="text-amber-400 animate-pulse">Running...</span>
                        ) : (
                          job.leadsFound
                        )}
                      </td>
                      <td className="text-zinc-500 text-xs">
                        {new Date(job.ranAt).toLocaleString()}
                      </td>
                      <td className="text-zinc-500 text-xs">
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