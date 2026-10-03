"use client";

import { Suspense, useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Users, Search } from "lucide-react";
import { leadsApi } from "@/lib/api";
import type { Lead, PaginatedMeta } from "@/lib/types";
import LeadStatus from "@/components/ui/departure/LeadStatus";
import LeadMenu from "@/components/ui/departure/LeadMenu";
import { Pagination } from "@/components/ui/Pagination";
import EmailPreviewCard from "@/components/ui/EmialPreview";
import { CopilotsPopup } from "@/components/ui/CopilotsPopup";
import { templatesApi } from "@/lib/api";
import axios from "axios";
import { formatDateTime } from "@/lib/helpers";
import { useRowsPerPage } from "@/lib/hooks";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const MOCK_META: PaginatedMeta = {
  total: 50,
  page: 1,
  limit: 50,
  totalPages: 2,
};

const TOOLTIP_MARGIN = 8; // gap between trigger and tooltip, px
const TOOLTIP_MAX_WIDTH = 160; // matches max-w-40 (40 * 4px)
const VIEWPORT_PADDING = 8; // keep tooltip this far from screen edges

type TooltipPlacement = "top" | "bottom";

/**
 * Computes where the tooltip bubble should render based on the trigger's
 * current position in the viewport:
 * - Flips to "bottom" placement when there isn't enough room above the
 *   trigger (e.g. rows near the top of a scrolled/sticky-header table).
 * - Clamps horizontal position so the bubble never spills off-screen.
 */
function computeTooltipPosition(
  triggerEl: HTMLElement,
  tooltipEl: HTMLElement | null,
): { top: number; left: number; placement: TooltipPlacement } {
  const rect = triggerEl.getBoundingClientRect();
  const tooltipHeight = tooltipEl?.offsetHeight ?? 32;
  const tooltipWidth = tooltipEl?.offsetWidth ?? TOOLTIP_MAX_WIDTH;

  const spaceAbove = rect.top;
  const placement: TooltipPlacement =
    spaceAbove < tooltipHeight + TOOLTIP_MARGIN ? "bottom" : "top";

  const top =
    placement === "top"
      ? rect.top - tooltipHeight - TOOLTIP_MARGIN
      : rect.bottom + TOOLTIP_MARGIN;

  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, window.innerWidth - tooltipWidth - VIEWPORT_PADDING),
  );

  return { top, left, placement };
}

