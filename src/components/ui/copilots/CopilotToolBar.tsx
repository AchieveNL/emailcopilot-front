import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  Tag,
  Plus,
  List,
  LayoutGrid,
  Check,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Status filter options                                               */
/* ------------------------------------------------------------------ */

export interface StatusOption {
  value: string;
  label: string;
  dotClassName: string; // tailwind bg-* class for the dot
}

export const DEFAULT_STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "All status", dotClassName: "bg-blue-500" },
  { value: "active", label: "Scheduled", dotClassName: "bg-emerald-500" },
  { value: "draft", label: "Draft", dotClassName: "bg-gray-400" },
  { value: "running", label: "In Flight", dotClassName: "bg-blue-500" },
  { value: "paused", label: "Paused", dotClassName: "bg-amber-400" },
  { value: "archived", label: "Archived", dotClassName: "bg-gray-300" },
  { value: "completed", label: "Completed", dotClassName: "bg-gray-500" },
];

/* ------------------------------------------------------------------ */
/* Tag filter options                                                  */
/* ------------------------------------------------------------------ */

export interface TagOption {
  value: string;
  label: string;
  iconClassName?: string; // tailwind text-* class for the tag icon
}

export const DEFAULT_TAG_OPTIONS: TagOption[] = [
  { value: "all", label: "All Tags", iconClassName: "text-blue-500" },
  { value: "aviation", label: "Aviation", iconClassName: "text-teal-400" },
  {
    value: "healthcare",
    label: "Healthcare",
    iconClassName: "text-emerald-400",
  },
  { value: "dental", label: "Dental", iconClassName: "text-gray-300" },
  {
    value: "chiropractors",
    label: "Chiropractors",
    iconClassName: "text-gray-400",
  },
  {
    value: "orthodontics",
    label: "Orthodontics",
    iconClassName: "text-blue-400",
  },
];

export type ViewMode = "list" | "grid";

/* ------------------------------------------------------------------ */
/* Generic outside-click hook                                          */
/* ------------------------------------------------------------------ */

function useClickOutside(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);

  return ref;
}

/* ------------------------------------------------------------------ */
/* Status dropdown                                                     */
/* ------------------------------------------------------------------ */

interface StatusDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: StatusOption[];
}

function StatusDropdown({
  value,
  onChange,
  options = DEFAULT_STATUS_OPTIONS,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {selected.label}
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-42 mt-1.5 w-44 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${opt.dotClassName}`}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tags dropdown                                                       */
/* ------------------------------------------------------------------ */

interface TagsDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: TagOption[];
  onAddCustomTag?: () => void;
}

function TagsDropdown({
  value,
  onChange,
  options = DEFAULT_TAG_OPTIONS,
  onAddCustomTag,
}: TagsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {selected.label}
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-42 mt-1.5 w-48 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Tag
                  size={14}
                  className={opt.iconClassName ?? "text-gray-400"}
                />
                {opt.label}
              </button>
            );
          })}
          {onAddCustomTag && (
            <>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => {
                  onAddCustomTag();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} className="text-gray-400" />
                Custom Tag...
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* View mode toggle                                                    */
/* ------------------------------------------------------------------ */

interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={value === "list"}
        className={`rounded-md p-1.5 transition-colors ${
          value === "list"
            ? "bg-gray-100 text-gray-700"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        className={`rounded-md p-1.5 transition-colors ${
          value === "grid"
            ? "bg-gray-100 text-gray-700"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main toolbar                                                        */
/* ------------------------------------------------------------------ */

export interface CopilotToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  statusOptions?: StatusOption[];
  // tag: string;
  // onTagChange: (value: string) => void;
  // tagOptions?: TagOption[];
  // onAddCustomTag?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchPlaceholder?: string;
  className?: string;
}

function CopilotToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions,
  // tag,
  // onTagChange,
  // tagOptions,
  // onAddCustomTag,
  viewMode,
  onViewModeChange,
  searchPlaceholder = "Search copilots...",
  className = "",
}: CopilotToolbarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <div className="relative min-w-48 flex-1">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <StatusDropdown
        value={status}
        onChange={onStatusChange}
        options={statusOptions}
      />
      {/* <TagsDropdown
        value={tag}
        onChange={onTagChange}
        options={tagOptions}
        onAddCustomTag={onAddCustomTag}
      /> */}
      <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
    </div>
  );
}

export default CopilotToolbar;
