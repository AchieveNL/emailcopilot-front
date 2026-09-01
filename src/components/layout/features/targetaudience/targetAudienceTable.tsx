import { EllipsisVertical, X } from "lucide-react";
import type { TargetAudience } from "@/../store/copilotStore";
import TargetAudienceMenu from "@/components/ui/targetAudience/TargetAudienceMenu";
import TargetAudienceSearchBar from "@/components/ui/targetAudience/TargetAudienceSearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { useState, useEffect } from "react";

export interface TargetAudienceTableProps {
  targetAudiences: TargetAudience[];
  onRowMenuClick?: (audience: TargetAudience) => void;
  onEdit?: (audience: TargetAudience) => void;
  onDelete?: (audience: TargetAudience) => void;
  onDuplicate?: (audience: TargetAudience) => void;
}

// Formats an ISO date string ("2026-07-25T14:08:23.212Z") into "Jul 25,2026"
// to match the "May 24,2026" style shown in the design.
function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "—";
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day},${year}`;
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US");
}

interface Column {
  key: keyof TargetAudience;
  label: string;
}

const COLUMNS: Column[] = [
  { key: "name", label: "Target Audience name" },
  { key: "searchQuery", label: "Industry" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "resultsCount", label: "Est. Audience Size" },
  { key: "updatedAt", label: "Last updated" },
];

function TargetAudienceTable({
  targetAudiences = [],
  onEdit,
  onDelete,
  onRowMenuClick,
  onDuplicate,
}: TargetAudienceTableProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const filtered = targetAudiences.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()),
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  if (!targetAudiences || targetAudiences.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-100">
        <div className="py-16 text-center text-sm text-gray-400">
          No target audiences yet.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full   rounded-lg overflow-hidden flex flex-col gap-4">
      <div className="overflow-x-auto h-fit pb-4 border border-gray-100 bg-white rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between px-6 py-4 border-b border-gray-100">
          <h1 className="text-gray-900 font-bold">
            Your Target Audiences ({targetAudiences.length})
          </h1>
          <TargetAudienceSearchBar onSearch={setQuery} />
        </div>
        <div className="overflow-auto">
          <table className="w-full border-collapse min-h-150  ">
            <thead>
              <tr className="border-b border-gray-100 sticky top-0 z-60 bg-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-[13px] font-medium text-gray-900 px-6 py-4 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((audience) => (
                <tr
                  key={audience.id}
                  className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-[14px] font-medium text-gray-900 whitespace-nowrap">
                    {audience.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 whitespace-nowrap">
                    {audience.searchQuery || "—"}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 whitespace-nowrap">
                    {audience.country || "—"}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 whitespace-nowrap">
                    {audience.city || "—"}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 whitespace-nowrap">
                    {formatCount(audience.resultsCount)}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-gray-600 whitespace-nowrap">
                    {formatDate(audience.updatedAt)}
                  </td>
                  <td className="px-4 py-4 text-right relative">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === audience.id ? null : audience.id,
                        )
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
                          console.log(
                            "Duplicate clicked for audience:",
                            audience,
                          );
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          meta={{ total, page: currentPage, limit, totalPages }}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setCurrentPage(1);
          }}
          showLimitSelector={false}
        />
      )}
    </div>
  );
}

export default TargetAudienceTable;
