"use client";

import { useState, useEffect } from "react";
import {
  Plus, Send, Play, Pause, Archive, MoreVertical, Mail, MousePointerClick, MessageSquare,
  Search, ChevronDown, Trash2, Copy, Pencil
} from "lucide-react";
import Link from "next/link";
import { copilotsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Copilot = {
  id: number;
  name: string;
  description: string;
  status: "draft" | "active" | "paused" | "archived" | "running";
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  emailProfileName: string | null;
  templateName: string | null;
  scrapeProfileId: number | null; // added
  createdAt: string;
  updatedAt: string;
};

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  paused: { label: "Paused", color: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-400" },
  draft: { label: "Draft", color: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400" },
  archived: { label: "Archived", color: "text-gray-400", bg: "bg-gray-50", dot: "bg-gray-300" },
  running: { label: "Running", color: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-500" },
  completed: { label: "Completed", color: "text-gray-700", bg: "bg-gray-100", dot: "bg-gray-500" },
} as const;

// Normalize status to handle case inconsistencies
function getStatusConfig(status: string | undefined | null) {
  if (!status) return STATUS_CONFIG.draft;
  const normalizedStatus = status.toLowerCase().trim() as keyof typeof STATUS_CONFIG;
  return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.draft;
}

const FILTERS = ["All", "Active", "Paused", "Running", "Draft", "Archived"] as const;

function openRate(sent: number, opened: number) {
  if (!sent) return "—";
  return `${Math.round((opened / sent) * 100)}%`;
}
function replyRate(sent: number, replied: number) {
  if (!sent) return "—";
  return `${Math.round((replied / sent) * 100)}%`;
}

function CopilotMenu({ copilot, onRefresh }: { copilot: Copilot; onRefresh: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [runningScrape, setRunningScrape] = useState(false);

  async function toggleStatus(next: "active" | "paused") {
    try {
      await copilotsApi.updateStatus(copilot.id, next);
      onRefresh();
    } catch { toast.error("Failed to update status."); }
    setOpen(false);
  }



  async function handleRunScrape() {
    if (!copilot.scrapeProfileId) return;
    try {
      setRunningScrape(true);
      await copilotsApi.run(copilot.id);
      onRefresh();
    } catch { toast.error("Failed to run scrape."); } finally { setRunningScrape(false); }
    setOpen(false);
  }

  async function handleArchive() {
    if (!confirm("Archive this copilot?")) return;
    try {
      await copilotsApi.updateStatus(copilot.id, "archived");
      onRefresh();
    } catch { toast.error("Failed to archive."); }
    setOpen(false);
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this copilot? This cannot be undone.")) return;
    try {
      await copilotsApi.delete(copilot.id);
      onRefresh();
    } catch { toast.error("Failed to delete."); }
    setOpen(false);
  }

  function handleDuplicate() {
    if (!confirm(`Duplicate "${copilot.name}"? This will create a new draft copy.`)) return;
    router.push(`/dashboard/copilots/new?duplicate=${copilot.id}`);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 py-1 overflow-hidden">
            <Link
              href={`/dashboard/copilots/new?edit=${copilot.id}`}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil size={13} /> Edit
            </Link>
            <button
              onClick={handleDuplicate}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy size={13} /> Duplicate
            </button>
            {copilot.scrapeProfileId && (
              <button
                onClick={handleRunScrape}
                disabled={runningScrape}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Play size={13} className={runningScrape ? "animate-pulse" : ""} />
                {runningScrape ? "Running..." : "Run Scrape"}
              </button>
            )}
            {copilot.status === "active" ? (
              <button onClick={() => toggleStatus("paused")} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Pause size={13} /> Pause
              </button>
            ) : copilot.status === "paused" ? (
              <button onClick={() => toggleStatus("active")} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Play size={13} /> Resume
              </button>
            ) : null}
            {copilot.status !== "archived" && (
              <button onClick={handleArchive} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Archive size={13} /> Archive
              </button>
            )}
            <div className="border-t border-gray-100 my-1" />
            <button onClick={handleDelete} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function CopilotsPage() {
  const router = useRouter();
  const [copilots, setCopilots] = useState<Copilot[]>([]);
  const [isActivating, setIsActivating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"updatedAt" | "emailsSent" | "name">("updatedAt");

  useEffect(() => { fetchCopilots(); }, []);

  async function fetchCopilots() {
    try {
      setLoading(true);
      const res = await copilotsApi.getAll();
      setCopilots(res.data);
      if (res.data.length === 0) {
        router.push("/dashboard/copilots/new");
      }
    } catch { setCopilots([]); } finally { setLoading(false); }
  }

  const filtered = copilots
    .filter(c =>
      (filter === "All" || c.status.toLowerCase() === filter.toLowerCase()) &&
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "emailsSent") return b.emailsSent - a.emailsSent;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  async function handleActivateCopilot(id: number) {
    setIsActivating(true);
    try {
      await copilotsApi.updateStatus(id, "active");
      fetchCopilots();
    } catch (error) {
      console.error("Failed to activate copilot:", error);
    } finally {
      setIsActivating(false);
    }
  }


  const totalSent = copilots.reduce((s, c) => s + c.emailsSent, 0);
  const totalOpened = copilots.reduce((s, c) => s + c.emailsOpened, 0);
  const totalReplied = copilots.reduce((s, c) => s + c.emailsReplied, 0);
  const activeCount = copilots.filter(c => c.status === "active").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Copilots</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your automated outreach campaigns.</p>
        </div>
        <Link
          href="/dashboard/copilots/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} /> Create New Copilot
        </Link>
      </div>

      {/* Stats bar */}
      {copilots.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Copilots", value: activeCount, icon: Send, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Emails Scraped", value: openRate(totalSent, totalOpened), icon: MousePointerClick, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Emails Sent", value: totalSent.toLocaleString(), icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg}`}>
                    <Icon size={13} className={stat.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      {copilots.length > 0 && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
              placeholder="Search copilots..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 pr-7 cursor-pointer hover:bg-gray-50 transition-colors"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="updatedAt">Sort: Recent</option>
              <option value="emailsSent">Sort: Most Sent</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading...</div>
      ) : copilots.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Send size={22} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No copilots yet</h2>
          <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
            Build your first copilot to start sending personalized emails at scale.
          </p>
          <Link
            href="/dashboard/copilots/new"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> Create New Copilot
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
          <p className="text-sm text-gray-500">No copilots match your filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(copilot => {
            const cfg = getStatusConfig(copilot.status);
            const or = openRate(copilot.emailsSent, copilot.emailsOpened);
            const rr = replyRate(copilot.emailsSent, copilot.emailsReplied);
            return (
              <div key={copilot.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="p-5 flex items-center gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${copilot.status === "active" ? "animate-pulse" : ""}`} />
                        {cfg.label}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{copilot.name}</h3>
                    </div>
                    {copilot.description && (
                      <p className="text-xs text-gray-400 truncate mb-2">{copilot.description}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      {copilot.emailProfileName && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail size={11} /> {copilot.emailProfileName}
                        </span>
                      )}
                      {copilot.templateName && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Send size={11} /> {copilot.templateName}
                        </span>
                      )}
                      <span className="text-xs text-gray-300">
                        Updated {new Date(copilot.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                    {/* activate button with "activate copilot" text */}
                    {copilot.status === "active" ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-600 font-medium">Active</span>
                      </div>
                    ) : copilot.status === "running" ? (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs text-blue-600 font-medium">Running</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleActivateCopilot(copilot.id)}
                        disabled={isActivating}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
                      >
                        <Play size={13} className={isActivating ? "animate-pulse" : ""} />
                        {isActivating ? "Activating..." : "Activate Copilot"}
                      </button>
                    )}
                    {[
                      { label: "Sent", value: copilot.emailsSent.toLocaleString() },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-base font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <CopilotMenu copilot={copilot} onRefresh={fetchCopilots} />
                  </div>
                </div>

                {/* Mini progress bar for active */}
                {copilot.status === "active" && copilot.emailsSent > 0 && (
                  <div className="px-5 pb-4">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round((copilot.emailsOpened / copilot.emailsSent) * 100))}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {copilot.emailsOpened.toLocaleString()} opens out of {copilot.emailsSent.toLocaleString()} sent
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}