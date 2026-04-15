"use client";

import { Suspense } from "react";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { leadsApi } from "@/lib/api";
import type { Lead, LeadStatus, PaginatedResponse } from "@/lib/types";

const STATUS_TABS: { label: string; value: LeadStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Queued", value: "queued" },
  { label: "Sent", value: "sent" },
  { label: "Replied", value: "replied" },
  { label: "Disqualified", value: "disqualified" },
];

function Badge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    new: "badge-new",
    queued: "badge-queued",
    sent: "badge-sent",
    replied: "badge-replied",
    disqualified: "badge-disqualified",
  };
  return <span className={map[status]}>{status}</span>;
}

function LeadsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusParam = searchParams.get("status") as LeadStatus | null;
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [data, setData] = useState<PaginatedResponse<Lead> | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await leadsApi.list({
        status: statusParam || undefined,
        page: pageParam,
        limit: 20,
      });
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusParam, pageParam]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function setStatus(value: LeadStatus | "all") {
    const params = new URLSearchParams();
    if (value !== "all") params.set("status", value);
    params.set("page", "1");
    router.push(`/leads?${params.toString()}`);
  }

  async function updateStatus(id: number, status: LeadStatus) {
    setUpdatingId(id);
    try {
      await leadsApi.update(id, { status });
      await fetchLeads();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead permanently?")) return;
    try {
      await leadsApi.delete(id);
      await fetchLeads();
    } catch (e) {
      console.error(e);
    }
  }

  const activeTab = statusParam || "all";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1>Leads</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {data ? `${data.meta.total} total leads` : "Loading..."}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.value
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Website</th>
                <th>Status</th>
                <th>Scraped</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-600">
                    Loading...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-600">
                    No leads found
                  </td>
                </tr>
              ) : (
                data?.data.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium text-zinc-100">{lead.companyName}</td>
                    <td className="text-zinc-400 font-mono text-xs">{lead.email}</td>
                    <td>
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-xs truncate max-w-[160px] block"
                        >
                          {lead.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td>
                      <Badge status={lead.status} />
                    </td>
                    <td className="text-zinc-500 text-xs">
                      {new Date(lead.scrapedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {lead.status === "sent" && (
                          <button
                            disabled={updatingId === lead.id}
                            onClick={() => updateStatus(lead.id, "replied")}
                            className="btn-ghost text-xs py-1 px-2 text-emerald-400 hover:text-emerald-300"
                          >
                            Mark replied
                          </button>
                        )}
                        {lead.status !== "disqualified" && (
                          <button
                            disabled={updatingId === lead.id}
                            onClick={() => updateStatus(lead.id, "disqualified")}
                            className="btn-ghost text-xs py-1 px-2"
                          >
                            Disqualify
                          </button>
                        )}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="btn-ghost text-xs py-1 px-2 text-red-500 hover:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={data.meta.page <= 1}
                onClick={() => router.push(`/leads?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(data.meta.page - 1) })}`)}
                className="btn-secondary text-xs py-1 px-3"
              >
                Previous
              </button>
              <button
                disabled={data.meta.page >= data.meta.totalPages}
                onClick={() => router.push(`/leads?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(data.meta.page + 1) })}`)}
                className="btn-secondary text-xs py-1 px-3"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading leads...</div>}>
      <LeadsContent />
    </Suspense>
  );
}