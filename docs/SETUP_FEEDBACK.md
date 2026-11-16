# Automatic copilot setup feedback

## Current popup-only preview

The dashboard uses session-only feedback progress instead of `/api/feedback`.
The same second-test/first-launch placement rules apply. Clicking **Send feedback**
after choosing a rating shows `Feedback submission is not implemented yet.` in a
browser alert and closes the dialog. No rating or comment is submitted or saved,
and no success/thanks screen is shown. Reloading the dashboard starts fresh.
Dismissal only suppresses prompts in the current dashboard session.

The storage/API behavior described below remains available for later integration
and existing injected test fixtures, but the deployed dashboard does not call it.
Two preview regression checks were prepared, not run under the user's commands-only
preference. Browser alert and deployment verification remain pending.

Survey version: `copilot-setup-v3`. This replaces the earlier creation-based
preview. Creating copilots alone does not trigger this version.

The added campaign-details screen was removed at the user's request. Launch uses
the original copilot list; card View Details keeps its original Departure link.
The popup and its local persistence remain the only added product UI/behavior.

## Trigger and placement

- The second distinct HTTP-accepted test request or first accepted launch makes
  the account eligible. Failed/cancelled actions and duplicate event IDs do not
  change counters. A test acceptance is not a claim of inbox delivery.
- `EmailTemplateStep.handleTestEmail`, `Step4Launch.sendTestEmail` and
  `CopilotMenu.handleTestEmail` use `useSetupFeedbackActions.testEmail`. A server
  `x-request-id` is reused when available; otherwise a UUID identifies that
  explicit action. The synchronous busy guard and native double-click guards
  prevent duplicate requests; the local API also deduplicates event IDs.
- Wizard `handleLaunch` waits for all launch writes. Listing launch waits for
  the run endpoint. Wizard launch returns to the existing `/dashboard/copilots` list; menu launch stays there.
  Resumes and background reads do not record launches.
- Test offers wait for the matching campaign's final wizard step, marked by
  `data-setup-feedback-final-step`. Tests sent in the template step remain pending
  until that step is reached. Test confirmations/toasts and other dialogs must close.
- Launch offers wait for the existing copilot list to finish loading and for the
  launch confirmation toast to clear. No extra details screen or summary is added.
- `SetupFeedbackProvider` is the authenticated shared dashboard host. After the
  correct placement is ready, it waits 500ms without relevant DOM changes and
  claims the offer from the local API. Existing ARIA dialogs, legacy full-screen
  backdrops, toasts and `aria-busy` regions block it.

## Seven-day snooze

Not now, Escape and backdrop closing all save a snooze before closing the survey.
The server uses its own clock and seven periods of 24 hours. Duplicate close
callbacks do not extend the deadline. If saving fails, the form remains open with
a retry message rather than pretending the reminder was saved.

After expiry, only a **new successful test request or launch** can create another
offer. Reads, page loads, clock expiry and replayed old callbacks do not create
offers. Successes recorded during the snooze cannot be replayed after expiry to
open the survey. Counts and snoozes survive reloads and use account storage.

## Form and submission

The dialog asks **How easy was it to set up your copilot?** It requires a 1–5
rating, labelled Very difficult to Very easy, and accepts an optional comment of
at most 2000 characters. It reuses `ConfirmDialog` and existing form styles,
keyboard containment, dismissal and focus restoration.

Submission failure retains values and permits retry. Thanks appears only after
the authenticated local route confirms the submission was saved. The first saved
submission for an account/version is permanent and idempotent; retries do not
replace it. Other browsers cannot claim new offers after that save. Existing
open forms refresh on focus and every 15 seconds to observe remote submission
or snooze; an ordinary page refresh never creates an offer.

## Temporary local persistence

The existing `setup-feedback-api.ts` adapter now calls same-origin `/api/feedback`.
This is a temporary Next.js route, not the separate application backend. Clerk
session cookies authenticate every read and mutation; the server derives the
account ID and accepts no client-provided owner or filename.

Private JSON records are saved in `feedback/`, outside `public/`, under a hash of
account ID and survey version. They contain the account owner/version, minimal
success-event IDs, counts, claims, snooze state and the submitted rating/comment.
They contain no email content, lead records or credentials. GET only returns
public survey status, never answers or the private event history.

Per-record exclusive locks serialize writes and atomic renames commit complete
records before acceptance is returned. JSON, temporary and lock files are ignored
by `feedback/.gitignore`. See `feedback/README.md` for the storage boundary.

**Account-wide state is shared by browsers/devices using the same server and
filesystem.** Separate deployment disks are not synchronized. This temporary
folder needs persistent writable storage to survive deployment/restart and must
be migrated when the external backend is introduced.

## Local API contract

`GET /api/feedback` returns `{ state }` with version, revision, successful test
count, launch eligibility, snooze time/current snooze flag, and submission time.
No GET creates or increments an action.

`POST /api/feedback` requires JSON and the current version, plus one operation:

```json
{"version":"copilot-setup-v3","operation":"success","event":{"kind":"test-email","eventId":"request:unique-id","campaignId":"42"}}
```

- `success`: kind `test-email` or `launch`; stable event ID and campaign ID.
  Returns `{ state, offerId }`; only eligible, unsnoozed fresh actions offer.
