import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg py-2 px-3 sm:px-4 flex items-center justify-center gap-1 sm:gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={14} className="text-[#59637C]" />
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-xs text-[#59637C]"
          >
            .....
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border text-xs font-semibold transition-colors"
            style={
              page === currentPage
                ? {
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    backgroundColor: "var(--color-primary-light)",
                  }
                : {
                    borderColor: "#E2E8F0",
                    color: "#0F172A",
                    backgroundColor: "#FFFFFF",
                  }
            }
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={14} className="text-[#59637C]" />
      </button>
    </div>
  );
}