function Tooltip({
  text,
  children,
}: {
  text: string | null | undefined;
  children: React.ReactNode;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: TooltipPlacement;
  }>({ top: 0, left: 0, placement: "top" });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    setCoords(computeTooltipPosition(triggerRef.current, tooltipRef.current));
  };

  // Recompute once the tooltip is in the DOM and measurable (its real
  // width/height aren't known until after it renders).
  useLayoutEffect(() => {
    if (visible) updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!text) return <>{children}</>;

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{ position: "fixed", top: coords.top, left: coords.left }}
            className="min-w-30 max-w-40 pointer-events-none border border-gray-100
                       px-3 py-1.5 rounded-md bg-white text-gray-600 text-[10px]
                       text-center shadow-md whitespace-normal wrap-break-word capitalize
                       z-9999"
          >
            {text}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 ${
                coords.placement === "top"
                  ? "top-full -mt-1"
                  : "bottom-full -mb-1"
              }`}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

function LeadsPageContent() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>(MOCK_META);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const autoPerPage = useRowsPerPage(8);
  const [manualLimit, setManualLimit] = useState<number | null>(null);
  const effectiveLimit = manualLimit ?? autoPerPage;
  const [copilotId, setCopilotId] = useState<number | null>(null);
  const [copilotName, setCopilotName] = useState<string | null>("All Copilots");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
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

  async function fetchLeads(
    targetPage: number,
    targetLimit: number,
    targetCopilotId: number | null,
  ) {
    try {
      setLoading(true);
      const res = await leadsApi.getAll({
        page: targetPage,
        limit: targetLimit,
        ...(targetCopilotId != null ? { copilotId: targetCopilotId } : {}),
      });
      console.log("Fetched leads:", res.data);
      setLeads(res.data.data);
      setMeta(res.data.meta);
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const paramId = searchParams.get("copilotId");
    const paramName = searchParams.get("name");
    console.log("Search params:", { copilotId: paramId, copilotName: paramName });

    if (paramId && paramName) {
      setCopilotId(Number(paramId));
      setCopilotName(paramName);
    } else {
      setCopilotId(null);
    }
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchLeads(page, effectiveLimit, copilotId);
  }, [page, effectiveLimit, copilotId]);

  // When the viewport-derived size changes and the user hasn't picked a
  // manual size, restart from page 1 so the new size applies from the top.
  // A manual selection always wins over the automatic size.
  useEffect(() => {
    if (manualLimit == null) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPerPage]);

  // normalize URL to ensure it has a protocol (http or https)
  const normalizeUrl = (url: string) => {
    if (!url) return "#";

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const handleLimitChange = (newLimit: number) => {
    setManualLimit(newLimit);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteLead = (id: number) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const handleSuppressionChange = (id: number, suppressed: boolean) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, suppressed } : lead)),
    );
  };

  // Client-side search over the loaded page (the leads API exposes no
  // search param). Matches copilot, company, email, website, phone,
  // address, and target audience.
  const query = search.trim().toLowerCase();
  const visibleLeads = query
    ? leads.filter((lead) =>
        [
          lead.copilotName,
          lead.companyName,
          lead.email,
          lead.website,
          lead.phone,
          lead.address,
          lead.sourceQuery,
        ].some((field) => field?.toLowerCase().includes(query)),
      )
    : leads;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 py-4 sm:py-5 [@media(min-height:1081px)]:flex [@media(min-height:1081px)]:min-h-full [@media(min-height:1081px)]:flex-col">
      <DashboardHeader
        title="Departure"
        description="Recipients who have been emailed by your copilots."
        actionLabel="Select Copilot"
        onAction={() => setIsSidebarOpen(true)}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : leads.length === 0 ? (
        <div className=" min-h-120 flex flex-col items-center justify-center p-12 text-center ">
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Users size={20} className="text-primary" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No leads yet</h2>
          <p className="text-sm text-gray-500 mb-5">
            Leads will appear here once your copilots start sending emails.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-[#E2E8F0] rounded-lg px-4 sm:px-5 py-4 mb-4 flex items-center">
            <div className="relative w-full sm:w-[378px]">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59637C]"
              />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search leads..."
                className="w-full h-11 border border-[#E2E8F0] rounded-lg pl-10 pr-4 text-[15px] font-light bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                style={{ color: "#59637C" }}
              />
            </div>
          </div>
          {visibleLeads.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <h2 className="font-semibold text-sm text-gray-900 mb-1">
                No results found
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                No leads match &quot;{search.trim()}&quot;. Try a different
                search term.
              </p>
              <button
                onClick={() => handleSearchChange("")}
                className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden mb-6 [@media(min-height:1081px)]:flex [@media(min-height:1081px)]:flex-1 [@media(min-height:1081px)]:flex-col">
            <div className="overflow-auto [@media(min-height:1081px)]:flex-1 [@media(max-height:1080px)]:max-h-[calc(100dvh-320px)]">
              <table className="w-full text-sm min-w-225">
                <thead>
                  <tr className="border-b sticky top-0 z-40 border-[#E2E8F0] bg-white">
                    <th className=" font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Copilot
                    </th>
                    <th className=" font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Company
                    </th>
                    <th className=" font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Address
                    </th>
                    <th className=" font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Website
                    </th>
                    <th className="font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Email
                    </th>
                    <th className=" font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Phone
                    </th>
                    <th className="font-normal text-left text-xs leading-5 bg-white text-[#94A3B8] px-6 py-3">
                      Target Audience
                    </th>
                    <th className="font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Departured at
                    </th>
                    <th className="font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Template
                    </th>
                    <th className="font-normal text-left text-xs leading-5 text-[#94A3B8] px-6 py-3">
                      Status
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5 z-40 sticky top-0 right-0 bg-white">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-75 overflow-y-auto">
                  {visibleLeads.map((lead, index) => (
                    <tr
                      key={lead.id + index}
                      className=" border-b text-sm border-[#E2E8F0] hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Tooltip text={lead.copilotName || "Unknown Copilot"}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`/dashboard/copilots#${lead.copilotName?.replace(" ", "-") || "unknown-copilot"}`}
                              className="font-semibold whitespace-nowrap text-sm text-[#0F172A]"
                            >
                              {lead.copilotName || "Unknown Copilot"}
                            </a>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Tooltip text={lead.companyName}>
                            <div className="font-semibold line-clamp-2 max-w-48 text-sm text-[#0F172A]">
                              {lead.companyName}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5  ">
                        <div className=" text-gray-400 hover:text-blue-500  gap-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center ">
                          {lead.address ? (
                            <Tooltip text={lead.address}>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold line-clamp-2 max-w-48 text-sm text-[#0F172A]"
                              >
                                {lead.address}
                              </a>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 ">
                        <div className="flex items-center gap-3">

                          <Tooltip text={lead?.website}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={normalizeUrl(lead.website || "#")}
                              className="font-semibold line-clamp-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
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
                          <Tooltip text={lead.email}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`mailto:${lead.email}`}
                              className="line-clamp-2 underline decoration-blue-200 underline-offset-4 transition-colors group-hover:decoration-blue-400"
                            >
                              {lead.email}
                            </a>
                          </Tooltip>
                        </a>
                      </td>

                      <td className="px-6 py-5  text-gray-600">
                        <div className="flex items-center gap-2 group relative ">
                          {lead.phone ? (
                            <>
                              <Tooltip text={lead.phone}>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={`https://wa.me/${lead.phone.replace("+", "")}`}
                                className="font-semibold whitespace-nowrap text-sm text-[#0F172A]"
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
                        <div className="flex items-center gap-2">
                          {lead.sourceQuery ? (
                            <>
                              <Tooltip text={lead.sourceQuery}>
                                <a
                                  href={`/dashboard/target-audiences#${lead.sourceQuery.replace(" ", "-")}`}
                                className="font-semibold whitespace-nowrap text-sm text-[#0F172A]"
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

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Tooltip
                            text={
                              lead.sentAt
                                ? formatDateTime(lead.sentAt)
                                : "Unknown"
                            }
                          >
                            <div className="font-semibold whitespace-nowrap text-sm text-[#0F172A]">
                              {lead.sentAt
                                ? formatDateTime(lead.sentAt)
                                : "Unknown"}
                            </div>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 relative">
                        <div
                          className=" text-gray-400   gap-2  rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                          onClick={() => handleShowPreview(lead)}
                        >
                          <div
                            className="inline-flex min-w-[60px] items-center justify-center rounded-lg px-3.5 py-1.5 text-xs leading-4 font-semibold capitalize transition-colors hover:brightness-95"
                            style={{
                              backgroundColor: "#F5F7FF",
                              color: "#2563EB",
                            }}
                          >
                            show
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 align-middle transition-colors">
                        <div className="flex items-center gap-2 ">
                          <Tooltip
                            text={
                              lead.suppressed
                                ? "Suppressed"
                                : lead.status.charAt(0).toUpperCase() +
                                    lead.status.slice(1) || "Sent"
                            }
                          >
                            <LeadStatus
                              status={
                                lead.suppressed
                                  ? "suppressed"
                                  : lead.status || "sent"
                              }
                            />
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-5 sticky w-16 align-middle right-0 z-30 bg-white transition-colors">
                        <div className="flex items-center justify-center">
                          <LeadMenu
                            lead={lead}
                            onDeleted={handleDeleteLead}
                            onSuppressionChange={handleSuppressionChange}
                          />
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
        onClose={(selectedId, selectedName) => {
          setIsSidebarOpen(false);
          if (selectedId) {
            setCopilotId(selectedId);
            setPage(1);
          }
          if (selectedName) {
            setCopilotName(selectedName + " Copilot");
          }
        }}
      />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-8 px-4 w-full mx-auto flex items-center justify-center min-h-100">
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <LeadsPageContent />
    </Suspense>
  );
}
