"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Globe,
  Trash2,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { scrapeProfilesApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { StringDecoder } from "string_decoder";

type ScrapeProfile = {
  id: number;
  name: string;
  url: string;
  selector: string;
  fields: string[];
  status: "idle" | "running" | "done" | "error";
  lastRun: string | null;
  resultsCount: number;
  schedule: string | null;
};

export default function ScrapeProfilesPage() {
  const [profiles, setProfiles] = useState<ScrapeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", searchQuery: "" });
  const [saving, setSaving] = useState(false);
  const [runningId, setRunningId] = useState<number | null>(null);
  const [urlId, setUrlId] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const res = await scrapeProfilesApi.getAll();
      setProfiles(res.data);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setSaving(true);
      await scrapeProfilesApi.create({ ...form, userId: user?.id });
      setShowModal(false);
      setForm({ name: "", searchQuery: "" });
      fetchProfiles();
    } catch {
      toast.error("Failed to create Target Audience.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRun(id: number) {
    try {
      setRunningId(id);
      await scrapeProfilesApi.run(id);
      fetchProfiles();
    } catch {
      toast.error("Failed to run scrape.");
    } finally {
      setRunningId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this Target Audience?")) return;
    try {
      await scrapeProfilesApi.delete(id);
      fetchProfiles();
    } catch {
      toast.error("Failed to delete.");
    }
  }

  const statusConfig = {
    idle: {
      icon: Clock,
      color: "text-gray-400",
      bg: "bg-gray-50",
      label: "Idle",
    },
    running: {
      icon: Play,
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Running",
    },
    done: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      label: "Done",
    },
    error: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      label: "Error",
    },
  };

  useEffect(() => {
    if (!window.location.hash || profiles.length === 0) return;

    const elementId = window.location.hash.substring(1);
    setUrlId(elementId);

    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const timeout = setTimeout(() => {
      setUrlId("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [profiles]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Target Audience</h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure web scraping sources for your leads.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} /> Add Target Audience
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Globe size={20} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">
            No Target Audiences yet
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Define a web source to extract leads automatically.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> Add Target Audience
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => {
            const cfg = statusConfig[profile.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={profile.id}
                id={`${profile.name.replace(" ", "-")}`}
                className={` rounded-xl p-5 shadow-sm ${profile.name.replace(" ", "-") === urlId?.replace(" ", "-") ? "bg-primary/5 border border-primary/20" : "bg-white border border-gray-200"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Globe size={18} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {profile.name}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} font-medium`}
                      >
                        <StatusIcon
                          size={11}
                          className={
                            profile.status === "running" ? "animate-pulse" : ""
                          }
                        />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {profile.url}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{profile.resultsCount} results</span>
                      {profile.lastRun && (
                        <span>
                          Last run:{" "}
                          {new Date(profile.lastRun).toLocaleDateString()}
                        </span>
                      )}
                      {profile.schedule && (
                        <span>Schedule: {profile.schedule}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Add Target Audience
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Profile Name
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="Tech Leads"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Search Query
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="tech leads in Amsterdam"
                  value={form.searchQuery}
                  onChange={(e) =>
                    setForm({ ...form, searchQuery: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
