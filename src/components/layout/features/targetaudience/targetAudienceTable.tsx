import { EllipsisVertical, X, Search, Target } from "lucide-react";
import type { TargetAudience } from "@/store/copilotStore";
import TargetAudienceMenu from "@/components/ui/targetAudience/TargetAudienceMenu";
import TemplatesPagination from "@/components/ui/templates/Pagination";
import { useRowsPerPage } from "@/lib/hooks";
import { formatDate } from "@/lib/helpers";
import { useState } from "react";

export interface TargetAudienceTableProps {
  targetAudiences: TargetAudience[];
  onRowMenuClick?: (audience: TargetAudience) => void;
  onEdit?: (audience: TargetAudience) => void;
  onDelete?: (audience: TargetAudience) => void;
  onDuplicate?: (audience: TargetAudience) => void;
  onCreateNew?: () => void;
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US");
}

const TABLE_HEADERS = [
  "Target Audience name",
  "Industry",
  "Country",
  "City",
  "Est. Audience Size",
  "Last updated",
  "Actions",
];

const COLUMNS = "1.4fr 1.1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.4fr";

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full sm:w-80">
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59637C]"
      />
      <input
        type="text"
        placeholder="Search target audience..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search target audiences by name"
        className="w-full h-10 border border-[#E2E8F0] rounded-lg pl-10 pr-4 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        style={{ color: "#59637C" }}
      />
    </div>
  );
}

function AudienceRow({
  audience,
  openMenuId,
  setOpenMenuId,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  audience: TargetAudience;
  openMenuId: number | null;
  setOpenMenuId: (id: number | null) => void;
  onEdit?: (audience: TargetAudience) => void;
  onDelete?: (audience: TargetAudience) => void;
  onDuplicate?: (audience: TargetAudience) => void;
}) {
  const menu = (
    <>
      <button
        type="button"
        onClick={() =>
          setOpenMenuId(openMenuId === audience.id ? null : audience.id)
        }
        className="text-gray-300 hover:text-gray-500 transition-colors"
        aria-label="Row actions"
      >
        {openMenuId === audience.id ? (
          <X size={18} />
        ) : (
          <EllipsisVertical size={18} />
        )}
      </button>
      {openMenuId === audience.id && (
        <TargetAudienceMenu
          id={audience.id}
          onDuplicate={(id) => {
            console.log("Duplicate clicked for audience:", audience);
            onDuplicate?.(audience);
            setOpenMenuId(null);
          }}
          onEdit={(id) => {
            onEdit?.(audience);
            setOpenMenuId(null);
          }}
          onDelete={(id) => {
            onDelete?.(audience);
            setOpenMenuId(null);
          }}
        />
      )}
    </>
  );

  return (
    <>
      {/* Desktop Row */}
      <div
        className="hidden lg:grid items-center px-5 py-6 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <span className="font-semibold truncate pr-4 text-sm text-[#0F172A]">
          {audience.name || "—"}
        </span>

        <span className="min-w-0 truncate text-sm text-[#0F172A]">
          {audience.searchQuery || "—"}
        </span>

        <span className="text-sm text-[#0F172A]">{audience.country || "—"}</span>

        <span className="text-sm text-[#0F172A]">{audience.city || "—"}</span>

        <span className="text-sm text-[#0F172A]">
          {formatCount(audience.resultsCount)}
        </span>

        <span className="text-sm text-[#0F172A]">
          {formatDate(audience.updatedAt)}
        </span>

        <div className="flex items-center relative">{menu}</div>
      </div>

      {/* Mobile Row */}
      <div className="lg:hidden px-4 py-5 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold truncate text-sm text-[#0F172A]">
                {audience.name || "—"}
              </span>
            </div>
            <div className="truncate text-xs text-[#59637C]">
              {audience.searchQuery || "—"}
            </div>
            <div className="mt-0.5 text-xs text-[#59637C]">
              {[audience.country, audience.city].filter(Boolean).join(" · ") ||
                "—"}{" "}
              · {formatCount(audience.resultsCount)} leads
            </div>
            <div className="mt-0.5 text-xs text-[#59637C]">
              {formatDate(audience.updatedAt)}
            </div>
          </div>
          <div className="relative shrink-0">{menu}</div>
        </div>
      </div>
    </>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      >
        <Target
          size={32}
          className="sm:hidden"
          style={{ color: "var(--color-primary)" }}
        />
        <Target
          size={40}
          className="hidden sm:block"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
      <h3 className="font-bold mb-2 text-center text-lg leading-7 text-[#0F172A]">
        No Target Audiences Found
      </h3>
      <p className="mb-6 text-center text-sm leading-5 font-light text-[#59637C]">
        Create a target audience for easier access later
      </p>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Create New Target Audience
        </button>
      )}
    </div>
  );
}

function TargetAudienceTable({
  targetAudiences = [],
  onEdit,
  onDelete,
  onRowMenuClick,
  onDuplicate,
  onCreateNew,
}: TargetAudienceTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Same responsive rows-per-page as the templates table
  const perPage = useRowsPerPage(10);

  const filtered = targetAudiences.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = filtered.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage,
  );

  function handleSearchChange(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="bg-white border border-[#E2E8F0] rounded-lg">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-lg leading-6 text-[#0F172A]">
            Your Target Audiences ({filtered.length})
          </h2>
          <SearchInput value={query} onChange={handleSearchChange} />
        </div>

        {/* Desktop Table Header */}
        <div
          className="hidden lg:grid px-5 py-3 border-b border-[#E2E8F0]"
          style={{ gridTemplateColumns: COLUMNS }}
        >
          {TABLE_HEADERS.map((col) => (
            <span
              key={col}
              className="font-normal text-xs leading-5 text-[#94A3B8]"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows / Empty */}
        {filtered.length === 0 ? (
          <EmptyState onCreateNew={onCreateNew} />
        ) : (
          <div>
            {paginatedData.map((audience) => (
              <AudienceRow
                key={audience.id}
                audience={audience}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-4">
          <TemplatesPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}

export default TargetAudienceTable;
