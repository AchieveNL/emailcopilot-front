/** Compact all-day availability based on the number of distinct selected weekdays. */
export function formatAllDayAvailability(activeDays?: readonly number[] | null): string {
  const count = new Set((activeDays ?? []).filter(day => Number.isInteger(day) && day >= 1 && day <= 7)).size;
  return count === 0 ? "No active days" : `24/${count}`;
}

/** Browser-side test-send guard. This does not control background campaign delivery. */
export function testEmailScheduleBlockReason(schedule: unknown, now = new Date()): string | null {
  // A test may be sent before a flight schedule has been selected.
  if (schedule == null) return null;
  if (typeof schedule !== "object") return "The sending schedule is unavailable. Please check its settings.";
  const s = schedule as Record<string, unknown>;
  const days = s.activeDays;
  if (!Array.isArray(days) || days.length === 0 ||
    days.some(day => !Number.isInteger(day) || day < 1 || day > 7)) {
    return "Select at least one valid active day before sending a test email.";
  }
  if (typeof s.timezone !== "string" || !s.timezone) {
    return "Select a valid schedule timezone before sending a test email.";
  }
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: s.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(now);
  } catch {
    return "Select a valid schedule timezone before sending a test email.";
  }
  const value = (type: string) => parts.find(part => part.type === type)?.value;
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(value("weekday") ?? "") + 1;
  if (!days.includes(day)) return `Test emails are only allowed on the selected active days (${s.timezone}).`;
  if (s.sendingHoursActive != null && typeof s.sendingHoursActive !== "boolean") {
    return "Please check the schedule's sending hours settings before sending a test email.";
  }
  if (s.sendingHoursActive !== true) return null;
  const hours = s.sendingHours as { start?: unknown; end?: unknown } | null | undefined;
  const minutes = (time: unknown, allowMidnightEnd = false) => {
    if (allowMidnightEnd && time === "24:00") return 1440;
    if (typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
  };
  const start = minutes(hours?.start);
  const end = minutes(hours?.end, true);
  if (start === null || end === null || start === end) {
    return "Choose valid, different start and end times before sending a test email.";
  }
  const current = Number(value("hour")) * 60 + Number(value("minute"));
  // Overnight windows still respect the current calendar day's active-day selection.
  const allowed = start < end ? current >= start && current < end : current >= start || current < end;
  return allowed ? null : `Test emails are only allowed from ${hours?.start} to ${hours?.end} (${s.timezone}) on active days.`;
}

export async function sendTestEmailWithinSchedule<T>(
  resolveSchedule: () => unknown | Promise<unknown>,
  send: () => Promise<T>,
  now: () => Date = () => new Date(),
): Promise<T> {
  const schedule = await resolveSchedule();
  const reason = testEmailScheduleBlockReason(schedule, now());
  if (reason) throw new Error(reason);
  return send();
}
