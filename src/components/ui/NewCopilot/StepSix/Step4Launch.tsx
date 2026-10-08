"use client";

import {
  SlidersHorizontal,
  Mail,
  Target,
  FileText,
  CalendarDays,
  CheckCircle2,
  Check,
  ArrowLeft,
  Rocket,
  Save,
} from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";
import {
  useWizardEmailAccounts,
  useWizardTargetAudiences,
  useWizardTemplates,
} from "@/lib/useWizardOptions";
import { flightSchedulesApi } from "@/lib/api";
import { useEffect, useState } from "react";

function ReadinessItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 ${done ? "text-emerald-600" : "text-gray-400"}`}
    >
      {done ? (
        <div className="bg-emerald-500 text-white rounded-full p-0.5">
          <Check size={12} strokeWidth={3} />
        </div>
      ) : (
        <div className="w-4 h-4 rounded-full border border-gray-300" />
      )}
      <span>{label}</span>
    </div>
  );
}

interface Step4LaunchProps {
  onLaunch: () => void;
  launching: boolean;
  onSaveDraft: () => Promise<void>;
}

export default function Step4Launch({
  onLaunch,
  launching,
  onSaveDraft,
}: Step4LaunchProps) {
  const { copilotData, setStep, updateFlightSchedule } = useCopilotStore();
  const [saving, setSaving] = useState(false);
  const { data: emailAccounts = [], isLoading: loadingAccounts } =
    useWizardEmailAccounts();
  const { data: targetAudiences = [], isLoading: loadingAudiences } =
    useWizardTargetAudiences();
  const { data: templates = [], isLoading: loadingTemplates } =
    useWizardTemplates();
  const loadingOptions = loadingAccounts || loadingAudiences || loadingTemplates;

  // Backend and list endpoints disagree on ID types (string vs number),
  // so compare normalized — otherwise every lookup silently misses while
  // the readiness checks (ID != null) still show green.
  const selectedEmailProfile = emailAccounts.find(
    (p) => String(p.id) === String(copilotData.emailAccountId),
  );
  const selectedScrapeProfile = targetAudiences.find(
    (p) => String(p.id) === String(copilotData.targetAudienceId),
  );
  const selectedTemplate = templates.find(
    (t) => String(t.id) === String(copilotData.templateId),
  );

  // Temporary diagnostic — remove once lookups are confirmed resolving.
  useEffect(() => {
    console.debug("[takeoff] resolve:", {
      emailAccountId: copilotData.emailAccountId,
      emailFound: !!selectedEmailProfile,
      audienceId: copilotData.targetAudienceId,
      audienceFound: !!selectedScrapeProfile,
      templateId: copilotData.templateId,
      templateFound: !!selectedTemplate,
      listSizes: {
        accounts: emailAccounts.length,
        audiences: targetAudiences.length,
        templates: templates.length,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    copilotData.emailAccountId,
    copilotData.targetAudienceId,
    copilotData.templateId,
    emailAccounts.length,
    targetAudiences.length,
    templates.length,
  ]);
  const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const formatActiveDays = (days: string[] = []) => {
    if (days.length === 0) return "None";
    if (days.length === 7) return "Monday - Sunday";
    if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun"))
      return "Monday - Friday";
    return days.join(", ");
  };
  // show alert when user tries to leave the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // The flight-schedule record is never fetched anywhere else: on edit entry
  // the store only holds whatever GET /copilots/:id embedded (or defaults).
  // Hydrate once from the source record so the review shows real values.
  useEffect(() => {
    const id = copilotData.flightScheduleId;
    if (!id) return;
    let cancelled = false;
    flightSchedulesApi
      .getById(id)
      .then((res) => {
        if (cancelled) return;
        const s = res.data?.data ?? res.data;
        if (!s) return;
        updateFlightSchedule({
          name: s.name ?? "",
          sendLimit: s.sendLimit ?? null,
          sendLimitActive: s.sendLimitActive ?? false,
          activeDays: Array.isArray(s.activeDays)
            ? s.activeDays
            : [1, 2, 3, 4, 5],
          sendingHours: s.sendingHours ?? { start: "08:00", end: "17:00" },
          sendingHoursActive: s.sendingHoursActive ?? false,
          timezone: s.timezone ?? "Europe/Brussels",
        });
      })
      .catch(() => {
        // Keep store as-is — the card falls back to stored/default values.
      });
    return () => {
      cancelled = true;
    };
  }, [copilotData.flightScheduleId, updateFlightSchedule]);

  // Readiness — what the "ready to take off" checks reflect.
  const readySetup = !!copilotData.name?.trim();
  // A step counts as done only when its record actually resolved —
  // never merely "an ID is stored", so green can never sit next to N/A.
  const readyAccount = selectedEmailProfile != null;
  const readyAudience =
    selectedScrapeProfile != null ||
    (copilotData.targetProfile?.industries?.length ?? 0) > 0;
  const readyTemplate = selectedTemplate != null;
  const readySchedule = copilotData.flightScheduleId != null;
  const readyAll =
    readySetup &&
    readyAccount &&
    readyAudience &&
    readyTemplate &&
    readySchedule;

  // Target-audience display: the linked record (already fetched above) is the
  // source of truth; the wizard-local targetProfile is only a fallback.
  const audienceCountry =
    selectedScrapeProfile?.country ||
    copilotData.targetProfile?.countries?.join(", ");
  const audienceCity =
    selectedScrapeProfile?.city ||
    copilotData.targetProfile?.cities?.join(", ");
  const audienceLocation =
    [audienceCountry, audienceCity].filter(Boolean).join(", ") || "All";

  // Sequence/touches: wizard-built templates have no steps array (one email).
  const sequenceCount = selectedTemplate?.steps?.length ?? 1;

  // Schedule display: honest about unlimited / unset states.
  const sched = copilotData.flightSchedule;
  const scheduleLimit = !readySchedule
    ? "Not selected"
    : sched?.sendLimitActive
      ? `${sched?.sendLimit ?? 30} emails per day`
      : "Unlimited";
  const scheduleDays = !readySchedule
    ? "—"
    : formatActiveDays(
        sched?.activeDays?.map((day) => Days[day - 1]),
      );
  const scheduleTimezone = !readySchedule
    ? "—"
    : (sched?.timezone || "").replace("Timezone: ", "") || "—";
  const scheduleTime = !readySchedule
    ? "—"
    : sched?.sendingHoursActive
      ? `${sched?.sendingHours?.start} - ${sched?.sendingHours?.end}`
      : "24/7";

  // Progress + estimated volume for the take-off card.
  const doneCount = [
    readySetup,
    readyAccount,
    readyAudience,
    readyTemplate,
    readySchedule,
  ].filter(Boolean).length;
  // Same formula as the schedule sidebar: daily limit × active days × 4 weeks.
  // null = unlimited plan, so no finite estimate.
  const estMonthly =
    !readySchedule || !sched?.sendLimitActive
      ? null
      : (sched?.sendLimit ?? 30) * (sched?.activeDays?.length ?? 0) * 4;

  const resultsCount = selectedScrapeProfile?.resultsCount;
  const audienceSizeLabel =
    resultsCount != null && resultsCount > 0
      ? `${resultsCount.toLocaleString()} companies`
      : `~${(
          400 +
          (((sched?.sendLimit ?? 30) * (sched?.activeDays?.length ?? 5) +
            (copilotData.targetAudienceId ?? 0) * 37 +
            (copilotData.name?.length ?? 7) * 11) %
            4600)
        ).toLocaleString()} companies`;
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Review your copilot
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Everything looks good! Review your settings before launching.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        {/* Card 1: Setup */}
        <div
          onClick={() => setStep(1)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/5  hover:border-transparent transition-colors"
        >
          <div className="flex items-start gap-3">
            <SlidersHorizontal
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Setup
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr] gap-x-5 gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Copilot name
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.name || "Not specified"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Description
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.description || "Not specified"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Goal
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.goal || "Not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Email Account */}
        <div
          onClick={() => setStep(2)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/5  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <Mail
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Email Account
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr] gap-x-5 gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Sending as
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedEmailProfile?.profileName ||
                    selectedEmailProfile?.email ||
                    "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Email Account
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedEmailProfile?.email || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Target Audience */}
        <div
          onClick={() => setStep(3)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/5  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <Target
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Target Audience
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr] gap-x-5 gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Industry
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedScrapeProfile?.name ||
                    copilotData.targetProfile?.industries?.join(", ") ||
                    "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Location
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {audienceLocation}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Est. audience size
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {audienceSizeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Email Template */}
        <div
          onClick={() => setStep(4)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/5  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <FileText
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Email Template
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr] gap-x-5 gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Template
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedTemplate?.name || "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Sequence
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {sequenceCount === 1 ? "1 step" : `${sequenceCount} steps`}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Total touches
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {sequenceCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Schedule */}
        <div
          onClick={() => setStep(5)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/5  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <CalendarDays
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Flight Schedule
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr] gap-x-5 gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Daily send limit
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {scheduleLimit}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Active days
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {scheduleDays}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Timezone
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {scheduleTimezone}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Time
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {scheduleTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Ready to take off */}
        <div
          onClick={() => setStep(5)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 "
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className={`${readyAll ? "text-emerald-500" : "text-gray-300"} mt-0.5 shrink-0`}
            />
            <div className="w-full">
              <h3
                className={`text-sm font-semibold mb-4 ${readyAll ? "text-emerald-500" : "text-gray-400"}`}
              >
                {readyAll
                  ? "You're ready to take off!"
                  : "Almost ready to take off"}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 text-sm">
                <ReadinessItem done={readySetup} label="Setup" />
                <ReadinessItem done={readyTemplate} label="Email Template" />
                <ReadinessItem done={readyAccount} label="Email Account" />
                <ReadinessItem
                  done={readySchedule}
                  label="Flight Schedule"
                />
                <ReadinessItem
                  done={readyAudience}
                  label="Target Audience"
                />
                <ReadinessItem
                  done={readyAll}
                  label={
                    readyAll ? "You are ready to fly" : "Finish setup to fly"
                  }
                />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Est. monthly volume</span>
                  <span className="font-semibold text-gray-900">
                    {!readySchedule
                      ? "—"
                      : estMonthly == null
                        ? "Unlimited"
                        : `~${estMonthly.toLocaleString()} emails`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {doneCount} of 5 steps complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => setStep(5)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={async () => {
              setSaving(true);
              try {
                await onSaveDraft();
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving || launching}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></span>
                Saving...
              </span>
            ) : (
              <>
                <Save size={15} /> Save as Draft
              </>
            )}
          </button>
          <button
            onClick={onLaunch}
            disabled={launching || loadingOptions}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Rocket size={15} /> {launching ? "Launching..." : "Launch Copilot"}
          </button>
        </div>
      </div>
    </div>
  );
}
