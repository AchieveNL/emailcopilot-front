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

// ─── Template editor helpers ───────────────────────────────────────────────────

/** Escapes special HTML characters so plain-text is safe inside HTML tags. */
export const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

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
