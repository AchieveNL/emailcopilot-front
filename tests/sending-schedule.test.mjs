import assert from "node:assert/strict";
import { test } from "node:test";
import { testEmailScheduleBlockReason as blocked, sendTestEmailWithinSchedule } from "../src/lib/sending-schedule.ts";

const schedule = {
  activeDays: [1, 2, 3, 4, 5], timezone: "UTC", sendingHoursActive: true,
  sendingHours: { start: "09:00", end: "17:00" },
};
const at = (time) => new Date(time);

test("allows start time and blocks before start, end time and inactive days", () => {
  assert.equal(blocked(schedule, at("2026-11-16T09:00:00Z")), null);
  assert.ok(blocked(schedule, at("2026-11-16T08:59:59Z")));
  assert.ok(blocked(schedule, at("2026-11-16T17:00:00Z")));
  assert.ok(blocked(schedule, at("2026-11-15T10:00:00Z")));
});

test("hours off allows any time on active days, but never implies all seven days", () => {
  const allDay = { ...schedule, sendingHoursActive: false };
  assert.equal(blocked(allDay, at("2026-11-16T23:00:00Z")), null);
  assert.ok(blocked(allDay, at("2026-11-15T10:00:00Z")));
});

test("uses the schedule timezone for both its day and local time", () => {
  const tokyo = { ...schedule, timezone: "Asia/Tokyo", sendingHours: { start: "08:00", end: "17:00" } };
  assert.equal(blocked(tokyo, at("2026-11-15T23:59:00Z")), null);
  assert.ok(blocked({ ...tokyo, activeDays: [7] }, at("2026-11-15T23:59:00Z")));
  assert.ok(blocked({ ...schedule, timezone: "America/New_York" }, at("2026-11-16T10:00:00Z")));
});

test("honors daylight saving instead of using a fixed UTC offset", () => {
  const ny = { ...schedule, timezone: "America/New_York" };
  assert.ok(blocked(ny, at("2026-01-12T13:00:00Z")));
  assert.equal(blocked(ny, at("2026-07-13T13:00:00Z")), null);
});

test("overnight windows still require the current local calendar day to be active", () => {
  const night = { ...schedule, activeDays: [1], sendingHours: { start: "22:00", end: "06:00" } };
  assert.equal(blocked(night, at("2026-11-16T23:00:00Z")), null);
  assert.ok(blocked(night, at("2026-11-17T01:00:00Z")));
  assert.equal(blocked({ ...night, activeDays: [1, 2] }, at("2026-11-17T01:00:00Z")), null);
  assert.ok(blocked({ ...night, activeDays: [1, 2] }, at("2026-11-17T06:00:00Z")));
});

test("invalid schedule settings fail closed; no selected schedule has no configured restriction", () => {
  const now = at("2026-11-16T10:00:00Z");
  assert.ok(blocked({ ...schedule, activeDays: [] }, now));
  assert.ok(blocked({ ...schedule, timezone: "invalid-zone" }, now));
  assert.ok(blocked({ ...schedule, sendingHours: { start: "09:00", end: "09:00" } }, now));
  assert.ok(blocked({ ...schedule, sendingHours: null }, now));
  assert.equal(blocked(null, now), null);
});

test("blocked or unavailable schedules never invoke the test-email sender", async () => {
  let sends = 0;
  const send = async () => { sends++; };
  await assert.rejects(sendTestEmailWithinSchedule(() => schedule, send,
    () => at("2026-11-16T18:00:00Z")), /only allowed/);
  await assert.rejects(sendTestEmailWithinSchedule(() => { throw new Error("Unavailable"); }, send));
  assert.equal(sends, 0);
});

test("checks the clock after schedule resolution and sends exactly once inside the window", async () => {
  let now = at("2026-11-16T16:59:00Z");
  let sends = 0;
  const send = async () => { sends++; return "accepted"; };
  await assert.rejects(sendTestEmailWithinSchedule(async () => {
    now = at("2026-11-16T17:00:00Z"); return schedule;
  }, send, () => now));
  assert.equal(sends, 0);
  assert.equal(await sendTestEmailWithinSchedule(() => schedule, send,
    () => at("2026-11-16T10:00:00Z")), "accepted");
  assert.equal(sends, 1);
});
