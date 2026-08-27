import { useState, useEffect } from "react";
import { X, Mail, Loader2, Search } from "lucide-react";
import type { PaginatedMeta } from "@/lib/types";
import { Pagination } from "./Pagination";
import { copilotsApi } from "@/lib/api";

interface CopilotPopupProps {
  isOpen: boolean;
  onClose: (copilotId?: number, copilotName?: string) => void;
}

interface CopilotDataPopup {
  id: number;
  name: string;
  description?: string;
  status: string;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  sendLimit: number;
  createdAt: string;
  lastRunAt: string | null;
  emailProfile?: {
    id: number;
    profileName: string;
    email: string;
  };
  targetAudience?: {
    id: number;
    name: string;
    country: string;
    searchQuery: string;
  };
}

const statusStyles = (status?: string) => {
  if (
    status === "active" ||
    status === "running" ||
    status === "delivered" ||
    status === "sent"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "error" || status === "bounced" || status === "failed") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function CopilotsPopup({ isOpen, onClose }: CopilotPopupProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [copilotsList, setCopilotsList] = useState<CopilotDataPopup[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);

  const fetchCopilots = async () => {
    setLoading(true);
    await copilotsApi
      .getAll()
      .then((res) => {
        setCopilotsList(res.data);
        setMeta(res.data.meta);
      })
      .catch((err) => {
        console.error("Failed to fetch copilots", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCopilots();
  }, [page, limit]);

  if (!isOpen) return null;

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={() => onClose()}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[85vh] max-h-180 w-[90vw] max-w-225 bg-white rounded-2xl shadow-2xl z-120 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-xl shrink-0">
          <div>
            <h2 className="text-xl font-semibold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent line-clamp-1">
              Your Copilots
            </h2>
            <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm font-medium">
              <span>Select one to view activity</span>
            </div>
          </div>
          <button
            onClick={() => onClose()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center py-16 text-gray-400">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : copilotsList?.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm">
              No copilot found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {copilotsList?.map((copilot) => (
                <div
                  key={copilot?.id}
                  onClick={() => onClose(copilot?.id, copilot?.name)}
                  className="bg-white p-4 rounded-2xl   hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 cursor-pointer group relative overflow-hidden flex  border border-gray-200 flex-col"
                >
                  {/* Name + status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                      {copilot?.name || "Unnamed Copilot"}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase border ${statusStyles(
                        copilot?.status,
                      )}`}
                    >
                      {copilot?.status || "Draft"}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-8"
                    title={copilot?.description}
                  >
                    {copilot?.description || "No description"}
                  </p>

                  {/* Footer: scrape profile + emails sent */}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-gray-50/80">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                      <div className="w-5 h-5 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-600 shrink-0">
                        <Search size={11} />
                      </div>
                      <span
                        className="truncate"
                        title={copilot?.targetAudience?.name || "No Source"}
                      >
                        {copilot?.targetAudience?.name || "No Source"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 shrink-0">
                      <Mail size={12} className="text-emerald-500" />
                      <span>{copilot?.emailsSent || 0} sent</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {meta && (
            <div className="mt-6">
              <Pagination
                meta={meta}
                currentPage={page}
                onPageChange={setPage}
                onLimitChange={handleLimitChange}
                isLarge={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
