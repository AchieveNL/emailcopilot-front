"use client";

import { ArrowRight, ArrowLeft, CheckCircle2, Database } from "lucide-react";
import clsx from "clsx";
import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";

interface Step3ScrapeProfileProps {
  remoteContext: NewCopilotContext;
}

export default function Step3ScrapeProfile({
  remoteContext,
}: Step3ScrapeProfileProps) {
  const { copilotData, updateCopilotData, setStep } = useCopilotStore();

  const handleSelectProfile = (profileId: number) => {
    updateCopilotData({ scrapeProfileId: profileId });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 ">
      <h2 className="text-lg font-bold mb-1">Scrape Profile</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose the data source for your outreach targets.
      </p>

      <div className="space-y-3 mb-8">
        {remoteContext.scrapeProfiles.map((profile) => {
          const selected = copilotData.scrapeProfileId === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => handleSelectProfile(profile.id)}
              className={clsx(
                "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                selected
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Database size={16} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {profile.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <span>Profile ID: {profile.id}</span>
                  </div>
                </div>
              </div>
              {selected && (
                <CheckCircle2
                  size={18}
                  className="text-gray-900 flex-shrink-0"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={() => {
            if (copilotData.scrapeProfileId) setStep(4);
          }}
          disabled={
            !copilotData.scrapeProfileId || remoteContext.loadingOptions
          }
          className={clsx(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors",
            copilotData.scrapeProfileId && !remoteContext.loadingOptions
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          Save &amp; Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
