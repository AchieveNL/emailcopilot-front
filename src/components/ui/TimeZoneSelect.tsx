"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import ct from "countries-and-timezones";
import {
  formatGmtOffset,
  getTimeZoneOffsetMinutes,
  isValidTimeZone,
} from "@/lib/helpers";

const POPOVER_MAX_HEIGHT = 340;

function buildTimeZoneNames(current?: string): string[] {
  const names = new Set<string>();

  if (typeof Intl.supportedValuesOf === "function") {
    for (const name of Intl.supportedValuesOf("timeZone")) names.add(name);
  } else {
    for (const name of Object.keys(ct.getAllTimezones())) names.add(name);
  }

  // Some ICU versions omit these even though they are valid zones — and
  // "UTC" is what the backend stores for default schedules.
  names.add("UTC");
  if (current) names.add(current);

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function offsetOf(timeZone: string): number | undefined {
  return isValidTimeZone(timeZone)
    ? getTimeZoneOffsetMinutes(timeZone)
    : undefined;
}

function displayName(timeZone: string): string {
  return timeZone.replace("/", " - ");
}

function formatLabel(timeZone: string, offset?: number): string {
  const name = displayName(timeZone);
  return offset === undefined
    ? `${name} (unrecognized)`
    : `${name} (${formatGmtOffset(offset)})`;
}

/** "America/New_York" → "america new york", so city-name searches match. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface TimeZoneSelectProps {
  value: string;
  onChange: (timeZone: string) => void;
  className?: string;
}

export default function TimeZoneSelect({
  value,
  onChange,
  className,
}: TimeZoneSelectProps) {
  // Only the incoming value may be missing from the generated list.
  const [initialValue] = useState(value);

  // Start with just the current zone so the server and the first client
  // render agree; the full list (built from the browser's timezone database,
  // which may differ from the server's ICU) is filled in after mount.
  const [timeZones, setTimeZones] = useState<string[]>(
    initialValue ? [initialValue] : [],
  );
  const [offsets, setOffsets] = useState<Map<string, number>>(() => {
    const initial = offsetOf(initialValue);
    return new Map(
      initial === undefined ? [] : [[initialValue, initial] as [string, number]],
    );
  });

  useEffect(() => {
    const names = buildTimeZoneNames(initialValue);
    const map = new Map<string, number>();
    for (const name of names) {
      const offset = offsetOf(name);
      if (offset !== undefined) map.set(name, offset);
    }
    setTimeZones(names);
    setOffsets(map);
  }, [initialValue]);

  // The live value may be an alias the browser's canonical list omits (for
  // example Asia/Kolkata vs Asia/Calcutta). Keep it selectable so the field
  // can never fall back to the first entry of the list.
  const options = useMemo(() => {
    if (!value || timeZones.includes(value)) return timeZones;
    return [value, ...timeZones];
  }, [timeZones, value]);

  const extraOffset = useMemo(
    () => (value && !timeZones.includes(value) ? offsetOf(value) : undefined),
    [timeZones, value],
  );

  const offsetFor = useCallback(
    (timeZone: string) =>
      offsets.get(timeZone) ??
      (timeZone === value ? extraOffset : undefined),
    [offsets, value, extraOffset],
  );

  // ── Popover state ──────────────────────────────────────────────────────────

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const filtered = useMemo(() => {
    const tokens = normalize(query).split(" ").filter(Boolean);
    if (!tokens.length) return options;
    return options.filter((timeZone) => {
      const haystack = normalize(timeZone);
      return tokens.every((token) => haystack.includes(token));
    });
  }, [options, query]);

  const reposition = useCallback((estimatedHeight = POPOVER_MAX_HEIGHT) => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const width = Math.min(
      Math.max(rect.width, 340),
      window.innerWidth - 16,
    );
    const height = Math.min(
      popoverRef.current?.offsetHeight || estimatedHeight,
      window.innerHeight - 16,
    );
    const below = rect.bottom + 4;
    const above = rect.top - height - 4;
    const top =
      below + height > window.innerHeight - 8 && above > 8 ? above : below;
    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - width - 8),
    );

    setPosition({ top, left, width });
  }, []);

  const openPicker = () => {
    const selected = options.indexOf(value);
    setQuery("");
    setHighlighted(selected >= 0 ? selected : 0);
    reposition();
    setOpen(true);
  };

  const closePicker = () => {
    setOpen(false);
    setQuery("");
  };

  const select = (timeZone: string) => {
    onChange(timeZone);
    closePicker();
  };

  // Keep the panel anchored while the page (or the modal body) scrolls.
  useEffect(() => {
    if (!open) return;

    const handleViewportChange = () => reposition();
    window.addEventListener("resize", handleViewportChange);
    document.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      document.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, reposition]);

  // Measure the rendered panel once so it can flip above the trigger.
  useEffect(() => {
    if (open) reposition();
  }, [open, filtered.length, reposition]);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      closePicker();
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Keep the highlighted (initially: selected) zone visible.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(
      `[data-index="${highlighted}"]`,
    );
    if (!list || !item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < listRect.top) {
      list.scrollTop += itemRect.top - listRect.top;
    } else if (itemRect.bottom > listRect.bottom) {
      list.scrollTop += itemRect.bottom - listRect.bottom;
    }
  }, [open, highlighted]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) =>
        Math.min(current + 1, Math.max(filtered.length - 1, 0)),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      // Never let Enter submit the surrounding form.
      event.preventDefault();
      const timeZone = filtered[highlighted];
      if (timeZone) select(timeZone);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePicker();
    } else if (event.key === "Tab") {
      closePicker();
    }
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        ref={triggerRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closePicker() : openPicker())}
        className="appearance-none w-full px-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm text-left truncate focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800"
      >
        {formatLabel(value, offsetFor(value))}
      </button>
      <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[9999] bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <div className="relative border-b border-slate-100 p-2">
              <Search
                size={14}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                autoFocus
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-activedescendant={
                  filtered[highlighted]
                    ? optionId(highlighted)
                    : undefined
                }
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlighted(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search timezone..."
                className="w-full rounded-md border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label="Timezones"
              className="max-h-64 overflow-y-auto py-1"
            >
              {timeZones.length <= 1 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">
                  Loading timezones...
                </li>
              ) : filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">
                  No timezone found.
                </li>
              ) : (
                filtered.map((timeZone, index) => {
                  const offset = offsetFor(timeZone);
                  return (
                    <li
                      key={timeZone}
                      id={optionId(index)}
                      data-index={index}
                      role="option"
                      aria-selected={timeZone === value}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlighted(index)}
                      onClick={() => select(timeZone)}
                      className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 text-sm ${
                        index === highlighted
                          ? "bg-primary/10 text-slate-900"
                          : "text-slate-700"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate">{displayName(timeZone)}</span>
                        {timeZone === value && (
                          <Check
                            size={14}
                            className="shrink-0 text-primary"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {offset === undefined
                          ? "unknown"
                          : formatGmtOffset(offset)}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
