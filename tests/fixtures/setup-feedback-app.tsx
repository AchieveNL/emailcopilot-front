import React, { useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, CanceledError } from "axios";
import { Toaster } from "sonner";
import api from "../../src/lib/api";
import { SetupFeedbackHost } from "../../src/lib/SetupFeedbackProvider";
import { setupFeedbackApi } from "../../src/lib/setup-feedback-api";
import { SETUP_FEEDBACK_VERSION, type FeedbackTransport } from "../../src/lib/setup-feedback";
import { applyFeedbackCommand, createFeedbackRecord, feedbackState, type FeedbackCommand, type FeedbackRecord } from "../../src/lib/setup-feedback-state";
import CopilotsPage from "../../src/app/dashboard/copilots/page";
import { useCopilotStore } from "../../src/store/copilotStore";
import NewCopilotPage from "../../src/app/dashboard/copilots/new/page";
import { Platform } from "./feedback-platform";

const campaign = {
  id: 42, name: "Mock campaign", description: "", goal: "", status: "draft" as const, emailsSent: 0,
  emailAccountId: 1, targetAudienceId: 2, templateId: 3, flightScheduleId: 4,
  emailAccount: { id: 1, email: "test@example.invalid" },
  targetAudience: { id: 2, name: "Mock audience", resultsCount: 10 },
  template: { id: 3, name: "Mock template", body: "<p>Mock only</p>" },
  // Feedback scenarios must not depend on the real clock; schedule boundaries have their own tests.
  flightSchedule: { name: "Mock all days", activeDays: [1, 2, 3, 4, 5, 6, 7], sendLimitActive: true, sendLimit: 10,
    sendingHoursActive: false, sendingHours: { start: "09:00", end: "17:00" }, timezone: "UTC" },
  targetProfile: { industries: [], countries: [], cities: [] },
};

export const mock = {
  testRequests: 0, feedbackRequests: [] as { payload: unknown; key: string }[],
  historicalTest: false, failTest: false, cancelTest: false, failLaunch: false, failFeedback: false,
  destination: "", pending: 0, calls: [] as string[], creations: 0, failCreate: false, cancelCreate: false, existingIds: [] as number[], timeOffset: 0,
};

// Every API call goes through this adapter. No request can reach an actual API.
api.defaults.adapter = async (config) => {
  const url = config.url ?? "";
  const method = config.method ?? "get";
  mock.calls.push(`${method} ${url}`);
  mock.pending++;
  try {
    await new Promise((resolve) => setTimeout(resolve, 30));
    let data: unknown = [];
    const headers: Record<string, string> = {};
    if (url === "/copilots" && method === "post") {
      if (mock.cancelCreate) { mock.cancelCreate = false; throw new CanceledError("Mock cancelled creation"); }
      if (mock.failCreate) { mock.failCreate = false; throw new AxiosError("Mock creation failed"); }
      data = { ...campaign, id: 100 + ++mock.creations };
    } else if (url === "/copilots") {
      data = (mock.existingIds.length ? mock.existingIds : [42]).map((id) => ({ ...campaign, id }));
    } else if (url === "/email-accounts") {
      data = [];
    } else if (/^\/copilots\/\d+\/test-email$/.test(url) && method === "post") {
      mock.testRequests++;
      if (mock.cancelTest) { mock.cancelTest = false; throw new CanceledError("Mock cancellation"); }
      if (mock.failTest) { mock.failTest = false; throw new AxiosError("Mock failed send"); }
      headers["x-request-id"] = `mock-test-${crypto.randomUUID()}`;
      data = { status: "queued" };
    } else if (/^\/copilots\/\d+\/test-email$/.test(url)) {
      data = { latestTest: mock.historicalTest ? { id: "historic" } : null, testedCurrentConfiguration: false };
    } else if (/^\/copilots\/\d+\/status$/.test(url) && method === "patch") {
      if (mock.failLaunch) { mock.failLaunch = false; throw new AxiosError("Mock launch failed"); }
      data = { id: 42, status: "active" };
    } else if (url === "/copilots/42") {
      data = campaign;
    } else if (/^\/copilots\/\d+$/.test(url)) {
      data = { ...campaign, id: Number(url.split("/").pop()) };
    } else if (url === "/flight-schedules/4") {
      data = campaign.flightSchedule;
    } else if (url === "/templates/3") {
      data = campaign.template;
    } else if (url === "/templates") {
      data = [campaign.template];
    } else if (url === "/billing/subscription") {
      data = { id: 1, planId: "starter", status: "active" };
    } else if (url === "/billing/limits") {
      data = { active: true, planId: "starter", limits: { copilots: 10, emailsPerMonth: 1000 },
        usage: { activeCopilots: 1, emailsSent: 0, emailsPercent: 0 }, remaining: { copilots: 9, emails: 1000 } };
    } else if (url === "/feedback/copilot-setup") {
      mock.feedbackRequests.push({ payload: JSON.parse(config.data), key: String(config.headers.get("Idempotency-Key")) });
      if (mock.failFeedback) { mock.failFeedback = false; throw new AxiosError("Mock feedback unavailable"); }
      data = { id: "mock-feedback", accepted: true };
    } else if (!url.startsWith("/billing/")) {
      throw new Error(`Unmocked API: ${method} ${url}`);
    }
    return { data, headers, config, status: url.endsWith("/test-email") && method === "post" ? 202 : 201, statusText: "Mock accepted" };
  } finally {
    mock.pending--;
  }
};

