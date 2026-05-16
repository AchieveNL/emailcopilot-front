"use client";

import { Clock, ArrowRight, X } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

const dailyLimits = ["10", "20", "30", "40", "50", "100"];
const speeds = ["Slow", "Normal (Recommended)", "Fast"];
const timezones = [
  "(GMT-12:00) International Date Line West",
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT-07:00) Mountain Time (US & Canada)",
  "(GMT-06:00) Central Time (US & Canada)",
  "(GMT-05:00) Eastern Time (US & Canada)",
  "(GMT+00:00) UTC",
  "(GMT+01:00) Central European Time",
  "(GMT+05:30) India Standard Time",
  "(GMT+08:00) China Standard Time",
  "(GMT+09:00) Japan Standard Time",
];

export default function Step1Settings() {
  const { copilotData, updateCopilotData, updateSettings, setStep } = useCopilotStore();

  const handleSubmit = () => {
    if (!copilotData.name.trim()) return;
    setStep(2);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-1">Copilot Settings</h2>
      <p className="text-sm text-gray-500 mb-6">Basic information and behavior for your copilot.</p>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5" htmlFor="name">
            Copilot name
          </label>
          <input
            id="name"
            type="text"
            value={copilotData.name}
            onChange={(e) => updateCopilotData({ name: e.target.value })}
            placeholder="Enter copilot name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm transition-colors"
          />
          <p className="mt-1.5 text-xs text-gray-500">Internal name to identify your copilot.</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5" htmlFor="desc">
            Description <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            id="desc"
            rows={3}
            value={copilotData.description}
            onChange={(e) => updateCopilotData({ description: e.target.value })}
            placeholder="Add a description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm resize-none transition-colors"
          />
          <p className="mt-1.5 text-xs text-gray-500">This helps you remember what this copilot is for.</p>
        </div>

        {/* Daily Limit + Speed */}
        <div className="grid grid-cols-2 gap-6 pt-1">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1" htmlFor="daily">
              Daily email limit
            </label>
            <p className="mb-2 text-xs text-gray-500">Maximum number of emails to send per day.</p>
            <select
              id="daily"
              value={copilotData.sendLimit}
              onChange={(e) => updateCopilotData({ sendLimit: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm bg-white"
            >
              {dailyLimits.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1" htmlFor="speed">
              Email sending speed
            </label>
            <p className="mb-2 text-xs text-gray-500">Control how fast emails are sent.</p>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                id="speed"
                value={copilotData.settings.sendingSpeed}
                onChange={(e) => updateSettings({ sendingSpeed: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm shadow-sm bg-white appearance-none"
              >
                {speeds.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Timezone */}
        {/*    <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1" htmlFor="tz">
            Time zone
          </label>
          <p className="mb-2 text-xs text-gray-500">Used to schedule and send emails at the right time.</p>
          <select
            id="tz"
            value={copilotData.settings.timezone}
            onChange={(e) => updateSettings({ timezone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm shadow-sm bg-white"
          >
            {timezones.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div> */}

        {/* Schedule Time Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5" htmlFor="runAt">
            Scheduled run time <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">Set a specific time to run the copilot daily.</p>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="runAt"
                type="time"
                value={copilotData.settings.schedule.runAt}
                onChange={(e) => updateSettings({ schedule: { runAt: e.target.value } })}
                className="w-40 border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm shadow-sm bg-white"
              />
            </div>
            {copilotData.settings.schedule.runAt && (
              <button
                type="button"
                onClick={() => updateSettings({ schedule: { runAt: "" } })}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-700 transition-colors"
          >
            Save &amp; Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
