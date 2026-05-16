"use client";

import { ArrowLeft, Rocket, Settings, Mail, Database, FileText, Clock, Calendar } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";

interface Step4LaunchProps {
  remoteContext: NewCopilotContext;
  onLaunch: () => void;
  launching: boolean;
}

export default function Step4Launch({ remoteContext, onLaunch, launching }: Step4LaunchProps) {
  const { copilotData, setStep } = useCopilotStore();

  const selectedEmailProfile = remoteContext.emailProfiles.find(
    (p) => p.id === copilotData.emailProfileId
  );
  const selectedScrapeProfile = remoteContext.scrapeProfiles.find(
    (p) => p.id === copilotData.scrapeProfileId
  );
  const selectedTemplate = remoteContext.templates?.find(
    (t) => t.id === copilotData.templateId
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-1">Review &amp; Launch</h2>
      <p className="text-sm text-gray-500 mb-6">
        Everything looks good? Launch your copilot to start sending.
      </p>

      <div className="space-y-4 mb-8">
        {/* Settings summary */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Settings size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Settings</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Copilot Name</span>
              <span className="font-medium text-gray-900">{copilotData.name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Daily Limit</span>
              <span className="font-medium text-gray-900">
                {copilotData.sendLimit} emails/day
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Sending Speed</span>
              <span className="font-medium text-gray-900">
                {copilotData.settings.sendingSpeed}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">Time Zone</span>
              <span className="font-medium text-gray-900 text-xs">
                {copilotData.settings.timezone}
              </span>
            </div>
          </div>
        </div>

        {/* Email profile summary */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Mail size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Email Profile</span>
          </div>
          {selectedEmailProfile && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                {selectedEmailProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedEmailProfile.name}
                </div>
                <div className="text-xs text-gray-500">
                  Profile ID: {selectedEmailProfile.id}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Template summary */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Email Template</span>
          </div>
          {selectedTemplate ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center">
                <FileText size={15} className="text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedTemplate.name}
                </div>
                <div className="text-xs text-gray-500">
                  Template ID: {selectedTemplate.id}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No template selected.</p>
          )}
        </div>

        {/* Scrape profile summary */}
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Database size={14} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Scrape Profile</span>
          </div>
          {selectedScrapeProfile && (
            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedScrapeProfile.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Profile ID: {selectedScrapeProfile.id}
              </div>
            </div>
          )}
        </div>

        {/* Estimated stats */}
        <div className="border border-gray-100 rounded-xl p-4 bg-blue-50">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-3">
            Estimated Reach
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900">
                {parseInt(copilotData.sendLimit.toString()).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-0.5">
                <Clock size={10} /> emails/day
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {(parseInt(copilotData.sendLimit.toString()) * 7).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-0.5">
                <Calendar size={10} /> emails/week
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">—</div>
              <div className="text-xs text-gray-500 mt-0.5">total leads</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onLaunch}
          disabled={launching || remoteContext.loadingOptions}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket size={15} /> {launching ? "Launching..." : "Launch Copilot"}
        </button>
      </div>
    </div>
  );
}