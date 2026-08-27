import { Search, ArrowUpDown } from "lucide-react";
import React from "react";

export type SortOrder = "asc" | "desc";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  placeholder?: string;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  placeholder = "Search...",
}: SearchAndFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-48">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          className="w-full border border-gray-200 focus:outline-primary focus:ring-2 focus:ring-primary rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSortChange(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          title={`Sort by creation date (${sortOrder === "desc" ? "Newest first" : "Oldest first"})`}
        >
          <ArrowUpDown size={14} className="text-gray-500" />
          <span>Date: {sortOrder === "desc" ? "Newest" : "Oldest"}</span>
        </button>
      </div>
    </div>
  );
}
