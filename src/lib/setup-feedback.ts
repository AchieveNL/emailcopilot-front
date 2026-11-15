export const SETUP_FEEDBACK_VERSION = "copilot-setup-v3";

export interface FeedbackState {
  version: string;
  revision: number;
  successfulTests: number;
  hasLaunched: boolean;
  snoozedUntil: number | null;
  snoozed: boolean;
  submittedAt: number | null;
}

export interface FeedbackSuccessEvent {
  kind: "test-email" | "launch";
  eventId: string;
  campaignId: string;
}

export interface FeedbackReply {
  state: FeedbackState;
  offerId?: string | null;
  claimed?: boolean;
}

export interface SetupFeedbackPayload {
  version: typeof SETUP_FEEDBACK_VERSION;
  rating: number;
  comment?: string;
}

export interface FeedbackSubmissionResult { status: number; state: FeedbackState }
export interface FeedbackTransport {
  load(): Promise<FeedbackState>;
  record(event: FeedbackSuccessEvent): Promise<FeedbackReply>;
  claim(offerId: string): Promise<FeedbackReply>;
  snooze(offerId: string): Promise<FeedbackReply>;
  submit(payload: SetupFeedbackPayload, submissionId: string): Promise<FeedbackSubmissionResult>;
}

export interface FeedbackOffer {
  offerId: string;
  kind: FeedbackSuccessEvent["kind"];
  campaignId: string;
  claimed: boolean;
}

export interface FeedbackSnapshot {
  progress: FeedbackState | null;
  available: boolean;
  busy: boolean;
  pending: FeedbackOffer | null;
}

export function isFeedbackEligible(state: FeedbackState) {
  return state.successfulTests >= 2 || state.hasLaunched;
}

/** One authenticated dashboard session. Server reads alone never create an offer. */
export class SetupFeedbackController {
  private active = false;
  private listeners = new Set<() => void>();
  private value: FeedbackSnapshot = { progress: null, available: false, busy: false, pending: null };
  private readonly transport: FeedbackTransport;
  private claimInFlight: Promise<boolean> | null = null;

  constructor(transport: FeedbackTransport) { this.transport = transport; }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  snapshot = () => this.value;
  isBusy = () => this.value.busy;
  private update(patch: Partial<FeedbackSnapshot>) {
    this.value = { ...this.value, ...patch };
    this.listeners.forEach((listener) => listener());
  }
  private acceptState(state: FeedbackState) {
    if (!this.active || (this.value.progress && state.revision < this.value.progress.revision)) return false;
    const previous = this.value.progress;
    if (this.value.available && previous && previous.revision === state.revision &&
      previous.snoozed === state.snoozed && previous.submittedAt === state.submittedAt) return true;
    this.update({ progress: state, available: true,
      ...(state.submittedAt || state.snoozed ? { pending: null } : {}),
    });
    return true;
  }
  activate() { this.active = true; void this.refresh(); }
  deactivate() { this.active = false; }
  refresh = async () => {
    try { this.acceptState(await this.transport.load()); }
    catch (error) { this.storageFailed("load", error); }
  };
  private storageFailed(operation: string, error: unknown) {
    if (!this.active) return;
    this.update({ available: false });
    if (process.env.NODE_ENV === "development") {
      const status = error && typeof error === "object" && "response" in error
        ? (error.response as { status?: number } | undefined)?.status : undefined;
      // Do not log request objects, account IDs, tokens or feedback answers.
      console.warn(`[setup-feedback] ${operation} failed${status ? ` (HTTP ${status})` : ""}; automatic prompt is pending storage availability.`);
    }
  }
  private async record(event: FeedbackSuccessEvent) {
    try {
      const reply = await this.transport.record(event);
      if (!this.acceptState(reply.state) || !reply.offerId || reply.state.submittedAt || reply.state.snoozed) return;
      if (!this.value.pending?.claimed) this.update({ pending: { ...event, offerId: reply.offerId, claimed: false } });
    } catch (error) {
      // Feedback storage must not turn a successful campaign action into a failure.
      this.storageFailed("record success", error);
    }
  }
  claimPrompt(): Promise<boolean> {
    if (this.claimInFlight) return this.claimInFlight;
    this.claimInFlight = this.claimOnce().finally(() => { this.claimInFlight = null; });
    return this.claimInFlight;
  }
  private async claimOnce() {
    const pending = this.value.pending;
    if (!this.active || !pending || !this.value.available || this.value.busy) return false;
    if (pending.claimed) {
      await this.refresh();
      return this.value.available && this.value.pending?.offerId === pending.offerId &&
        !this.value.progress?.snoozed && !this.value.progress?.submittedAt;
    }
    try {
      const reply = await this.transport.claim(pending.offerId);
      if (!this.acceptState(reply.state) || this.value.pending?.offerId !== pending.offerId) return false;
      if (!reply.claimed || reply.state.submittedAt || reply.state.snoozed) {
        this.update({ pending: null }); return false;
      }
      this.update({ pending: { ...pending, claimed: true } });
      return true;
    } catch (error) {
      this.storageFailed("claim", error);
      return false;
    }
  }
  async snooze() {
    const offerId = this.value.pending?.offerId;
    if (!offerId) return;
    const reply = await this.transport.snooze(offerId);
    if (this.active) { this.acceptState(reply.state); this.update({ pending: null }); }
  }
  submitted(state: FeedbackState) { this.acceptState(state); this.update({ pending: null }); }

  async testEmail(
    prepare: () => Promise<number> | number,
    send: (campaignId: number) => Promise<{ status: number; headers: { [key: string]: unknown } }>,
    onAccepted: () => void,
  ) {
    if (!this.active || this.value.busy) return;
    this.update({ busy: true });
    try {
      const actionId = crypto.randomUUID();
      const campaignId = await prepare();
      if (!this.active) return;
      const response = await send(campaignId);
      if (response.status < 200 || response.status >= 300) throw new Error("Test request was not accepted");
      if (!this.active) return;
      const requestId = response.headers["x-request-id"];
      const eventId = typeof requestId === "string" && requestId.length > 0 && requestId.length <= 160
        ? `request:${requestId}` : `action:${actionId}`;
      void this.record({ kind: "test-email", campaignId: String(campaignId), eventId });
      onAccepted();
    } finally { this.update({ busy: false }); }
  }

  async launch(operation: () => Promise<number | string>, onAccepted: (id: number | string) => void) {
    if (!this.active || this.value.busy) return;
    this.update({ busy: true });
    try {
      const actionId = crypto.randomUUID();
      const campaignId = await operation();
      if (!this.active) return;
      void this.record({ kind: "launch", campaignId: String(campaignId), eventId: `action:${actionId}` });
      onAccepted(campaignId);
    } finally { this.update({ busy: false }); }
  }
}