function resetWizard() {
  mock.destination = "";
  useCopilotStore.getState().resetStore();
  useCopilotStore.setState({ currentStep: 6, highestStep: 6, draftId: 42, copilotData: campaign });
}
resetWizard();

function mockFeedbackTransport(userId: string): FeedbackTransport {
  if (userId === "browser-user-a" || userId === "browser-user-api-launch") {
    // Creation reproduction uses the production HTTP adapter and actual route /
    // file store. Only Clerk's session lookup is replaced on the test server.
    const apiForUser = () => {
      document.cookie = `feedback-test-user=${encodeURIComponent(userId)}; Path=/; SameSite=Strict`;
      return setupFeedbackApi;
    };
    return {
      load: () => apiForUser().load(),
      record: (event) => apiForUser().record(event),
      claim: (offerId) => apiForUser().claim(offerId),
      snooze: (offerId) => apiForUser().snooze(offerId),
      submit: (payload, id) => apiForUser().submit(payload, id),
    };
  }
  const key = `mock-feedback-server:${SETUP_FEEDBACK_VERSION}:${userId}`;
  const now = () => Date.now() + mock.timeOffset;
  const load = (): FeedbackRecord => JSON.parse(localStorage.getItem(key) ?? "null") ?? createFeedbackRecord(userId, SETUP_FEEDBACK_VERSION);
  const change = async (command: FeedbackCommand) => {
    const result = applyFeedbackCommand(load(), command, now());
    localStorage.setItem(key, JSON.stringify(result.record));
    return result.reply;
  };
  return {
    load: async () => feedbackState(load(), now()),
    record: (event) => change({ operation: "success", event }),
    claim: (offerId) => change({ operation: "claim", offerId }),
    snooze: (offerId) => change({ operation: "snooze", offerId }),
    submit: async (payload, submissionId) => {
      mock.feedbackRequests.push({ payload, key: submissionId });
      if (mock.failFeedback) { mock.failFeedback = false; throw new Error("Mock feedback unavailable"); }
      const reply = await change({ operation: "submit", rating: payload.rating, comment: payload.comment });
      return { status: 200, state: reply.state };
    },
  };
}

function advanceMockClock(days: number) { mock.timeOffset += days * 24 * 60 * 60 * 1000; }

function App() {
  const [userId, setUserId] = useState(new URLSearchParams(location.search).get("user") ?? "browser-user-a");
  const [pathname, setPathname] = useState("/dashboard/copilots/new");
  const [search, setSearch] = useState("edit=42");
  const [epoch, setEpoch] = useState(0);
  const [otherModal, setOtherModal] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [listBusy, setListBusy] = useState(false);
  const transport = useMemo(() => mockFeedbackTransport(userId), [userId]);
  const queryClient = useMemo(() => new QueryClient({ defaultOptions: { queries: { retry: false, meta: { userId } } } }), [userId]);
  const push = useCallback((path: string) => {
    mock.destination = path;
    if (path.startsWith("/dashboard/copilots/new?")) setSearch(path.split("?")[1]);
  }, []);
  const platform = useMemo(() => ({ userId, pathname, search, push }), [userId, pathname, search, push]);
  const controls = {
    mock,
    switchUser(next: string) {
      resetWizard(); setPathname("/dashboard/copilots/new"); setSearch("edit=42"); setUserId(next); setOtherModal(false);
      history.replaceState({}, "", `/?user=${next}`);
    },
    remountReview() { resetWizard(); setSearch("edit=42"); queryClient.clear(); setEpoch((value) => value + 1); },
    goTemplate() { useCopilotStore.getState().setStep(4); },
    goCreate() {
      useCopilotStore.getState().resetStore();
      setSearch("");
    },
    reviewCreated() {
      const id = Number(new URLSearchParams(search).get("edit"));
      // Supply linked mock records for steps 2–5; creation/test/launch still use
      // the real UI handlers, not direct calls to the feedback controller.
      useCopilotStore.setState({ currentStep: 6, highestStep: 6, draftId: id, copilotData: { ...campaign, id } });
    },
    createCampaign() { return api.post("/copilots", { name: "Mock new copilot" }).catch(() => {}); },
    settleNavigation() {
      const url = new URL(mock.destination, location.origin);
      setPathname(url.pathname);
      setSearch(url.search.slice(1));
    },
    advanceDays: advanceMockClock,
    setOtherModal, setEnabled, setListBusy,
  };
  Object.assign(window, { feedbackTest: controls });

  return (
    <Platform.Provider value={platform}>
      <QueryClientProvider client={queryClient}>
        <SetupFeedbackHost key={userId} userId={userId} pathname={pathname} enabled={enabled} transport={transport}>
          <main id="dashboard-main" aria-busy={listBusy} className="mx-auto max-w-5xl p-6">
            {pathname === "/dashboard/copilots/new" ? <NewCopilotPage key={epoch} /> : <CopilotsPage />}
          </main>
          {otherModal && <>
            <div className="fixed inset-0 z-40 bg-black/20" />
            <div className="fixed left-1/2 top-1/2 z-120 rounded-xl bg-white p-6">
              <p>Existing legacy dialog</p><button onClick={() => setOtherModal(false)}>Close existing dialog</button>
            </div>
          </>}
        </SetupFeedbackHost>
      </QueryClientProvider>
      <Toaster duration={200} />
    </Platform.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
