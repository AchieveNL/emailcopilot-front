"use client";

import { useState, useEffect } from "react";
import { Users, ExternalLink, ChevronLeft, ChevronRight, Mail, Building2, MapPin, Phone, Calendar } from "lucide-react";
import { leadsApi } from "@/lib/api";
import type { Lead, PaginatedMeta } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLeads();
  }, [page]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const res = await leadsApi.getAll({ status: "sent", page, limit: 20 });
      setLeads(res.data.data);
      setMeta(res.data.meta);
    } catch {
      setLeads([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Recipients who have been emailed by your copilots.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
      ) : leads.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users size={20} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No leads yet</h2>
          <p className="text-sm text-gray-500 mb-5">Leads will appear here once your copilots start sending emails.</p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left font-semibold text-gray-600 px-5 py-3">Company</th>
                  <th className="text-left font-semibold text-gray-600 px-5 py-3">Email</th>
                  <th className="text-left font-semibold text-gray-600 px-5 py-3 hidden md:table-cell">Address</th>
                  <th className="text-left font-semibold text-gray-600 px-5 py-3 hidden lg:table-cell">Phone</th>
                  <th className="text-left font-semibold text-gray-600 px-5 py-3 hidden sm:table-cell">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                          <Building2 size={15} className="text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">{lead.companyName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
                        <Mail size={13} />
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate max-w-[200px]">{lead.address || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="shrink-0" />
                        {lead.phone || "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="shrink-0" />
                        {new Date(lead.emailedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <span className="text-gray-500">
                Page {meta.page} of {meta.totalPages} ({meta.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={page >= meta.totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40 disabled:pointer-events-none"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
