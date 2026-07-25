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
} from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";

interface Step4LaunchProps {
  remoteContext: NewCopilotContext;
  onLaunch: () => void;
  launching: boolean;
}

export default function Step4Launch({
  remoteContext,
  onLaunch,
  launching,
}: Step4LaunchProps) {
  const { copilotData, setStep } = useCopilotStore();

  const selectedEmailProfile = remoteContext.emailProfiles.find(
    (p) => p.id === copilotData.emailProfileId,
  );
  const selectedScrapeProfile = remoteContext.scrapeProfiles.find(
    (p) => p.id === copilotData.scrapeProfileId,
  );
  const selectedTemplate = remoteContext.templates?.find(
    (t) => t.id === copilotData.templateId,
  );

  const formatActiveDays = (days: string[] = []) => {
    if (days.length === 0) return "None";
    if (days.length === 7) return "Monday - Sunday";
    if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun"))
      return "Monday - Friday";
    return days.join(", ");
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Review your copilot
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Everything looks good! Review your settings before launching.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Card 1: Setup */}
        <div
          onClick={() => setStep(1)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/10  hover:border-transparent transition-colors"
        >
          <div className="flex items-start gap-3">
            <SlidersHorizontal
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-700 group-hover:text-primary mb-4">
                Setup
              </h3>
              <div className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
                <div className="font-semibold text-gray-700 group-hover:text-primary">
                  Copilot name
                </div>
                <div className="text-gray-700 group-hover:text-blue-500">
                  {copilotData.name || "N/A"}
                </div>
                <div className="font-semibold text-gray-700 group-hover:text-primary">
                  Goal
                </div>
                <div className="text-gray-700 group-hover:text-blue-500">
                  {copilotData.goal || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Email account */}
        <div
          onClick={() => setStep(2)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/10  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <Mail
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Email account
              </h3>
              <div className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Sending as
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedEmailProfile?.name || "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Email account
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  Connected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Target audience */}
        <div
          onClick={() => setStep(3)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/10  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <Target
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Target audience
              </h3>
              <div className="grid grid-cols-[130px_1fr] gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Industry
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.targetProfile?.industries?.join(", ") || "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Location
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.targetProfile?.countries?.join(", ") || "N/A"}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Est. audience size
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {selectedScrapeProfile ? "8,420 companies" : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Email Template */}
        <div
          onClick={() => setStep(4)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/10  hover:border-transparent transition-colors "
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
              <div className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
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
                  4 steps
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Total touches
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">4</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Schedule */}
        <div
          onClick={() => setStep(5)}
          className="group bg-white border  border-gray-100 rounded-xl p-5 hover:bg-primary/10  hover:border-transparent transition-colors "
        >
          <div className="flex items-start gap-3">
            <CalendarDays
              size={20}
              className="text-gray-700 group-hover:text-primary mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-4">
                Schedule
              </h3>
              <div className="grid grid-cols-[110px_1fr] gap-y-3 text-sm">
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Daily send limit
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.sendLimit} emails per day
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Active days
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {formatActiveDays(copilotData.settings?.schedule?.activeDays)}
                </div>
                <div className="font-semibold text-gray-900 group-hover:text-primary">
                  Sending hours
                </div>
                <div className="text-gray-500 group-hover:text-blue-500">
                  {copilotData.settings?.timezone
                    ?.split(" ")
                    ?.slice(0, 2)
                    ?.join(" ")}
                  <br />
                  {copilotData.settings?.schedule?.fromTime} -{" "}
                  {copilotData.settings?.schedule?.toTime}
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
              className="text-emerald-500  mt-0.5 shrink-0"
            />
            <div className="w-full">
              <h3 className="text-sm font-semibold text-emerald-500 mb-4">
                You're ready to take off !
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm text-emerald-600">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Email template</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Email account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>Target audience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white rounded-full p-0.5">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>You are ready to fly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(5)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onLaunch}
          disabled={launching || remoteContext.loadingOptions}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket size={15} /> {launching ? "Launching..." : "Launch Copilot"}
        </button>
      </div>
    </div>
  );
}
