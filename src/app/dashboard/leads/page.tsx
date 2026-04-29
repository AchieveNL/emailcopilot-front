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
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Leads</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          {data ? `${data.meta.total} total leads` : "Loading..."}
        </p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            style={{
              padding: '0.625rem 1rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: -1,
              color: activeTab === tab.value ? 'var(--color-accent)' : 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.value ? 'var(--color-accent)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    Loading...
                  </td>
                </tr>
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No leads found
                  </td>
                </tr>
              ) : (
                data?.data.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{lead.companyName}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{lead.email}</td>
                    <td>
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#2563eb', fontSize: '0.75rem', textDecoration: 'none', display: 'block', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {lead.website.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <Badge status={lead.status} />
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      {new Date(lead.scrapedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {lead.status === "sent" && (
                          <button
                            disabled={updatingId === lead.id}
                            onClick={() => updateStatus(lead.id, "replied")}
                            className="btn btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#059669' }}
                          >
                            Mark replied
                          </button>
                        )}
                        {lead.status !== "disqualified" && (
                          <button
                            disabled={updatingId === lead.id}
                            onClick={() => updateStatus(lead.id, "disqualified")}
                            className="btn btn-ghost"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            Disqualify
                          </button>
                        )}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="btn btn-ghost"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#dc2626' }}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={data.meta.page <= 1}
                onClick={() => router.push(`/leads?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(data.meta.page - 1) })}`)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
              >
                Previous
              </button>
              <button
                disabled={data.meta.page >= data.meta.totalPages}
                onClick={() => router.push(`/leads?${new URLSearchParams({ ...(statusParam ? { status: statusParam } : {}), page: String(data.meta.page + 1) })}`)}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
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
    <Suspense fallback={<div style={{ padding: '2rem 2.5rem' }}>Loading leads...</div>}>
      <LeadsContent />
    </Suspense>
  );
}