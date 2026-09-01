import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { PaginatedMeta } from "@/lib/types";

interface PaginationProps {
  meta: PaginatedMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;

  showLimitSelector?: boolean;
}

export function Pagination({
  meta,
  currentPage,
  onPageChange,
  onLimitChange,

  showLimitSelector = true,
}: PaginationProps) {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4  text-sm">
      {showLimitSelector && (
        <div className="hidden lg:flex w-fit items-center gap-3">
          <span className="text-gray-500">Show</span>
          <div className="relative">
            <select
              value={meta.limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="appearance-none px-4 py-1.5 pr-8 border border-gray-200 rounded-lg text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
          <span className="text-gray-500">results per page .</span>
        </div>
      )}

      <div className="flex flex-1  items-center justify-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {[...Array(Math.min(3, meta.totalPages))].map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border font-medium transition-colors ${
                currentPage === p
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          );
        })}

        {meta.totalPages > 3 && (
          <span className="w-8 h-8 flex items-center justify-center text-gray-500 font-medium tracking-widest">
            ....
          </span>
        )}

        {meta.totalPages > 3 && (
          <button
            onClick={() => onPageChange(meta.totalPages)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border font-medium transition-colors ${
              currentPage === meta.totalPages
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {meta.totalPages}
          </button>
        )}

        <button
          onClick={() =>
            onPageChange(Math.min(meta.totalPages, currentPage + 1))
          }
          disabled={currentPage >= meta.totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      {showLimitSelector && (
        <div className="hidden lg:flex w-fit justify-center text-gray-500 whitespace-nowrap">
          Page {meta.page} of {meta.totalPages} ( {meta.total} Total ) .
        </div>
      )}
    </div>
  );
}
