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
import Link from "next/link";

export default function CopilotsPage() {
  const router = useRouter();
  const [copilots, setCopilots] = useState<Copilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Pagination state — same responsive rows-per-page as the templates table
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = useRowsPerPage(10);

  useEffect(() => {
    fetchCopilots();
  }, []);

  async function fetchCopilots() {
    try {
      setLoading(true);
      const res = await copilotsApi.getAll();
      console.log("Fetched copilots from copilot page :", res.data);
      setCopilots(res.data);
      if (res.data.length === 0) {
        router.push("/dashboard/copilots/new");
      }
    } catch {
      setCopilots([]);
    } finally {
      setLoading(false);
    }
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [status, search]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 py-4 sm:py-5">
      {/* Header */}
      <DashboardHeader
        title="Copilots"
        description="Manage your automated outreach campaigns."
        actionLabel="Create New Copilot"
        onAction={() => router.push("/dashboard/copilots/new")}
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
          <Link
            href="/dashboard/copilots/new"
            className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> Create New Copilot
          </Link>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="  p-10 text-center ">
          <p className="text-sm text-gray-500">
            No copilots match your filter.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="min-h-105">
          <CopilotCardsList
            copilots={paginatedData}
            onRefresh={fetchCopilots}
          />
        </div>
      ) : (
        <CopilotTable copilots={paginatedData} onRefresh={fetchCopilots} />
      )}

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
    </div>
  );
}
