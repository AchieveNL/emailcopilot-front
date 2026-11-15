// Isolated real-Chrome regression checks. All API calls use a mock Axios adapter.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

const root = process.cwd();
const require = createRequire(path.join(root, "package.json"));
const pnpm = path.join(root, "node_modules/.pnpm");
const esbuildDir = (await readdir(pnpm)).find((name) => name.startsWith("esbuild@"));
if (!esbuildDir) throw new Error("Install existing pnpm dependencies first; esbuild was not found.");
const esbuild = require(path.join(pnpm, esbuildDir, "node_modules/esbuild"));
const nextRequire = createRequire(require.resolve("next/package.json"));
const postcss = nextRequire("postcss");
const tailwind = require("@tailwindcss/postcss");
const directory = await mkdtemp(path.join(tmpdir(), "emailcopilot-feedback-browser-"));
let chrome;
let server;
let client;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class CDP {
  constructor(socket) {
    this.socket = socket; this.sequence = 0; this.pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === "Page.javascriptDialogOpening") {
        // The actual wizard has a beforeunload warning; allow this mock-only reload.
        void this.send("Page.handleJavaScriptDialog", { accept: true });
      }
      const task = this.pending.get(message.id);
      if (task) {
        this.pending.delete(message.id);
        clearTimeout(task.timeout);
        if (message.error) task.reject(new Error(`${task.method}: ${message.error.message}`));
        else task.resolve(message.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`Chrome command timed out: ${method}`)); }, 15000);
      this.pending.set(id, { resolve, reject, timeout, method });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const value = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (value.exceptionDetails) throw new Error(value.exceptionDetails.exception?.description ?? value.exceptionDetails.text);
    return value.result.value;
  }
}

