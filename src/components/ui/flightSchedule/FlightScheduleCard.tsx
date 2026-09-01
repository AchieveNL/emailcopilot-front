"use client";

// ─── Types matching backend schema ────────────────────────────────────────────

export interface Schedule {
  id?: number;
  name: string;
  sendLimit: number | null;
  sendLimitActive: boolean;
  activeDays: number[]; // 1=Mon … 7=Sun
  sendingHours: { start: string; end: string };
  sendingHoursActive: boolean;
  timezone: string;
  createdAt?: string;
}

interface FlightScheduleCardProps {
  schedules: Schedule;
  showEditAndDeleteButton?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS: Record<number, string> = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

function formatActiveDays(days: number[]): string {
  const sorted = [...days].sort();
  if (sorted.length === 7) return "All days";
  if (sorted.length === 5 && [1, 2, 3, 4, 5].every((d) => sorted.includes(d))) {
    return "Weekdays";
  }
  return sorted.map((d) => DAY_LABELS[d] ?? d).join(", ");
}

// ─── Component ────────────────────────────────────────────────────────────────

function FlightScheduleCard({
  schedules,
  showEditAndDeleteButton = false,
  onEdit,
  onDelete,
}: FlightScheduleCardProps) {
  const {
    name,
    sendLimit,
    sendLimitActive,
    sendingHours,
    sendingHoursActive,
    activeDays,
    timezone,
  } = schedules;

  const fields = [
    {
      label: "Daily send limit",
      value:
        sendLimitActive && sendLimit != null
          ? `${sendLimit} / day`
          : "Unlimited",
    },
    {
      label: "Sending hours",
      value: sendingHoursActive
        ? `From ${sendingHours.start} to ${sendingHours.end}`
        : "24/7",
    },
    { label: "Active days", value: formatActiveDays(activeDays) },
    { label: "Default timezone", value: timezone },
  ];

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-md  p-5">
      <h3 className="text-sm font-semibold text-gray-900">
        {name || "Flight Schedule"}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{field.label}</span>
            <span className="text-sm font-medium text-gray-900 truncate">
              {field.value}
            </span>
          </div>
        ))}
      </div>
      {showEditAndDeleteButton && (
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 mt-4 pt-4">
          <button
            onClick={() => {
              onEdit?.();
            }}
            className="w-fit rounded-lg  bg-success/5 py-1 px-3 text-sm font-medium text-success hover:bg-success/10 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete?.();
            }}
            className="w-fit rounded-lg  bg-error/5 py-1 px-3 text-sm font-medium text-error hover:bg-error/10 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default FlightScheduleCard;
