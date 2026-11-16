import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addSubjectToHistory, parseSubjectHistory, readSubjectHistory, rememberSubject,
  subjectHistoryKey, SUBJECT_HISTORY_LIMIT,
} from "../src/lib/subject-history.ts";

test("invalid storage and non-string entries cannot break subject suggestions", () => {
  for (const value of [null, "broken json", '{}', '"text"']) assert.deepEqual(parseSubjectHistory(value), []);
  assert.deepEqual(parseSubjectHistory('[null,7,"  Hello  ","Hello","",{},"World"]'), ["Hello", "World"]);
});

test("previous subjects are unique, recent first, and bounded", () => {
  const initial = Array.from({ length: SUBJECT_HISTORY_LIMIT }, (_, i) => `Subject ${i}`);
  const reused = addSubjectToHistory(initial, "Subject 5");
  assert.equal(reused[0], "Subject 5");
  assert.equal(reused.filter((subject) => subject === "Subject 5").length, 1);
  assert.equal(addSubjectToHistory(initial, "New subject").length, SUBJECT_HISTORY_LIMIT);
  assert.deepEqual(addSubjectToHistory(initial, "   "), initial);
});

test("preserves variables and meaningful capitalization exactly", () => {
  const subject = "Quick idea for {{companyName}} from {{senderName}}";
  assert.equal(parseSubjectHistory(JSON.stringify(addSubjectToHistory([], subject)))[0], subject);
  assert.deepEqual(addSubjectToHistory(["{{companyName}}"], "{{CompanyName}}"), ["{{CompanyName}}", "{{companyName}}"]);
});

test("storage stays separate by account and failed storage never blocks editing", () => {
  const previousWindow = globalThis.window;
  const values = new Map();
  let notifications = 0;
  globalThis.window = {
    localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
    dispatchEvent: () => { notifications++; },
  };
  try {
    rememberSubject("account-a", "Hello {{companyName}}");
    assert.deepEqual(parseSubjectHistory(readSubjectHistory("account-a")), ["Hello {{companyName}}"]);
    assert.equal(readSubjectHistory("account-b"), null);
    rememberSubject(null, "Must not be shared");
    assert.equal(values.size, 1);
    assert.equal(notifications, 1);
    values.set(subjectHistoryKey("account-a"), "invalid");
    rememberSubject("account-a", "Recovered");
    assert.deepEqual(parseSubjectHistory(readSubjectHistory("account-a")), ["Recovered"]);
    window.localStorage.getItem = () => { throw new Error("Storage blocked"); };
    window.localStorage.setItem = () => { throw new Error("Quota exceeded"); };
    assert.equal(readSubjectHistory("account-a"), null);
    assert.doesNotThrow(() => rememberSubject("account-a", "Still editable"));
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
