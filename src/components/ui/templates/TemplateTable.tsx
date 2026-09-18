import { FileText, Plus, Search } from "lucide-react";
import TemplateRow from "./TemplateRow";
import type { Template } from "@/lib/types/templates";

export const CATEGORIES = [
  "All",
  "Cold Outreach",
  "Follow-up",
  "Re-engagement",
  "Partnership",
  "Other",
];

const TABLE_HEADERS = [
  "Template name",
  "Steps",
  "Last updated",
  "Used in",
  "Reply rate",
  "Status",
  "Actions",
];

const COLUMNS = "1.5fr 0.5fr 1fr 1fr 0.8fr 0.7fr 0.5fr";

interface TemplateTableProps {
  templates: Template[];
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

export default function TemplateTable({
  templates,
  filteredCount,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  loading = false,
}: TemplateTableProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="font-bold text-lg leading-6 text-[#0F172A]">
          Your Email Templates ({filteredCount})
        </h2>
        <div className="relative w-full sm:w-80">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59637C]"
          />
          <input
            className="w-full h-10 border border-[#E2E8F0] rounded-lg pl-10 pr-4 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            style={{ color: "#59637C" }}
            placeholder="Search email template..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table Header */}
      <div
        className="hidden lg:grid px-5 py-3 border-b border-[#E2E8F0]"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        {TABLE_HEADERS.map((col) => (
          <span
            key={col}
            className="font-bold text-sm leading-5 text-[#0F172A]"
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows / Empty / Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#59637C]">
          Loading templates…
        </div>
      ) : filteredCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--color-primary-light)" }}
          >
            <FileText
              size={32}
              className="sm:hidden"
              style={{ color: "var(--color-primary)" }}
            />
            <FileText
              size={40}
              className="hidden sm:block"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <h3 className="font-bold mb-2 text-center text-lg leading-7 text-[#0F172A]">
            No Active Email Templates
          </h3>
          <p className="mb-6 text-center text-sm leading-5 font-light text-[#59637C]">
            Create an email template for easier access later
          </p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} />
            Create New Email Template
          </button>
        </div>
      ) : (
        <div>
          {templates.map((t) => (
            <TemplateRow
              key={t.id}
              template={t}
              onEdit={() => onEdit(t)}
              onDelete={() => onDelete(t.id)}
              onDuplicate={() => onDuplicate(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
