"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Search,
  Building,
  Globe,
  Users,
  ChevronDown,
} from "lucide-react";
import { leadsApi } from "@/lib/api";
import type { Lead, PaginatedMeta } from "@/lib/types";
import { Pagination } from "@/components/ui/Pagination";
// import EmailPreviewCard from "@/components/ui/EmialPreview";
import { CopilotsPopup } from "@/components/ui/CopilotsPopup";

const leadsApiMock: Lead[] = [
  {
    id: 1,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    companyName: "Acme Corp",
    email: "john@acme.com",
    website: "https://acme.com",
    phone: "+1-555-1234",
    sourceQuery: "software engineer",
    address: "123 Main St, Anytown, USA",
    status: "sent",
    sentAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    companyName: "Globex Inc",
    email: "jane@globex.com",
    website: "https://globex.com",
    phone: "+1-555-5678",
    sourceQuery: "sales manager",
    address: "456 Oak Ave, Somewhere, USA",
    status: "sent",
    sentAt: "2023-01-01T00:00:00Z",
  },
];

const MOCK_META: PaginatedMeta = {
  total: 50,
  page: 1,
  limit: 50,
  totalPages: 2,
};

function Tooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative inline-block group">
      {children}

      <div
        role="tooltip"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150
                   px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm whitespace-nowrap
                   z-10"
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(MOCK_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [copilotName, setCopilotName] = useState<string | null>("All Copilots");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function fetchLeads(copilotId?: number) {
    try {
      setLoading(true);
      const res = await leadsApi.getAll({
        status: "sent",
        page,
        limit,
        copilotId,
      });
      console.log("Fetched leads:", res.data);
      // setLeads(res.data.data);
      // setMeta(res.data.meta);
      setLeads(leadsApiMock);
      setMeta(MOCK_META);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    fetchLeads();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchLeads();
  };

  return (
    <div className="py-8 px-4 max-w-350 mx-auto w-full">
      <div className="mb-8">
        <div className="text-blue-500 font-medium text-sm mb-4">Departure</div>
        <div className="flex items-center justify-between mb-2">
          <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Departure</h1>
            <p className="text-gray-500 text-sm">
              Recipients who have been emailed by
              <span className="font-bold text-gray-950 ">
                {" " + copilotName}
              </span>
              .
            </p>
          </div>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="btn-main btn-cta"
          >
            Select Copilot
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : leads.length === 0 ? (
        <div className=" min-h-120 flex flex-col items-center justify-center p-12 text-center ">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users size={20} className="text-primary" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No leads yet</h2>
          <p className="text-sm text-gray-500 mb-5">
            Leads will appear here once your copilots start sending emails.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white min-h-120 border border-gray-200 rounded-xl  overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm max-h-75 min-w-225">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Company
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Website
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5">
                      Email
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Phone
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Target Audience
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Address
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-75 overflow-y-auto">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b text-xs border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Building size={12} className=" text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold line-clamp-1 text-gray-900">
                              {lead.companyName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 ">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Globe size={12} />
                          </div>

                          <span className="font-semibold text- line-clamp-1 text-gray-900">
                            {lead.website}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 relative">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium group transition-colors"
                        >
                          <div className="w-6 h-6 rounded border border-blue-200 flex items-center justify-center text-blue-500 bg-white group-hover:border-blue-300 transition-colors shrink-0">
                            <Mail size={12} />
                          </div>
                          <span className="underline line-clamp-1 decoration-blue-200 underline-offset-4 group-hover:decoration-blue-400 transition-colors">
                            {lead.email}
                          </span>
                        </a>
                      </td>
                      {/* <TemplateCell lead={lead} /> */}
                      <td className="px-6 py-5  text-gray-600">
                        <div className="flex items-center line-clamp-1 gap-2 group relative whitespace-nowrap">
                          {lead.phone ? (
                            <>
                              <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                                <Phone size={12} />
                              </div>
                              <span className="font-semibold line-clamp-1 text-gray-900">
                                {lead.phone}
                              </span>
                              <Tooltip text={lead.phone}>
                                <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                                  <Phone size={12} />
                                </div>
                              </Tooltip>
                            </>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5  text-gray-600">
                        <div className="flex items-center line-clamp-1 gap-2 whitespace-nowrap">
                          {lead.sourceQuery ? (
                            <>
                              <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                                <Search size={12} />
                              </div>
                              <span className="font-semibold line-clamp-1 text-gray-900">
                                {lead.sourceQuery}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5  ">
                        <div
                          className=" text-gray-400 hover:text-blue-500  gap-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center "
                          title="Show emails reached"
                        >
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white">
                            <MapPin size={12} />
                          </div>
                          {lead.address ? (
                            <span className="font-semibold line-clamp-1 text-gray-900">
                              {lead.address}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 ">
                        <div
                          className=" text-gray-400 hover:text-blue-500  gap-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Show emails reached"
                        >
                          <div className="text-xs capitalize bg-primary/10 text-primary mt-1 p-1 rounded-md  leading-relaxed">
                            {lead.status ? lead.status : "Sent"}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {meta && (
            <Pagination
              meta={meta}
              currentPage={page}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </>
      )}

      <CopilotsPopup
        isOpen={isSidebarOpen}
        onClose={(copilotId, copilotName) => {
          setIsSidebarOpen(false);
          if (copilotId) {
            fetchLeads(copilotId);
          }
          if (copilotName) {
            setCopilotName(copilotName + " Copilot");
          }
        }}
      />
    </div>
  );
}
