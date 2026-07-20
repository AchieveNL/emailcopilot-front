"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Mail,
  Building2,
  Calendar,
  Send,
  FileText,
EllipsisVerticalIcon,
  Eye,
} from "lucide-react";
import { leadsApi, templatesApi } from "@/lib/api";
import type { Lead, PaginatedMeta } from "@/lib/types";
import { Pagination } from "@/components/ui/Pagination";
import EmailPreviewCard from "@/components/ui/EmialPreview";
import { LeadSidebar } from "@/components/ui/LeadSidebar";

const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    copilotName: "Private Jet Operators",
    copilotDescription: "AI outreach to dental practices in California",
    companyName: "Private Jet Operators",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2026-01-24T23:53:00Z",
    address: null,
    phone: null,
  },
  {
    id: 2,
    copilotName: "Chiropractors",
    copilotDescription: "Reach out to chiropractic clinics across Texas",
    companyName: "Chiropractors",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2026-01-24T23:40:00Z",
    address: null,
    phone: null,
  },
  {
    id: 3,
    copilotName: "Pediatric Dentists",
    copilotDescription: "Connect with pediatric dental practices in Florida",
    companyName: "Pediatric Dentists",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2026-01-11T21:32:00Z",
    address: null,
    phone: null,
  },
  {
    id: 4,
    copilotName: "Orthodontists",
    copilotDescription: "Outreach to orthodontic practices in New York",
    companyName: "Orthodontists",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2026-01-10T07:00:00Z",
    address: null,
    phone: null,
  },
  {
    id: 5,
    copilotName: "General Dentists",
    copilotDescription: "Email outreach to general dental practices in Ohio",
    companyName: "General Dentists",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2025-10-19T18:35:00Z",
    address: null,
    phone: null,
  },
  {
    id: 6,
    copilotName: "Chiropractors",
    copilotDescription: "Reach out to chiropractic clinics across Texas",
    companyName: "Chiropractors",
    email: "karim@achieve.nl",
    templateName: "Intro - Book More Appointments",
    templateId: 1,
    emailedAt: "2026-06-24T02:00:00Z",
    address: null,
    phone: null,
  },
];

const MOCK_META: PaginatedMeta = {
  total: 50,
  page: 1,
  limit: 50,
  totalPages: 2,
};

function TemplateCell({ lead }: { lead: Lead }) {
  const [template, setTemplate] = useState<{
    subject: string;
    body: string;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number; position: 'top' | 'bottom' }>({ top: 0, left: 0, position: 'bottom' });

  useEffect(() => {
    if (!isHovered || !lead.templateId || template) return;

    const controller = new AbortController();

    setIsLoading(true);

    templatesApi
      .getById(lead.templateId, { signal: controller.signal })
      .then((res) => {
        setTemplate(res.data);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [isHovered, lead.templateId, template]);
  return (
    <td
      className="px-6 py-5 align-middle cursor-pointer pt-6 text-gray-600 group relative"
      onMouseEnter={(e) => {
        setIsHovered(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const isNearBottom = rect.top > window.innerHeight / 2;
        
        setPopupPos({
          top: isNearBottom ? rect.top + 80 : rect.bottom  - 80,
          left: rect.left - rect.width / 2,
          position: isNearBottom ? 'top' : 'bottom',
        });
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-400 shrink-0" />
        <span className="truncate line-clamp-1 max-w-[200px]">
          {lead.templateName}
        </span>
      </div>
      {isHovered && (
        <div 
          className={`fixed z-[100] w-96  rounded-2xl ${
            popupPos.position === 'top' ? '-translate-y-full -translate-x-1/2' : '-translate-x-1/2'
          }`}
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <EmailPreviewCard
            subject={isLoading ? "Loading..." : template?.subject}
            body={isLoading ? "Fetching template preview..." : template?.body}
          />
        </div>
      )}
    </td>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [meta, setMeta] = useState<PaginatedMeta>(MOCK_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  async function fetchLeads() {
    try {
      setLoading(true);
      // const res = await leadsApi.getAll({ status: "sent", page, limit });
      // setLeads(res.data.data);
      // setMeta(res.data.meta);
           setLeads(MOCK_LEADS);
      setMeta({ ...MOCK_META, limit, page });
    } catch {
      // Fallback to mock data if API fails or for offline development
      setLeads(MOCK_LEADS);
      setMeta({ ...MOCK_META, limit, page });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [page, limit]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="py-8 px-4 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <div className="text-blue-500 font-medium text-sm mb-4">Departured</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Departured</h1>
        <p className="text-gray-500 text-sm">
          Recipients who have been emailed by your copilots.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : (
        // leads.length === 0 ? (
        // <div className="bg-white border border-gray-200 rounded-xl p-12 text-center ">
        //   <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        //     <Users size={20} className="text-gray-500" />
        //   </div>
        //   <h2 className="font-bold text-gray-900 mb-2">No leads yet</h2>
        //   <p className="text-sm text-gray-500 mb-5">
        //     Leads will appear here once your copilots start sending emails.
        //   </p>
        // </div>
        // ) :
        <>
          <div className="bg-white border border-gray-200 rounded-xl  overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm max-h-[300px] min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-white">
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Copilot
                    </th>
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Company
                    </th>
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Email
                    </th>
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Template
                    </th>
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Sent At
                    </th>
                    <th className="text-center font-semibold text-gray-900 px-6 py-5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-[300px] overflow-y-auto">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setIsSidebarOpen(true);
                      }}
                      className="border-b text-xs border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex gap-4">
                          <div className="mt-1 shrink-0 flex items-center">
                            <Send size={22} className="ml-0.5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold line-clamp-1 text-gray-900">
                              {lead.copilotName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-[200px] leading-relaxed">
                              {lead.copilotDescription
                                ?.split(" ")
                                .map((word, i) => {
                                  const isHighlighted = [
                                    "California",
                                    "Texas",
                                    "Florida",
                                    "New York",
                                    "Ohio",
                                  ].some((h) =>
                                    word.replace(",", "").includes(h),
                                  );
                                  return (
                                    <span
                                      key={i}
                                      className={
                                        isHighlighted ? "text-blue-500" : ""
                                      }
                                    >
                                      {word}{" "}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle pt-6">
                        <div className="flex items-center gap-3">
                          <FileText
                            size={18}
                            className="text-gray-400 shrink-0"
                          />
                          <span className="font-semibold text- line-clamp-1 text-gray-900">
                            {lead.companyName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle pt-6 group relative">
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
                      <TemplateCell lead={lead} />
                      <td className="px-6 py-5 align-middle pt-6 text-gray-600">
                        <div className="flex items-center line-clamp-1 gap-2 whitespace-nowrap">
                          <Calendar
                            size={16}
                            className="text-gray-400 shrink-0"
                          />
                          {new Date(lead.emailedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}{" "}
                          ,{" "}
                          {new Date(lead.emailedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle pt-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setIsSidebarOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                          title="Show emails reached"
                        >
                          <EllipsisVerticalIcon size={18} />
                        </button>
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
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
            />
          )}
        </>
      )}

      <LeadSidebar
        lead={selectedLead}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
