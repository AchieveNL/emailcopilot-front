import { useState, useEffect } from "react";
import { X, Mail, Calendar, Loader2 } from "lucide-react";
import type { Lead, PaginatedMeta } from "@/lib/types";
import { Pagination } from "./Pagination";
// import { emailLogsApi } from "@/lib/api";

interface EmailLog {
  id: number;
  subject: string;
  sentAt: string;
  status: string;
  errorMessage?: string | null;
}

const MOCK_EMAIL_LOGS: EmailLog[] = [
  {
    id: 1,
    subject: "Introduction: Exploring Synergies",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: "opened",
  },
  {
    id: 2,
    subject: "Follow-up: Connecting next week?",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "delivered",
  },
  {
    id: 3,
    subject: "Final reach out",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "bounced",
    errorMessage: "Recipient inbox full",
  },
  {
    id: 4,
    subject: "Initial Contact",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: "failed",
    errorMessage: "Invalid email domain",
  },
  ...Array.from({ length: 25 }).map((_, i) => ({
    id: i + 5,
    subject: `Automated Follow-up Sequence #${i + 1}`,
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (12 + i)).toISOString(),
    status: i % 5 === 0 ? "opened" : "delivered",
    errorMessage: null,
  })),
];

interface LeadSidebarProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadSidebar({ lead, isOpen, onClose }: LeadSidebarProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);

  useEffect(() => {
    if (isOpen && lead) {
      setLoading(true);

      // MOCK DATA FETCHING
      const timer = setTimeout(() => {
        const total = MOCK_EMAIL_LOGS.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = MOCK_EMAIL_LOGS.slice(startIndex, endIndex);

        setEmailLogs(paginatedData);
        setMeta({
          total,
          page,
          limit,
          totalPages,
        });
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);

      /*
      // Real API usage
      emailLogsApi.getAll({ leadId: lead.id, page, limit })
        .then((res) => {
          setEmailLogs(res.data.data);
          setMeta(res.data.meta);
        })
        .catch((err) => {
          console.error("Failed to fetch email logs", err);
        })
        .finally(() => {
          setLoading(false);
        });
      */
    }
  }, [isOpen, lead, page, limit]);

  if (!isOpen || !lead) return null;

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
              {lead.companyName}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
              <Mail size={14} />
              <span>{lead.email}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail size={18} className="text-blue-500" />
            Emails Reached
          </h3>

          <div className="space-y-3 mb-6">
            {loading ? (
              <div className="flex justify-center py-8 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : emailLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No email logs found.
              </div>
            ) : (
              emailLogs.map((email) => (
                <div
                  key={email.id}
                  className="bg-white p-4 rounded-xl border border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="font-medium text-gray-900 text-sm line-clamp-2">
                      {email.subject}
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center px-2 py-1 rounded text-xs font-medium border capitalize ${
                        email.status === "delivered" || email.status === "sent"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : email.status === "error" ||
                              email.status === "bounced" ||
                              email.status === "failed"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {email.status}
                    </span>
                  </div>
                  {email.errorMessage && (
                    <div
                      className="text-xs text-red-500 mb-2 truncate"
                      title={email.errorMessage}
                    >
                      Error: {email.errorMessage}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(email.sentAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {meta && (
            <Pagination
              meta={meta}
              currentPage={page}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
              isLarge={false}
            />
          )}
        </div>
      </div>
    </>
  );
}
