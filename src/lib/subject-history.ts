export const SUBJECT_HISTORY_LIMIT = 20;
export const SUBJECT_HISTORY_EVENT = "emailcopilot:subject-history-changed";

export function subjectHistoryKey(userId: string) {
  return `emailcopilot:subject-history:v1:${userId}`;
}

export function parseSubjectHistory(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item): item is string => typeof item === "string")
      .map((item) => item.trim()).filter(Boolean))].slice(0, SUBJECT_HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export function addSubjectToHistory(history: string[], subject: string): string[] {
  const value = subject.trim();
  if (!value) return history;
  return [value, ...history.filter((item) => item !== value)].slice(0, SUBJECT_HISTORY_LIMIT);
}

export function readSubjectHistory(userId: string | null | undefined): string | null {
  if (!userId || typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(subjectHistoryKey(userId));
  } catch {
    return null;
  }
}

export function rememberSubject(userId: string | null | undefined, subject: string) {
  if (!userId || !subject.trim() || typeof window === "undefined") return;
  try {
    const history = addSubjectToHistory(parseSubjectHistory(readSubjectHistory(userId)), subject);
    window.localStorage.setItem(subjectHistoryKey(userId), JSON.stringify(history));
    window.dispatchEvent(new Event(SUBJECT_HISTORY_EVENT));
  } catch {
    // A blocked or full localStorage must never prevent editing an email.
  }
}
