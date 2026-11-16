// Prepared for the requested pre-push verification; do not run during implementation.
import assert from "node:assert/strict";
import { test } from "node:test";
import { SETUP_FEEDBACK_VERSION, SetupFeedbackController } from "../src/lib/setup-feedback.ts";
import { applyFeedbackCommand, createFeedbackRecord, createPreviewFeedbackTransport, feedbackState, FEEDBACK_SNOOZE_MS } from "../src/lib/setup-feedback-state.ts";

test("popup preview qualifies after two tests and resets with a fresh dashboard session", async () => {
  const transport = createPreviewFeedbackTransport("preview-user", SETUP_FEEDBACK_VERSION);
  const event = (eventId) => ({ kind: "test-email", eventId, campaignId: "42" });
  assert.equal((await transport.record(event("one"))).offerId, null);
  const { offerId } = await transport.record(event("two"));
  assert.ok(offerId);
  assert.equal((await transport.claim(offerId)).claimed, true);
  await transport.snooze(offerId);
  assert.equal((await transport.load()).snoozed, true);
  const fresh = createPreviewFeedbackTransport("preview-user", SETUP_FEEDBACK_VERSION);
  assert.equal((await fresh.load()).successfulTests, 0);
  assert.equal((await fresh.load()).snoozed, false);
});

test("popup preview qualifies after launch and never pretends to save feedback", async () => {
  const transport = createPreviewFeedbackTransport("preview-user", SETUP_FEEDBACK_VERSION);
  assert.ok((await transport.record({ kind: "launch", eventId: "one", campaignId: "42" })).offerId);
  await assert.rejects(transport.submit({ version: SETUP_FEEDBACK_VERSION, rating: 5 }, "preview"),
    /Feedback submission is not implemented yet/);
  assert.equal((await transport.load()).submittedAt, null);
});

function account(owner = "user-a") {
  let record = createFeedbackRecord(owner, SETUP_FEEDBACK_VERSION);
  let now = 1_000_000;
  const change = (command) => { const result = applyFeedbackCommand(record, command, now); record = result.record; return result.reply; };
  return {
    get record() { return record; },
    get state() { return feedbackState(record, now); },
    advance(ms) { now += ms; },
    change,
    event(kind, eventId) { return change({ operation: "success", event: { kind, eventId, campaignId: "42" } }); },
    transport: {
      load: async () => feedbackState(record, now),
      record: async (event) => change({ operation: "success", event }),
      claim: async (offerId) => change({ operation: "claim", offerId }),
      snooze: async (offerId) => change({ operation: "snooze", offerId }),
      submit: async (payload) => ({ status: 200, state: change({ operation: "submit", rating: payload.rating, comment: payload.comment }).state }),
    },
  };
}

test("first test is quiet; second distinct accepted test offers feedback", () => {
  const user = account();
  assert.equal(user.event("test-email", "one").offerId, null);
  assert.ok(user.event("test-email", "two").offerId);
  assert.equal(user.state.successfulTests, 2);
});

test("first accepted launch qualifies independently of test count", () => {
  const user = account();
  assert.ok(user.event("launch", "first-launch").offerId);
  assert.equal(user.state.successfulTests, 0);
  assert.equal(user.state.hasLaunched, true);
});

test("duplicate callbacks and repeated reads leave counters unchanged", () => {
  const user = account();
  user.event("test-email", "one");
  const revision = user.state.revision;
  user.event("test-email", "one");
  for (let i = 0; i < 3; i++) assert.equal(user.state.successfulTests, 1);
  assert.equal(user.state.revision, revision);
});

test("a qualifying event is claimed only once across browser sessions", async () => {
  const user = account();
  const { offerId } = user.event("launch", "first-launch");
  const [a, b] = await Promise.all([user.transport.claim(offerId), user.transport.claim(offerId)]);
  assert.equal(Number(a.claimed) + Number(b.claimed), 1);
});

test("overlapping UI checks share one claim request and preserve the pending offer", async () => {
  const user = account();
  let complete;
  let requests = 0;
  const controller = new SetupFeedbackController({
    ...user.transport,
    claim: (offerId) => {
      requests++;
      return new Promise((resolve) => { complete = () => resolve(user.change({ operation: "claim", offerId })); });
    },
  });
  controller.activate(); await controller.refresh();
  await controller.launch(async () => 42, () => {});
  const first = controller.claimPrompt();
  const second = controller.claimPrompt();
  assert.equal(first, second);
  assert.equal(requests, 1);
  complete();
  assert.deepEqual(await Promise.all([first, second]), [true, true]);
  assert.equal(controller.snapshot().pending.claimed, true);
});

