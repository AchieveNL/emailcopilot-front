import { ChartSpline, Rocket, Send, type LucideIcon } from "lucide-react";

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

export function formatDateTime(apiDateString: string) {
  const date = new Date(apiDateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

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
  return Math.floor(monthly * 12 * ((100 - ANNUAL_DISCOUNT_PERCENT) / 100));
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
