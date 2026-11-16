import type { FeedbackReply, FeedbackState, FeedbackSuccessEvent, FeedbackTransport } from "./setup-feedback";

export const FEEDBACK_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
export interface FeedbackRecord {
  owner: string;
  version: string;
  revision: number;
  successfulTests: number;
  hasLaunched: boolean;
  snoozedUntil: number | null;
  dismissedThrough: number;
  sequence: number;
  events: Record<string, { sequence: number; offered: boolean }>;
  claimed: Record<string, true>;
  submission: { rating: number; comment?: string; submittedAt: number } | null;
}
export type FeedbackCommand =
  | { operation: "success"; event: FeedbackSuccessEvent }
  | { operation: "claim" | "snooze"; offerId: string }
  | { operation: "submit"; rating: number; comment?: string };

export function createFeedbackRecord(owner: string, version: string): FeedbackRecord {
  return { owner, version, revision: 0, successfulTests: 0, hasLaunched: false,
    snoozedUntil: null, dismissedThrough: 0, sequence: 0, events: {}, claimed: {}, submission: null };
}
export function feedbackState(record: FeedbackRecord, now: number): FeedbackState {
  return { version: record.version, revision: record.revision, successfulTests: record.successfulTests,
    hasLaunched: record.hasLaunched, snoozedUntil: record.snoozedUntil,
    snoozed: record.snoozedUntil !== null && now < record.snoozedUntil,
    submittedAt: record.submission?.submittedAt ?? null };
}

/** Popup preview only: progress lives in this dashboard session and is never saved. */
export function createPreviewFeedbackTransport(owner: string, version: string): FeedbackTransport {
  let record = createFeedbackRecord(owner, version);
  const change = async (command: FeedbackCommand) => {
    const result = applyFeedbackCommand(record, command, Date.now());
    record = result.record;
    return result.reply;
  };
  return {
    load: async () => feedbackState(record, Date.now()),
    record: (event) => change({ operation: "success", event }),
    claim: (offerId) => change({ operation: "claim", offerId }),
    snooze: (offerId) => change({ operation: "snooze", offerId }),
    submit: async () => { throw new Error("Feedback submission is not implemented yet."); },
  };
}

/** Pure transition; only the server supplies `now`. Duplicate events never increment counts. */
export function applyFeedbackCommand(current: FeedbackRecord, command: FeedbackCommand, now: number) {
  const record = structuredClone(current);
  let offerId: string | null = null;
  let claimed = false;
  if (!record.submission) {
    const eligible = () => record.successfulTests >= 2 || record.hasLaunched;
    const snoozed = () => record.snoozedUntil !== null && now < record.snoozedUntil;
    if (command.operation === "success") {
      const key = `${command.event.kind}:${command.event.eventId}`;
      if (!record.events[key]) {
        if (command.event.kind === "test-email") record.successfulTests = Math.min(2, record.successfulTests + 1);
        else record.hasLaunched = true;
        record.sequence++;
        record.events[key] = { sequence: record.sequence, offered: eligible() && !snoozed() };
        record.revision++;
      }
      const event = record.events[key];
      if (event.offered && event.sequence > record.dismissedThrough && !snoozed() && !record.claimed[key]) offerId = key;
    } else if (command.operation === "claim") {
      const event = record.events[command.offerId];
      if (event?.offered && event.sequence > record.dismissedThrough && eligible() && !snoozed() && !record.claimed[command.offerId]) {
        record.claimed[command.offerId] = true;
        record.revision++;
        claimed = true;
      }
    } else if (command.operation === "snooze") {
      const event = record.events[command.offerId];
      if (record.claimed[command.offerId] && event && event.sequence > record.dismissedThrough) {
        record.dismissedThrough = record.sequence;
        record.snoozedUntil = now + FEEDBACK_SNOOZE_MS;
        record.revision++;
      }
    } else if (command.operation === "submit") {
      if (!eligible()) throw new Error("Survey is not eligible");
      record.submission = { rating: command.rating, ...(command.comment ? { comment: command.comment } : {}), submittedAt: now };
      record.snoozedUntil = null;
      record.revision++;
    }
  }
  const reply: FeedbackReply = { state: feedbackState(record, now), offerId, claimed };
  return { record, reply };
}