test("dismissal snoozes seven days and repeated dismissal does not extend it", () => {
  const user = account();
  const { offerId } = user.event("launch", "first-launch");
  user.change({ operation: "claim", offerId });
  user.change({ operation: "snooze", offerId });
  const until = user.state.snoozedUntil;
  user.advance(1000);
  user.change({ operation: "snooze", offerId });
  assert.equal(user.state.snoozedUntil, until);
  user.advance(FEEDBACK_SNOOZE_MS - 1001);
  assert.equal(user.state.snoozed, true);
  user.advance(1);
  assert.equal(user.state.snoozed, false);
});

test("expiry alone and replayed old events cannot reoffer; the next success can", () => {
  const user = account();
  const { offerId } = user.event("launch", "first-launch");
  user.change({ operation: "claim", offerId });
  user.change({ operation: "snooze", offerId });
  assert.equal(user.event("test-email", "during-snooze").offerId, null);
  user.advance(FEEDBACK_SNOOZE_MS);
  assert.equal(user.state.snoozed, false);
  assert.equal(user.event("launch", "first-launch").offerId, null);
  assert.equal(user.event("test-email", "during-snooze").offerId, null);
  assert.ok(user.event("test-email", "after-snooze").offerId);
});

test("a newly loaded dashboard never manufactures a pending offer", async () => {
  const user = account();
  user.event("launch", "accepted-before-reload");
  const controller = new SetupFeedbackController(user.transport);
  controller.activate(); await controller.refresh();
  assert.equal(controller.snapshot().pending, null);
  assert.equal(await controller.claimPrompt(), false);
});

test("submission is account-wide and idempotent for this survey version", async () => {
  const user = account();
  const { offerId } = user.event("launch", "first-launch");
  user.change({ operation: "claim", offerId });
  await user.transport.submit({ version: SETUP_FEEDBACK_VERSION, rating: 4, comment: "Clear" });
  const revision = user.state.revision;
  await user.transport.submit({ version: SETUP_FEEDBACK_VERSION, rating: 1, comment: "Duplicate" });
  assert.equal(user.state.revision, revision);
  assert.equal(user.record.submission.rating, 4);
  assert.equal(user.event("test-email", "another-browser").offerId, null);
  const otherBrowser = new SetupFeedbackController(user.transport);
  otherBrowser.activate(); await otherBrowser.refresh();
  assert.ok(otherBrowser.snapshot().progress.submittedAt);
  assert.equal(await otherBrowser.claimPrompt(), false);
});

test("public state excludes the stored rating, comment and event history", async () => {
  const user = account();
  user.event("launch", "one");
  await user.transport.submit({ rating: 5, comment: "Private answer" });
  for (const key of ["owner", "events", "claimed", "rating", "comment", "submission"]) assert.equal(key in user.state, false);
  assert.equal(account("user-b").state.submittedAt, null);
});

test("failed/cancelled primary actions never record success", async () => {
  const user = account();
  const controller = new SetupFeedbackController(user.transport);
  controller.activate(); await controller.refresh();
  for (const error of [new Error("failed"), Object.assign(new Error("cancelled"), { code: "ERR_CANCELED" })]) {
    await assert.rejects(controller.testEmail(() => 42, async () => { throw error; }, () => {}));
    await assert.rejects(controller.launch(async () => { throw error; }, () => {}));
  }
  assert.equal(user.state.successfulTests, 0);
  assert.equal(user.state.hasLaunched, false);
});

test("rapid duplicate test clicks share one request and one confirmation", async () => {
  const user = account();
  const controller = new SetupFeedbackController(user.transport);
  controller.activate(); await controller.refresh();
  let finish; let requests = 0; let confirmations = 0;
  const send = () => { requests++; return new Promise((resolve) => { finish = resolve; }); };
  const first = controller.testEmail(() => 42, send, () => { confirmations++; });
  await controller.testEmail(() => 42, send, () => { confirmations++; });
  finish({ status: 202, headers: { "x-request-id": "one" } }); await first;
  assert.equal(requests, 1); assert.equal(confirmations, 1);
});

test("late signed-out responses cannot populate the next account's pending state", async () => {
  const alice = account();
  const controller = new SetupFeedbackController(alice.transport);
  controller.activate(); await controller.refresh();
  let finish;
  const request = controller.testEmail(() => 42, () => new Promise((resolve) => { finish = resolve; }), () => {});
  await Promise.resolve(); controller.deactivate();
  finish({ status: 202, headers: {} }); await request;
  assert.equal(alice.state.successfulTests, 0);
  assert.equal(account("user-b").state.successfulTests, 0);
});
