import assert from "node:assert/strict";
import { test } from "node:test";
import { sortCopilotsArchivedLast } from "../src/lib/sort-copilots.ts";

const newestFirst = (a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);

test("recently archived copilots follow non-archived ones; dates still sort within each group", () => {
  const input = [
    { id: 1, status: "archived", updatedAt: "2026-11-16" },
    { id: 2, status: "active", updatedAt: "2026-11-12" },
    { id: 3, status: "archived", updatedAt: "2026-11-15" },
    { id: 4, status: "running", updatedAt: "2026-11-14" },
    { id: 5, status: "draft", updatedAt: "2026-11-13" },
  ];
  const original = structuredClone(input);
  assert.deepEqual(sortCopilotsArchivedLast(input, newestFirst).map(({ id }) => id), [4, 5, 2, 1, 3]);
  assert.deepEqual(input, original);
});

test("Overview chooses three non-archived copilots before slicing and preserves their API order", () => {
  const input = [
    { id: 1, status: "archived" }, { id: 2, status: "paused" },
    { id: 3, status: "active" }, { id: 4, status: "archived" },
    { id: 5, status: "running" },
  ];
  assert.deepEqual(sortCopilotsArchivedLast(input).slice(0, 3).map(({ id }) => id), [2, 3, 5]);
});

test("archived-only results retain their date order, including when the Archived filter is selected", () => {
  const input = [
    { id: 1, status: "archived", updatedAt: "2026-11-10" },
    { id: 2, status: "archived", updatedAt: "2026-11-16" },
  ];
  assert.deepEqual(sortCopilotsArchivedLast(input, newestFirst).map(({ id }) => id), [2, 1]);
});

test("pagination partitions the entire result set before taking the first page", () => {
  const archived = Array.from({ length: 25 }, (_, id) => ({ id, status: "archived" }));
  const current = Array.from({ length: 25 }, (_, id) => ({ id: id + 25, status: "active" }));
  const sorted = sortCopilotsArchivedLast([...archived, ...current]);
  assert.equal(sorted.slice(0, 20).every(({ status }) => status === "active"), true);
  assert.equal(sorted.slice(25).every(({ status }) => status === "archived"), true);
});

test("empty results and a short archived-only Overview remain valid", () => {
  assert.deepEqual(sortCopilotsArchivedLast([]), []);
  const input = [{ id: 1, status: "archived" }];
  assert.deepEqual(sortCopilotsArchivedLast(input).slice(0, 3), input);
});