try {
  const platform = path.join(root, "tests/fixtures/feedback-platform.tsx");
  const link = platform;
  await esbuild.build({
    entryPoints: [path.join(root, "tests/fixtures/setup-feedback-app.tsx")], outfile: path.join(directory, "app.js"),
    bundle: true, format: "esm", platform: "browser", jsx: "automatic", logLevel: "silent",
    define: { "process.env.NODE_ENV": '"development"', "process.env.NEXT_PUBLIC_API_URL": '"http://mock-api.invalid"', "process.env": "{}" },
    alias: { "@clerk/nextjs": platform, "next/navigation": platform, "next/link": link, "next/dist/client/link": link },
  });
  const source = (await readFile(path.join(root, "src/globals.css"), "utf8")).replace(/^@import url\([^\n]*\);\s*/gm, "");
  const result = await postcss([tailwind({ base: root })]).process(source, { from: path.join(root, "src/globals.css") });
  await writeFile(path.join(directory, "app.css"), result.css);
  await symlink(path.join(root, "node_modules"), path.join(directory, "node_modules"), "dir");
  await esbuild.build({
    stdin: {
      contents: `
        import { NextRequest } from 'next/server';
        import { GET, POST } from './src/app/api/feedback/route';
        import { feedbackSession } from './tests/fixtures/feedback-auth-server';
        export function handle(url, method, headers, body, userId) {
          return feedbackSession.run(userId, () => method === 'GET'
            ? GET() : POST(new NextRequest(url, { method, headers, body })));
        }`,
      resolveDir: root,
    },
    outfile: path.join(directory, "feedback-server.cjs"), bundle: true,
    platform: "node", format: "cjs", packages: "external", logLevel: "silent",
    alias: { "@clerk/nextjs/server": path.join(root, "tests/fixtures/feedback-auth-server.ts") },
  });
  const feedbackServer = require(path.join(directory, "feedback-server.cjs"));
  // The real store uses process.cwd()/feedback. Keep all test records isolated.
  process.chdir(directory);
  server = createServer(async (request, response) => {
    if (request.url === "/api/feedback") {
      try {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        const body = request.method === "GET" ? undefined : Buffer.concat(chunks).toString("utf8");
        const userId = decodeURIComponent(request.headers.cookie?.match(/(?:^|;\s*)feedback-test-user=([^;]+)/)?.[1] ?? "");
        const reply = await feedbackServer.handle(`http://${request.headers.host}/api/feedback`, request.method, request.headers, body, userId);
        response.writeHead(reply.status, Object.fromEntries(reply.headers.entries()));
        response.end(await reply.text());
      } catch (error) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: String(error) }));
      }
      return;
    }
    const file = request.url?.startsWith("/app.") ? request.url.slice(1) : null;
    if (file && ["app.js", "app.css"].includes(file)) {
      response.setHeader("Content-Type", file.endsWith("css") ? "text/css" : "text/javascript");
      response.end(await readFile(path.join(directory, file)));
    } else {
      response.setHeader("Content-Type", "text/html");
      response.end('<html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script>window.fixtureErrors=[];window.addEventListener("error",e=>fixtureErrors.push(e.message));window.addEventListener("unhandledrejection",e=>fixtureErrors.push(String(e.reason)));</script><script type="module" src="/app.js"></script></body></html>');
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const profile = path.join(directory, "chrome");
  chrome = spawn(process.env.FEEDBACK_TEST_CHROME ?? "/usr/bin/google-chrome", [
    "--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--disable-background-networking",
    "--disable-component-update", "--disable-sync", "--no-first-run", "--no-default-browser-check",
    "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--window-size=1280,900", "about:blank",
  ], { stdio: "ignore" });
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await pause(100); }
  }
  if (!port) throw new Error("Chrome did not start. Set FEEDBACK_TEST_CHROME to a Chromium executable.");
  const page = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(origin)}`, { method: "PUT" })).json();
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  client = new CDP(socket);
  await client.send("Page.enable");
  const evaluate = (expression) => client.evaluate(expression);
  const navigationError = (error) => /navigated|closed|context.*destroyed|Cannot find context/i.test(error.message);
  const waitFor = async (expression, label = expression) => {
    for (let attempt = 0; attempt < 200; attempt++) {
      try { if (await evaluate(expression)) return; }
      catch (error) { if (!navigationError(error)) throw error; }
      await pause(30);
    }
    throw new Error(`Timed out: ${label}\n${await evaluate("JSON.stringify({ text: document.body.innerText.slice(-2500), errors: window.fixtureErrors, creations: window.feedbackTest?.mock.creations, pending: window.feedbackTest?.mock.pending, calls: window.feedbackTest?.mock.calls.slice(-15) })")}`);
  };
  const reload = async () => {
    try { await client.send("Page.reload"); }
    catch (error) { if (!navigationError(error)) throw error; }
  };
  const click = async (label) => {
    await waitFor(`Array.from(document.querySelectorAll('button')).some(b => b.textContent.trim() === ${JSON.stringify(label)} && !b.disabled)`);
    await evaluate(`(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === ${JSON.stringify(label)}); b.focus(); b.click(); })()`);
  };
  const feedbackOpen = '!!document.querySelector("[data-setup-feedback-root]")';
  const ready = async () => {
    await waitFor('window.feedbackTest && document.body.innerText.includes("Review your copilot") && window.feedbackTest.mock.pending === 0');
  };
  const quiet = async () => { await pause(1200); assert.equal(await evaluate(feedbackOpen), false); };
  const switchUser = async (name) => { await evaluate(`window.feedbackTest.switchUser(${JSON.stringify(name)})`); await ready(); };
  await ready();

  // Start from the actual creation form, then supply mock records for the
  // configuration steps before using the real final-step send/launch buttons.
  await evaluate("window.feedbackTest.goCreate()");
  await waitFor('document.querySelector("input#name") && window.feedbackTest.mock.pending === 0');
  await evaluate(`(() => {
    const field = document.querySelector('input#name');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(field, 'Browser reproduction copilot');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await click("Save & Continue");
  await waitFor('window.feedbackTest.mock.creations === 1 && window.feedbackTest.mock.destination.includes("edit=101") && window.feedbackTest.mock.pending === 0');
  await quiet();
  await evaluate("window.feedbackTest.reviewCreated()"); await ready();
  await click("Send test email"); await quiet();
  await click("Send test email"); await waitFor(feedbackOpen);
  const createdScreenshot = await client.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(tmpdir(), "emailcopilot-created-feedback.png"), Buffer.from(createdScreenshot.data, "base64"));
  await click("Not now"); await quiet();
  const records = await readdir(path.join(directory, "feedback"));
  const saved = JSON.parse(await readFile(path.join(directory, "feedback", records.find((file) => file.endsWith(".json"))), "utf8"));
  assert.equal(saved.successfulTests, 2);
  assert.ok(saved.snoozedUntil > Date.now());
  console.log("PASS actual create form → accepted tests → HTTP feedback route → popup → saved seven-day snooze");
  await evaluate("window.feedbackTest.mock.historicalTest = true");
  await switchUser("browser-user-api-launch");
  await click("Launch Copilot");
  await waitFor('window.feedbackTest.mock.destination === "/dashboard/copilots"');
  await evaluate("window.feedbackTest.settleNavigation()");
  await waitFor(feedbackOpen);
  assert.equal(await evaluate(`(() => {
    const header = document.querySelector('thead th').getBoundingClientRect();
    const backdrop = document.querySelector('[data-setup-feedback-root] .fixed.inset-0');
    return document.elementFromPoint(header.left + 8, header.top + 8) === backdrop;
  })()`), true, "Feedback backdrop must cover the sticky copilot table header");
  const listScreenshot = await client.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(tmpdir(), "emailcopilot-feedback-table-backdrop.png"), Buffer.from(listScreenshot.data, "base64"));
  await evaluate('document.querySelector(\'input[name="setup-rating"][value="5"]\').click()');
  await click("Send feedback");
  await waitFor('document.body.innerText.includes("Thanks for your feedback")');
  const launchFiles = (await readdir(path.join(directory, "feedback"))).filter((file) => file.endsWith(".json"));
  const launchRecords = await Promise.all(launchFiles.map(async (file) => JSON.parse(await readFile(path.join(directory, "feedback", file), "utf8"))));
  const submitted = launchRecords.find((record) => record.owner === "browser-user-api-launch");
  assert.equal(submitted.submission.rating, 5);
  assert.equal(submitted.hasLaunched, true);
  await click("Done"); await reload(); await ready(); await quiet();
  console.log("PASS launch → existing copilot list → HTTP-backed survey submission → private JSON persisted → reload quiet");
  await evaluate("window.feedbackTest.mock.historicalTest = false");
  await switchUser("browser-user-a-original");
  await evaluate("window.feedbackTest.mock.testRequests = 0; window.feedbackTest.mock.calls = []");

  await evaluate("window.feedbackTest.goTemplate()");
  await waitFor('document.body.innerText.includes("Create your email template") && document.querySelector(".ProseMirror") && window.feedbackTest.mock.pending === 0');
  await click("Send test email");
  await waitFor("window.feedbackTest.mock.testRequests === 1");
  await quiet();
  const firstCalls = await evaluate("window.feedbackTest.mock.calls");
  for (const call of ["put /templates/3", "put /copilots/42"]) {
    assert.ok(firstCalls.indexOf(call) >= 0 && firstCalls.indexOf(call) < firstCalls.indexOf("post /copilots/42/test-email"));
  }
  // Also reject the second click of a native double-click after a fast first response.
  await evaluate(`Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Send test email').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 2 }))`);
  await quiet();
  assert.equal(await evaluate("window.feedbackTest.mock.testRequests"), 1);
  console.log("PASS template-step test saves template/draft before sending; first accepted test remains quiet");

  await evaluate("window.feedbackTest.remountReview()"); await ready();
  await click("Launch Copilot");
  await waitFor('document.body.innerText.includes("Send a test email first")');
  await evaluate(`(() => { const b = Array.from(document.querySelectorAll('[role=dialog] button')).find(b => b.textContent.trim() === 'Send test email'); b.click(); b.click(); })()`);
  await waitFor('document.body.innerText.includes("Test email request accepted")');
  await quiet();
  assert.equal(await evaluate("window.feedbackTest.mock.testRequests"), 2);
  await click("Not now");
  await waitFor(feedbackOpen);
  assert.equal(await evaluate('document.querySelectorAll("[role=dialog]").length'), 1);
  assert.equal(await evaluate('Array.from(document.querySelectorAll("button")).find(b => b.textContent === "Send feedback").disabled'), true);
  const screenshot = await client.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(tmpdir(), "emailcopilot-setup-feedback-desktop.png"), Buffer.from(screenshot.data, "base64"));
  await client.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 700, deviceScaleFactor: 1, mobile: true });
  assert.equal(await evaluate(`(() => { const r = document.querySelector('[data-setup-feedback-root] [role=dialog]').getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width <= innerWidth; })()`), true);
  const mobileScreenshot = await client.send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(tmpdir(), "emailcopilot-setup-feedback-mobile.png"), Buffer.from(mobileScreenshot.data, "base64"));
  await client.send("Emulation.clearDeviceMetricsOverride");
  console.log("PASS second distinct test waits for final-step confirmation closure");

  await evaluate(`(() => {
    document.querySelector('input[name="setup-rating"][value="4"]').click();
    const field = document.getElementById('setup-feedback-comment');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(field, 'Setup was clear');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    window.feedbackTest.mock.failFeedback = true;
  })()`);
  await evaluate('document.querySelector(\'input[name="setup-rating"][value="4"]\').focus()');
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", modifiers: 8 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", modifiers: 8 });
  assert.equal(await evaluate('document.querySelector("[data-setup-feedback-root] [role=dialog]").contains(document.activeElement)'), true);
  await click("Send feedback"); await waitFor('document.querySelector("[data-setup-feedback-root] [role=alert]") !== null');
  assert.equal(await evaluate('document.querySelector("textarea").value'), "Setup was clear");
  assert.equal(await evaluate('document.querySelector("input[name=setup-rating]:checked").value'), "4");
  assert.equal(await evaluate('document.body.innerText.includes("Thanks for your feedback")'), false);
  await click("Send feedback"); await waitFor('document.body.innerText.includes("Thanks for your feedback")');
  const submissions = await evaluate("window.feedbackTest.mock.feedbackRequests");
  assert.deepEqual(submissions.map((s) => s.payload), Array(2).fill({ version: "copilot-setup-v3", rating: 4, comment: "Setup was clear" }));
  assert.equal(submissions[0].key, submissions[1].key);
  await click("Done"); await quiet();
  await reload(); await ready(); await quiet();
  console.log("PASS failed submission retains values; retry reuses idempotency key; thanks waits for acceptance; reload stays quiet");

  await switchUser("browser-user-b");
  await click("Send test email"); await quiet();
  await click("Send test email"); await waitFor(feedbackOpen);
  assert.equal(await evaluate('document.querySelector("[data-setup-feedback-root] [role=dialog]").contains(document.activeElement)'), true);
  await evaluate('Array.from(document.querySelectorAll("[data-setup-feedback-root] button")).find(b => b.textContent === "Not now").focus()');
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab" });
  assert.equal(await evaluate('document.querySelector("[data-setup-feedback-root] [role=dialog]").contains(document.activeElement)'), true);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await waitFor(`!(${feedbackOpen})`);
  // The wizard may remount the original trigger after refetch; restore to it
  // when connected, or to a current main-content action/link otherwise.
  assert.equal(await evaluate('document.querySelector("main").contains(document.activeElement) && document.activeElement !== document.body'), true);
  await reload(); await ready(); await quiet();
  console.log("PASS user switching isolates progress; Escape dismisses and restores focus; dismissal survives reload");
  await evaluate("window.feedbackTest.advanceDays(7)"); await quiet();
  await click("Send test email"); await waitFor(feedbackOpen);
  await click("Not now"); await quiet();
  console.log("PASS snooze expiry alone stays quiet; the next successful test reoffers the survey");

  await evaluate("window.feedbackTest.mock.historicalTest = true; window.feedbackTest.mock.failLaunch = true");
  await switchUser("browser-user-c");
  await click("Launch Copilot"); await quiet();
  assert.equal(await evaluate("window.feedbackTest.mock.destination"), "");
  await click("Launch Copilot");
  await waitFor('window.feedbackTest.mock.destination === "/dashboard/copilots"');
  await quiet();
  await evaluate("window.feedbackTest.setListBusy(true); window.feedbackTest.settleNavigation()");
  await quiet();
  await evaluate("window.feedbackTest.setListBusy(false)"); await waitFor(feedbackOpen);
  await click("Not now"); await quiet();
  console.log("PASS first accepted launch waits for existing list navigation, loading and confirmation toast");

  await evaluate("window.feedbackTest.mock.historicalTest = false; window.feedbackTest.mock.failTest = true");
  await switchUser("browser-user-d");
  await click("Send test email"); await quiet();
  await evaluate("window.feedbackTest.mock.cancelTest = true"); await click("Send test email"); await quiet();
  await click("Send test email"); await quiet();
  await evaluate("window.feedbackTest.setOtherModal(true)");
  await click("Send test email"); await quiet();
  await click("Close existing dialog"); await waitFor(feedbackOpen);
  await evaluate('document.querySelector("[data-setup-feedback-root] .fixed.inset-0").click()');
  await quiet();
  console.log("PASS failed/cancelled tests never count; legacy dialog blocks prompt; backdrop snoozes");

  await switchUser("browser-user-e");
  await evaluate("window.feedbackTest.setEnabled(false)");
  await click("Send test email"); await quiet();
  await click("Send test email"); await quiet();
  console.log("PASS disabled automatic prompting remains off even when eligible");

  console.log("All mocked browser checks passed. No outreach or live campaign requests were made.");
} catch (error) {
  console.error(error.stack ?? String(error));
  process.exitCode = 1;
} finally {
  process.chdir(root);
  client?.socket.close();
  if (chrome) {
    const exited = new Promise((resolve) => chrome.once("exit", resolve));
    chrome.kill("SIGTERM");
    await Promise.race([exited, pause(2000)]);
  }
  if (server) await new Promise((resolve) => server.close(resolve));
  await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
