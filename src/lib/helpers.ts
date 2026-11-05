import { ChartSpline, Rocket, Send, type LucideIcon } from "lucide-react";
import { isAxiosError } from "axios";

/**
 * Extracts a human-readable message from a failed API call so the UI can show
 * the backend's own reason (e.g. "OAuth token needs reconnecting") instead of
 * a generic failure string. Falls back to `fallback` when nothing usable is
 * present.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const message = data?.message || data?.error;
    if (typeof message === "string" && message.trim()) return message.trim();
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

export const handlePlanNameChange = (planName: string): string => {
  switch (planName.toLocaleLowerCase()) {
    case "starter":
      return "Economy";
    case "growth":
      return "Business Class";
    case "scale":
      return "First Class";
    default:
      return "Unknown Plan";
  }
};

/** Month-name date ("Sep 22, 2026") — the standard table date format. */
export function formatDate(apiDateString?: string | null): string {
  if (!apiDateString) return "—";
  const date = new Date(apiDateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(apiDateString: string, includeTime = true) {
  if (!apiDateString) return "";
  const date = new Date(apiDateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 -> 12
  const hoursStr = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}, ${hoursStr}:${minutes} ${ampm}`;
}

export type Period = "Last 7 days" | "Last 14 days" | "Last 30 days";

export function periodToDays(period: Period): number {
  return period === "Last 7 days" ? 7 : period === "Last 14 days" ? 14 : 30;
}

type ChartItem = {
  date: string | Date;
  value: number;
};

type ChartResult = {
  data: {
    label: string;
    value: number;
    date: string;
  }[];
  total: number;
  previousTotal: number;
  percentageChange: number;
};

export function getPeriodStats(
  data: ChartItem[],
  period: Period,
  referenceDate: Date = new Date(),
): ChartResult {
  const currentStart = new Date(referenceDate);
  currentStart.setHours(0, 0, 0, 0);

  const currentEnd = new Date(referenceDate);
  currentEnd.setHours(23, 59, 59, 999);

  const days = periodToDays(period);

  currentStart.setDate(currentStart.getDate() - (days - 1));

  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - days);

  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);
  previousEnd.setHours(23, 59, 59, 999);

  const normalizedData = data.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));

  const currentData = normalizedData.filter(
    (item) => item.date >= currentStart && item.date <= currentEnd,
  );

  const previousData = normalizedData.filter(
    (item) => item.date >= previousStart && item.date <= previousEnd,
  );

  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  const previousTotal = previousData.reduce((sum, item) => sum + item.value, 0);

  const percentageChange =
    previousTotal === 0
      ? total > 0
        ? 100
        : 0
      : ((total - previousTotal) / previousTotal) * 100;

  const chartData = currentData.map((item) => ({
    date: item.date.toISOString(),
    label: item.date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    value: item.value,
  }));

  return {
    data: chartData,
    total,
    previousTotal,
    percentageChange: Number(percentageChange.toFixed(2)),
  };
}

export function getDateRange(days = 7): string {
  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (days - 1));

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });

  return `${formatDate(startDate)} - ${formatDate(today)}`;
}

/* ------------------------------------------------------------------ */
/* Billing                                                             */
/* ------------------------------------------------------------------ */

/** Discount applied to annual billing, in percent. */
export const ANNUAL_DISCOUNT_PERCENT = 20;

// Omar note: Annual pricing is derived on the client (monthly × 12 × 0.8 = "Save 20%") purely so
// the Billing UI matches the approved design. The backend contract is still monthly-only —
// POST /billing/subscribe accepts a planId and nothing else — so picking "Annual" and checking
// out will still create a MONTHLY Mollie subscription at the monthly price. Before this goes
// live, the backend must expose annual plan/price IDs (or accept an `interval` on
// /billing/subscribe) and this helper must be replaced by the real price coming from
// GET /billing/plans.
export function annualPriceFromMonthly(monthly: number): number {
  return (
    Math.round(monthly * 12 * ((100 - ANNUAL_DISCOUNT_PERCENT) / 100) * 100) /
    100
  );
}

export function planAnnualPrice(plan: {
  price: number;
  annual?: { price?: number | null } | null;
}): number {
  if (plan.annual?.price != null) return plan.annual.price;
  return annualPriceFromMonthly(plan.price);
}

const FEATURE_FIXES: Record<string, string> = {
  "1 Copilots": "1 Copilot",
};

export function formatPlanFeature(feature: string): string {
  return FEATURE_FIXES[feature] ?? feature;
}

/** Short marketing line shown under each plan name on the billing page. */
export function planTagline(planId: string): string {
  switch (planId.toLocaleLowerCase()) {
    case "starter":
      return "Perfect for individuals.";
    case "growth":
      return "Perfect for growing businesses.";
    case "scale":
      return "For power users and teams";
    default:
      return "";
  }
}

/**
 * Icon used to represent a plan, mirroring the marketing pricing section.
 * A lookup table rather than a factory function so consumers read the component
 * off a constant instead of creating one during render.
 */
export const PLAN_ICONS: Record<string, LucideIcon> = {
  starter: Send,
  growth: ChartSpline,
  scale: Rocket,
};

/** "May 24, 2026" — the date format used across the billing screens. */
export function formatBillingDate(apiDateString?: string | null): string {
  if (!apiDateString) return "—";
  const date = new Date(apiDateString);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The API has no human-readable invoice number, so derive a stable one from the
 * date the invoice was settled (falling back to its creation date): "Inv-2026-04-24".
 */
export function formatInvoiceNumber(invoice: {
  paidAt?: string | null;
  createdAt: string;
}): string {
  const date = new Date(invoice.paidAt || invoice.createdAt);
  if (Number.isNaN(date.getTime())) return "—";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `Inv-${year}-${month}-${day}`;
}

// ─── Template editor helpers ───────────────────────────────────────────────────

/** Escapes special HTML characters so plain-text is safe inside HTML tags. */
export const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// ─── Flight schedule naming ────────────────────────────────────────────────────

/** Strips fork/copy suffixes so "workdays v3" and "workdays (edited)" → "workdays". */
export function baseScheduleName(name: string): string {
  return name
    .replace(/\s*\(edited\)\s*$/i, "")
    .replace(/\s*v\d+\s*$/i, "")
    .replace(/\s*\(copy(?:\s*\d+)?\)\s*$/i, "")
    .trim();
}

/**
 * Numbered fork name: "workdays" (v1) → "workdays v2" → "workdays v3".
 * Takes the highest existing version of the same base so deleted versions
 * are never reused while copies of that base still exist.
 */
export function nextScheduleCopyName(
  name: string,
  existingNames: string[],
): string {
  const base = baseScheduleName(name) || "Schedule";
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}(?:\\s+v(\\d+))?$`, "i");

  let highest = 1;
  for (const existing of existingNames) {
    const match = pattern.exec(existing.trim());
    if (!match) continue;
    highest = Math.max(highest, match[1] ? Number(match[1]) : 1);
  }

  return `${base} v${highest + 1}`;
}

// ─── Timezones ─────────────────────────────────────────────────────────────────

/** The visitor's own IANA zone, resolved by the browser. */
export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** True when the runtime's timezone data recognises this IANA name. */
export function isValidTimeZone(timeZone?: string | null): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

/**
 * Offset in minutes for a zone at a given instant, using the browser's own
 * timezone database — so DST is applied instead of a frozen winter offset.
 */
export function getTimeZoneOffsetMinutes(
  timeZone: string,
  date: Date = new Date(),
): number {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(date);
    const valueOf = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);

    const asUTC = Date.UTC(
      valueOf("year"),
      valueOf("month") - 1,
      valueOf("day"),
      valueOf("hour") % 24,
      valueOf("minute"),
      valueOf("second"),
    );

    return Math.round((asUTC - date.getTime()) / 60000);
  } catch {
    return 0;
  }
}

/** 120 → "GMT+2:00", -210 → "GMT-3:30", 345 → "GMT+5:45". */
export function formatGmtOffset(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const rest = absolute % 60;
  return `GMT${sign}${hours}:${String(rest).padStart(2, "0")}`;
}

/**
 * Converts a plain-text or already-HTML body string into TipTap-ready HTML.
 * - If the value already starts with `<` it is returned as-is.
 * - Otherwise double-newlines become `<p>` tags and single newlines become `<br />`.
 */
export const toEditorContent = (value: string): string => {
  if (!value) return "";
  const trimmedValue = value.trim();
  if (trimmedValue.startsWith("<")) {
    return value;
  }
  return value
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const lines = paragraph.split(/\n/).map(escapeHtml);
      return `<p>${lines.join("<br />")}</p>`;
    })
    .join("");
};
