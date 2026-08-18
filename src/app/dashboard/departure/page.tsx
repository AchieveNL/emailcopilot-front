"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Building,
  Globe,
  Users,
  Send,
  Target,
  Calendar,
} from "lucide-react";
import { leadsApi } from "@/lib/api";
import type { Lead, PaginatedMeta } from "@/lib/types";
import { Pagination } from "@/components/ui/Pagination";
import EmailPreviewCard from "@/components/ui/EmialPreview";
import { CopilotsPopup } from "@/components/ui/CopilotsPopup";
import { templatesApi } from "@/lib/api";
import { useRef } from "react";
import axios from "axios";

// const leadsApiMock: Lead[] = [
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
//   {
//     id: 1,
//     copilotName: "John Doe",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Acme Corp",
//     email: "john@acme.com",
//     website: "https://acme.com",
//     phone: "+1-555-1234",
//     sourceQuery: "lld",
//     address: "123 Main St, Anytown, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 1,
//   },
//   {
//     id: 2,
//     copilotName: "Jane Smith",
//     createdAt: "2023-01-01T00:00:00Z",
//     updatedAt: "2023-01-01T00:00:00Z",
//     companyName: "Globex Inc",
//     email: "jane@globex.com",
//     website: "https://globex.com",
//     phone: "+1-555-5678",
//     sourceQuery: "kdk",
//     address: "456 Oak Ave, Somewhere, USA",
//     status: "sent",
//     sentAt: "2023-01-01T00:00:00Z",
//     templateId: 2,
//   },
// ];

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
  text: string | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 min-w-0 group z-10 w-40">
      {children}

      <div
        role="tooltip"
        className=" w-40 pointer-events-none absolute border border-gray-100 bottom-full mb-2 left-1/2 -translate-x-1/2
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150
                   px-3 py-1.5 rounded-md bg-white text-gray-600 text-[10px]
                   text-center shadow-md whitespace-pre-line 
                   z-100"
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
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

  const [activeLeadId, setActiveLeadId] = useState<number | null>(null);
  const [templateData, setTemplateData] = useState<{
    subject?: string;
    body?: string;
  } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleShowPreview = async (lead: Lead) => {
    setActiveLeadId(lead.id);
    setTemplateData(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (lead.templateId) {
      try {
        const res = await templatesApi.getById(lead.templateId, {
          signal: abortController.signal,
        });
        const data = res.data?.data || res.data;
        setTemplateData({
          subject: data?.subject,
          body: data?.body,
        });
      } catch (error: any) {
        if (
          axios.isCancel(error) ||
          error.name === "CanceledError" ||
          error.name === "AbortError"
        ) {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch template:", error);
        }
      }
    }
  };

  const handleClosePreview = () => {
    setActiveLeadId(null);
    setTemplateData(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

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
      setLeads(res.data.data);
      setMeta(res.data.meta);
      // setLeads(leadsApiMock);
      // setMeta(MOCK_META);
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
            <div className="overflow-auto max-h-125">
              <table className="w-full text-sm min-w-225">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Copilot
                    </th>
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
                      Departured at
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5">
                      Template
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5 z-50 sticky right-0 bg-white border-l border-gray-100">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-75 overflow-y-auto">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className=" border-b text-xs border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Send size={12} />
                          </div>
                          <Tooltip text={lead.copilotName || "Unknown Copilot"}>
                            <div className="font-semibold line-clamp-1 text-gray-900">
                              {lead.copilotName || "Unknown Copilot"}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Building size={12} />
                          </div>
                          <Tooltip text={lead.companyName}>
                            <div className="font-semibold line-clamp-1 text-gray-900">
                              {lead.companyName}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 ">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Globe size={12} />
                          </div>

                          <Tooltip text={lead?.website}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={lead.website || "#"}
                              className="font-semibold text- line-clamp-1 text-gray-900"
                            >
                              {lead.website}
                            </a>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 relative">
                        <a
                          href={`mailto:${lead.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium group transition-colors"
                        >
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Mail size={12} />
                          </div>
                          <Tooltip text={lead.email}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`mailto:${lead.email}`}
                              className="underline line-clamp-1 decoration-blue-200 underline-offset-4 group-hover:decoration-blue-400 transition-colors"
                            >
                              {lead.email}
                            </a>
                          </Tooltip>
                        </a>
                      </td>

                      <td className="px-6 py-5  text-gray-600">
                        <div className="flex items-center gap-2 group relative whitespace-nowrap">
                          {lead.phone ? (
                            <>
                              <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                                <Phone size={12} />
                              </div>
                              <Tooltip text={lead.phone}>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={`https://wa.me/${lead.phone.replace("+", "")}`}
                                  className="font-semibold line-clamp-1 text-gray-900"
                                >
                                  {lead.phone}
                                </a>
                              </Tooltip>
                            </>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5  text-gray-600">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {lead.sourceQuery ? (
                            <>
                              <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                                <Target size={12} />
                              </div>
                              <Tooltip text={lead.sourceQuery}>
                                <a
                                  href={`/dashboard/target-audiences#${lead.sourceQuery.replace(" ", "-")}`}
                                  className="font-semibold line-clamp-1 text-gray-900"
                                >
                                  {lead.sourceQuery}
                                </a>
                              </Tooltip>
                            </>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5  ">
                        <div className=" text-gray-400 hover:text-blue-500  gap-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center ">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white">
                            <MapPin size={12} />
                          </div>
                          {lead.address ? (
                            <Tooltip text={lead.address}>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold line-clamp-1 text-gray-900"
                              >
                                {lead.address}
                              </a>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Calendar size={12} />
                          </div>
                          <Tooltip text={lead.sentAt || "Unknown Sent At"}>
                            <div className="font-semibold line-clamp-1 text-gray-900">
                              {lead.sentAt || "Unknown Sent At"}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 relative">
                        <div
                          className=" text-gray-400 hover:text-blue-500  gap-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                          onClick={() => handleShowPreview(lead)}
                        >
                          <div className="text-xs capitalize bg-primary/10 text-primary mt-1 px-2 py-1.5 rounded-md  leading-relaxed">
                            show
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 sticky right-0 z-50 bg-white group-hover:bg-gray-50/50 border-l border-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <Tooltip text={lead.status || "Sent"}>
                            <div className="w-fit px-2 py-1.5 rounded border border-green-200  text-green-400 bg-green-100 ">
                              <div className="font-semibold line-clamp-1 text-green-900">
                                {lead.status || "Sent"}
                              </div>
                            </div>
                          </Tooltip>
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

      {activeLeadId && (
        <EmailPreviewCard
          subject={
            templateData?.subject ||
            (templateData === null ? "Loading..." : undefined)
          }
          body={
            templateData?.body ||
            (templateData === null ? "Loading..." : undefined)
          }
          onClose={handleClosePreview}
        />
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
