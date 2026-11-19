"use client";

import { useState, useEffect } from "react";
import { Plus, Send } from "lucide-react";
import { copilotsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import CopilotTable, {
  type Copilot,
} from "@/components/layout/features/copilots/CopilotTable";
import CopilotCardsList from "@/components/layout/features/copilots/CopilotCardsList";
import CopilotToolbar from "@/components/ui/copilots/CopilotToolBar";
import TemplatesPagination from "@/components/ui/templates/Pagination";
import { useRowsPerPage } from "@/lib/hooks";
import DashboardHeader from "@/components/layout/DashboardHeader";
import CopilotLimitDialog from "@/components/ui/limits/CopilotLimitDialog";
import { copilotQuota, currentPlanId, higherTiers } from "@/lib/limits";
import { useBilling, billingKeys } from "@/lib/useBilling";
import { useQueryClient } from "@tanstack/react-query";

export default function CopilotsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { limits, plans, refetchLimits } = useBilling();
  const quota = copilotQuota(limits);
  const [limitDialogOpen, setLimitDialogOpen] = useState(false);
  const [copilots, setCopilots] = useState<Copilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Pagination state — same responsive rows-per-page as the templates table
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = useRowsPerPage(20);

  useEffect(() => {
    fetchCopilots();
  }, []);

  // Deep link from the wizard's own guard (/dashboard/copilots?limit=copilots).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit") !== "copilots") return;
    setLimitDialogOpen(true);
    window.history.replaceState(null, "", "/dashboard/copilots");
  }, []);

  async function fetchCopilots() {
    try {
      setLoading(true);
      const res = await copilotsApi.getAll();
      console.log("Fetched copilots from copilot page :", res.data);
      setCopilots(res.data);
      // Creating, deleting or archiving a copilot changes the plan usage.
      queryClient.invalidateQueries({ queryKey: billingKeys.limits() });
      if (res.data.length === 0) {
        router.push("/dashboard/copilots/new");
      }
    } catch {
      setCopilots([]);
    } finally {
      setLoading(false);
    }
  }

  const planId = currentPlanId(limits);
  const tiers = higherTiers(plans, planId);

  async function handleCreate() {
    if (limits && !limits.hasActivePlan) {
      router.push("/dashboard/billing?required=plan");
      return;
    }

    if (quota?.atLimit) {
      setLimitDialogOpen(true);
      return;
    }

    // Re-check right before entering the wizard so a stale cached count (e.g.
    // right after creating the last allowed copilot) never lets the user fill
    // the whole wizard only to fail on save. Fail open if the check fails.
    try {
      const fresh = await refetchLimits();
      if (copilotQuota(fresh.data)?.atLimit) {
        setLimitDialogOpen(true);
        return;
      }
    } catch {
      // Ignore and continue — the backend still enforces the limit.
    }

    router.push("/dashboard/copilots/new");
  }

  // Filter copilots based on status and search
  const filtered = copilots.filter((c) => {
    const matchesStatus =
      status === "all" || c.status.toLowerCase() === status.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort filtered copilots
  const sorted = [...filtered].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Calculate pagination
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = sorted.slice(startIndex, endIndex);

  // Reset page when filters change, and when the viewport-derived page
  // size changes (otherwise a resize leaves a stale page offset)
  useEffect(() => {
    setCurrentPage(1);
  }, [status, search, perPage]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 py-4 sm:py-5 [@media(min-height:1081px)]:flex [@media(min-height:1081px)]:min-h-full [@media(min-height:1081px)]:flex-col">
      {/* Header */}
      <DashboardHeader
        title="Copilots"
        description="Manage your automated outreach campaigns."
        actionLabel="Create New Copilot"
        onAction={handleCreate}
      />


      {/* Toolbar */}
      <div className="w-full p-2 border border-[#E2E8F0] mb-3 bg-white rounded-lg">
        <CopilotToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Content */}
      <div className="min-h-0 [@media(min-height:1081px)]:flex [@media(min-height:1081px)]:flex-1 [@media(min-height:1081px)]:flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Loading...
          </div>
        ) : copilots.length === 0 ? (
          <div className="  p-14 text-center ">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send size={22} className="text-gray-500" />
            </div>
            <h2 className="font-bold text-gray-900 mb-2">No copilots yet</h2>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
              Build your first copilot to start sending personalized emails at
              scale.
            </p>
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Plus size={15} /> Create New Copilot
            </button>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="  p-10 text-center ">
            <p className="text-sm text-gray-500">
              No copilots match your filter.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="min-h-105 overflow-y-auto [@media(min-height:1081px)]:flex-1 [@media(max-height:1080px)]:max-h-[calc(100dvh-270px)]">
            <CopilotCardsList
              copilots={paginatedData}
              onRefresh={fetchCopilots}
            />
          </div>
        ) : (
          <CopilotTable copilots={paginatedData} onRefresh={fetchCopilots} />
        )}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-4">
          <TemplatesPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <CopilotLimitDialog
        open={limitDialogOpen}
        currentPlanId={planId}
        used={quota?.used ?? 0}
        max={quota?.max ?? 0}
        tiers={tiers}
        onClose={() => setLimitDialogOpen(false)}
      />
    </div>
  );
}
