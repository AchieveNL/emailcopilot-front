"use client";

import { Search, Plus, Calendar } from "lucide-react";
import FlightScheduleMenu from "@/components/ui/flightSchedule/FlightScheduleMenu";
import CopilotStatus from "@/components/ui/CopilotStatus";
import type { Schedule } from "@/components/ui/flightSchedule/FlightScheduleCard";

export interface FlightScheduleRow extends Schedule {
  usedBy: number;
}

interface FlightScheduleTableProps {
  schedules: FlightScheduleRow[];
  filteredCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onDuplicate: (schedule: Schedule) => void;
  onCreateNew: () => void;
  loading?: boolean;
}

const TABLE_HEADERS = [
  "Flight schedule name",
  "Days",
  "Time",
  "Timezone",
  "Used by",
  "Status",
  "Actions",
];

const COLUMNS = "1.4fr 0.9fr 1fr 1.2fr 0.9fr 0.8fr 0.4fr";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Compact day ranges: [1-5] → "Mon-Fri", [6,7] → "Sat-Sun", [1-7] → "Mon-Sun" */
function formatDays(days: number[]): string {
  if (!Array.isArray(days) || days.length === 0) return "—";
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return "Mon-Sun";

  const runs: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (const d of sorted.slice(1)) {
    if (d === prev + 1) {
      prev = d;
      continue;
    }
    runs.push(
      start === prev
        ? DAY_LABELS[start - 1]
        : `${DAY_LABELS[start - 1]}-${DAY_LABELS[prev - 1]}`,
    );
    start = prev = d;
  }
  runs.push(
    start === prev
      ? DAY_LABELS[start - 1]
      : `${DAY_LABELS[start - 1]}-${DAY_LABELS[prev - 1]}`,
  );
  return runs.join(", ");
}

function formatTime(schedule: Schedule): string {
  if (!schedule.sendingHoursActive || !schedule.sendingHours) return "24/7";
  return `${schedule.sendingHours.start} - ${schedule.sendingHours.end}`;
}

function formatUsedBy(count: number): string {
  return `${count} ${count === 1 ? "copilot" : "copilots"}`;
}

function ScheduleRow({
  schedule,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  schedule: FlightScheduleRow;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onDuplicate: (schedule: Schedule) => void;
}) {
  const actions = (
    <FlightScheduleMenu
      onEdit={() => onEdit(schedule)}
      onDelete={() => onDelete(schedule)}
      onDuplicate={() => onDuplicate(schedule)}
    />
  );

  return (
    <>
      {/* Desktop Row */}
      <div
        className="hidden lg:grid items-center px-5 py-6 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <span className="font-semibold truncate pr-4 text-sm text-[#0F172A]">
          {schedule.name || "—"}
        </span>

        <span className="text-sm text-[#0F172A]">
          {formatDays(schedule.activeDays)}
        </span>

        <span className="text-sm text-[#0F172A]">{formatTime(schedule)}</span>

        <span className="min-w-0 truncate text-sm text-[#0F172A]">
          {schedule.timezone || "—"}
        </span>

        <span className="text-sm text-[#0F172A]">
          {formatUsedBy(schedule.usedBy)}
        </span>

        <span>
          <CopilotStatus status="draft" />
        </span>

        <div className="flex items-center">{actions}</div>
      </div>

      {/* Mobile Row */}
      <div className="lg:hidden px-4 py-5 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold truncate text-sm text-[#0F172A]">
                {schedule.name || "—"}
              </span>
              <CopilotStatus status="draft" isSmall />
            </div>
            <div className="truncate text-xs text-[#59637C]">
              {formatDays(schedule.activeDays)} · {formatTime(schedule)}
            </div>
            <div className="mt-0.5 text-xs text-[#59637C]">
              {schedule.timezone || "—"} · {formatUsedBy(schedule.usedBy)}
            </div>
          </div>
          <div className="relative shrink-0">{actions}</div>
        </div>
      </div>
    </>
  );
}

function EmptyState({
  onCreateNew,
  isFiltered,
}: {
  onCreateNew: () => void;
  isFiltered: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      >
        <Calendar
          size={32}
          className="sm:hidden"
          style={{ color: "var(--color-primary)" }}
        />
        <Calendar
          size={40}
          className="hidden sm:block"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
      <h3 className="font-bold mb-2 text-center text-lg leading-7 text-[#0F172A]">
        {isFiltered ? "No Flight Schedules Found" : "No Flight Schedules Yet"}
      </h3>
      <p className="mb-6 text-center text-sm leading-5 font-light text-[#59637C]">
        {isFiltered
          ? "Try adjusting your search or filters"
          : "Create a flight schedule for easier access later"}
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        <Plus size={15} />
        Create New Flight Schedule
      </button>
    </div>
  );
}

export default function FlightScheduleTable({
  schedules,
  filteredCount,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateNew,
  loading = false,
}: FlightScheduleTableProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#E2E8F0]">
        <h2 className="font-bold text-lg leading-6 text-[#0F172A]">
          Your Flight Schedules ({filteredCount})
        </h2>
        <div className="relative w-full sm:w-80">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59637C]"
          />
          <input
            type="text"
            placeholder="Search flight schedule..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search flight schedules by name"
            className="w-full h-10 border border-[#E2E8F0] rounded-lg pl-10 pr-4 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            style={{ color: "#59637C" }}
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
            className="font-normal text-xs leading-5 text-[#94A3B8]"
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows / Empty / Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-[#59637C]">
          Loading flight schedules…
        </div>
      ) : filteredCount === 0 ? (
        <EmptyState
          onCreateNew={onCreateNew}
          isFiltered={schedules.length > 0}
        />
      ) : (
        <div>
          {schedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