- `claim`: `{ version, operation: "claim", offerId }`; returns `{ state, claimed }`.
  Each offered event can be claimed once, including across browsers.
- `snooze`: `{ version, operation: "snooze", offerId }`; saves seven days for a
  claimed event. Repeated/older dismissal callbacks leave the deadline unchanged.
- `submit`: `{ version, operation: "submit", rating, comment? }`; returns saved
  state only after persistence. `Idempotency-Key` is sent for unchanged retries;
  account/version uniqueness also makes repeat submissions idempotent.

Unauthenticated requests return 401, invalid JSON/schema returns 400, oversized
bodies 413, non-JSON requests 415, and unavailable/busy storage 503. Cross-origin
browser mutations are rejected. Feedback-storage failure does not turn an
accepted test send or launch into a failed business action; survey offers fail
closed until authoritative state is available.

## Files to follow

| Concern | Files |
| --- | --- |
| Shared types, action coordinator | `src/lib/setup-feedback.ts` |
| Server state machine | `src/lib/setup-feedback-state.ts` |
| Local file persistence | `src/lib/setup-feedback-store.ts`, `feedback/` |
| Authenticated local endpoint | `src/app/api/feedback/route.ts` |
| Client adapter | `src/lib/setup-feedback-api.ts` |
| Dashboard host and placement | `src/lib/SetupFeedbackProvider.tsx`, `src/lib/setup-feedback-dialogs.ts`, `src/lib/providers.tsx` |
| Form and accessibility | `src/components/ui/feedback/SetupFeedbackDialog.tsx`, `src/components/ui/ConfirmDialog.tsx` |
| Wizard trigger/placement | `src/components/ui/NewCopilot/StepFour/EmailTemplateStep.tsx`, `StepSix/Step4Launch.tsx`, `StepSix/TestEmailGateModal.tsx`, `src/app/dashboard/copilots/new/page.tsx` |
| Listing actions | `src/components/ui/copilots/CopilotMenu.tsx` |

Existing local edits are preserved. Old browser-only v1/v2 keys are not erased or
imported into this account-backed version because their trigger rules differ.

## Verification

The host now wraps API/subscription gates so their loading states do not discard
pending offers during navigation. Scheduling depends on the offer ID and blocking
flags rather than the whole changing snapshot; claim requests are coalesced so
overlapping UI checks cannot consume and then clear the same offer. Development
storage failures log only the operation and HTTP status, without account data.
These fixes address source-level races; the reported browser failure has not
been reproduced in an attached browser session.

The user subsequently explicitly requested a browser reproduction. Executed:

- `node tests/setup-feedback.test.mjs`: 13 checks passed.
- `node scripts/test-setup-feedback-browser.mjs`: all browser checks passed,
  including actual creation-form submission, accepted tests, and launch navigation.
- `npm run typecheck`: passed.
- Targeted ESLint for the wizard route, feedback host/controller/providers and
  changed TS fixtures: passed. `git diff --check`: passed.
- Final pre-push `npm run build`: passed, including TypeScript and static-page
  generation. Full `npm run lint` retains the existing 22 errors and 17 warnings;
  these match the recorded baseline.
- Final browser run also checks that the feedback backdrop covers the sticky
  table header; no table styles were changed.

The creation reproduction failed before the fix because an outstanding edit-mode
GET could complete after entering create mode and overwrite the new draft. Wizard
load effects now ignore stale responses and clear loading when entering create.
The same reproduction then successfully POSTed a new copilot through the actual
form and displayed feedback after two accepted tests.

The two initial browser scenarios use the production HTTP adapter, actual Next
feedback route and file store, with Clerk session lookup replaced by isolated
mock accounts. Runtime files live in a temporary `feedback/` directory and are
deleted afterward. Assertions verify seven-day snooze persistence, rating saved
after launch, and reload suppression. Other browser scenarios use the pure mock
account store for controlled failure and clock testing. Campaign API responses
and configuration records are mocked; steps 2–5 are seeded with mock links after
creation. No real emails, live launches or user feedback files are touched.

A screenshot is saved to `/tmp/emailcopilot-created-feedback.png`. The real
unauthenticated local `/api/feedback` returned the expected 401. The user's own
authenticated browser is not attached; its precise previous failure remains
unconfirmed. Authenticated deployment checks remain outside the isolated test
setup. The production build passed; full-lint failures are the recorded baseline.

Before pushing, run the safe mocked checks and project checks:

```bash
node tests/setup-feedback.test.mjs
node scripts/test-setup-feedback-browser.mjs
npm run typecheck
npm run lint
npm run build
git diff --check
```

The browser fixture uses only mock campaign APIs; it sends
no real outreach or live launches. Verify first/second tests, final-step-only
placement, launch list/confirmation readiness, other dialogs, failed/cancelled
actions, duplicate callbacks, exactly seven days of snooze, expiry without an
action, the next action after expiry, retry, cross-browser submission suppression,
user switching, and reloads. Also verify authenticated route validation, atomic
concurrent file updates, private Git ignores and filesystem errors in an isolated
test directory. Full-lint issues from earlier revisions remain a separate baseline.
