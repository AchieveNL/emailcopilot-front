"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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
import axios from "axios";
import { formatDateTime } from "@/lib/helpers";

const handleStatusTextColor = (status: string) => {
  switch (status) {
    case "sent":
      return " text-success";
    case "failed":
      return "text-error";
    case "new":
      return " text-primary";
    default:
      return " text-gray-900";
  }
};

const handleStatusBgColor = (status: string) => {
  switch (status) {
    case "sent":
      return "bg-success/5 ";
    case "failed":
      return "bg-error/5 ";
    case "new":
      return "bg-primary/5 ";
    default:
      return "bg-gray-100 ";
  }
};

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
    } catch {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // normalize URL to ensure it has a protocol (http or https)
  const normalizeUrl = (url: string) => {
    if (!url) return "#";

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

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
    <div className="py-8 px-4 mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Departure</h1>
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
            className="btn-main btn-cta "
            style={{ padding: "9px 20px", fontSize: "0.85rem" }}
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
          <div className="bg-white min-h-120 border border-gray-200 rounded-xl  overflow-hidden mb-6">
            <div className="overflow-auto max-h-125">
              <table className="w-full text-sm min-w-225">
                <thead>
                  <tr className="border-b sticky top-0 z-40 border-gray-100 bg-white">
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Copilot
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Company
                    </th>
                    <th className=" font-semibold text-gray-900 px-6 py-5">
                      Address
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
                    <th className=" font-semibold  bg-white text-gray-900 px-6    py-5">
                      Target Audience
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5">
                      Departured at
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5">
                      Template
                    </th>
                    <th className="font-semibold text-gray-900 px-6 py-5 z-40  sticky top-0 right-0 bg-white border-l border-gray-100">
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
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={`/dashboard/copilots#${lead.copilotName?.replace(" ", "-") || "unknown-copilot"}`}
                              className="font-semibold line-clamp-1 text-gray-900"
                            >
                              {lead.copilotName || "Unknown Copilot"}
                            </a>
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
                      <td className="px-6 py-5 ">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Globe size={12} />
                          </div>

                          <Tooltip text={lead?.website}>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={normalizeUrl(lead.website || "#")}
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
                      <td className="px-6 py-5  bg-white  text-gray-600">
                        <div className="flex items-center gap-2  whitespace-nowrap">
                          {lead.sourceQuery ? (
                            <>
                              <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white ">
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

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-400 bg-white shrink-0">
                            <Calendar size={12} />
                          </div>
                          <Tooltip
                            text={
                              lead.sentAt
                                ? formatDateTime(lead.sentAt)
                                : "Unknown"
                            }
                          >
                            <div className="font-semibold line-clamp-1 text-gray-900">
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
                          <div className="text-xs capitalize hover:bg-primary/5 hover:text-primary text-gray-800 mt-1 w-fit px-3 py-1 rounded-lg  leading-relaxed">
                            show
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 sticky w-20 align-middle right-0 z-30 bg-white group-hover:bg-gray-50/50 border-l border-gray-100 transition-colors">
                        <div className="flex items-center gap-2 ">
                          <Tooltip
                            text={
                              lead.status.charAt(0).toUpperCase() +
                                lead.status.slice(1) || "Sent"
                            }
                          >
                            <div
                              className={`w-fit px-3 py-1 rounded-lg ${handleStatusBgColor(lead.status)} `}
                            >
                              <div
                                className={`font-semibold line-clamp-1 capitalize ${handleStatusTextColor(lead.status)}`}
                              >
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
