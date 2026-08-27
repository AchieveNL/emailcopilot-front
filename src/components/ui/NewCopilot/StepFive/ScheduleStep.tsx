"use client";

import React, { useState } from "react";
import StepsActions from "../StepsActions";
import { useCopilotStore } from "../../../../../store/copilotStore";
import { Clock, Minus, Plus, ChevronDown, CircleAlert } from "lucide-react";
import ct from "countries-and-timezones";
import { flightSchedulesApi } from "@/lib/api";
import { toast } from "sonner";

const DAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 7, label: "Sun" },
] as const;

const DEFAULT_TIMEZONE = "Europe/Brussels";

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

const TIMEZONES = Object.values(ct.getAllTimezones()).map((tz) => ({
  name: tz.name,
  utcOffset: tz.utcOffset,
}));

export default function ScheduleStep({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { copilotData, updateCopilotData, updateFlightSchedule, setStep } =
    useCopilotStore();

  const schedule = copilotData.flightSchedule;
  const selectedId = copilotData.flightScheduleId;

  const [loading, setLoading] = useState(false);

  const toggleDay = (day: number) => {
    let newDays;
    if (schedule.activeDays.includes(day)) {
      newDays = schedule.activeDays.filter((d) => d !== day);
    } else {
      newDays = [...schedule.activeDays, day];
    }
    updateFlightSchedule({ activeDays: newDays.sort() });
  };

  const handleSave = async () => {
    if (selectedId) {
      // User selected an existing schedule
      setStep(6);
      return;
    }

    if (schedule.activeDays.length === 0) {
      toast.error("Please select at least one active day.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: schedule.name || "Custom Copilot Schedule",
        sendLimit: schedule.sendLimitActive ? schedule.sendLimit : null,
        sendLimitActive: schedule.sendLimitActive,
        activeDays: schedule.activeDays,
        sendingHours: schedule.sendingHours,
        sendingHoursActive: schedule.sendingHoursActive,
        timezone: schedule.timezone,
      };

      const res = await flightSchedulesApi.create(payload);

      // Update the copilot store with the new schedule ID
      updateCopilotData({ flightScheduleId: res.data.id });
      setStep(6);
    } catch (error) {
      toast.error("Failed to create flight schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-transparent min-h-[600px] text-slate-800">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Configure Flight Schedule
        </h1>
        <p className="text-sm text-slate-500">
          Choose when and how your copilot sends emails.
        </p>
      </div>

      <div
        className={`flex flex-col gap-8 w-full max-w-4xl transition-opacity ${selectedId ? "opacity-50 pointer-events-none" : "opacity-100"}`}
      >
        {selectedId && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-4 text-sm flex items-center justify-center">
            <CircleAlert className="w-5 h-5 mr-2" />
            You have selected an existing schedule above. Deselect it to create
            a custom one here.
          </div>
        )}

        <div className="border-b border-slate-100 pb-8">
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Schedule Name (if creating new)
          </h3>
          <input
            type="text"
            value={schedule.name}
            onChange={(e) => updateFlightSchedule({ name: e.target.value })}
            placeholder="e.g. My Custom Schedule"
            className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          />
        </div>

        {/* Daily send limit */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 border-b border-slate-100 pb-8">
          <div className=" col-span-1 lg:col-span-2 ">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Daily send limit
            </h3>
            <p className="text-xs text-slate-500">
              Maximum number of new emails to send per day.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-4 flex items-start gap-4 flex-1 pt-1">
            {schedule.sendLimitActive ? (
              <div className=" w-full flex flex-col pt-1">
                <div className="flex items-center">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        updateFlightSchedule({
                          sendLimit: Math.max(
                            1,
                            (schedule.sendLimit || 30) - 1,
                          ),
                        })
                      }
                      className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="px-4 py-2 min-w-[60px] text-center text-sm font-medium border-x border-slate-200">
                      {schedule.sendLimit || 30}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateFlightSchedule({
                          sendLimit: (schedule.sendLimit || 30) + 1,
                        })
                      }
                      className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Recommended: 20-50 per day for best deliverability
                </div>
              </div>
            ) : (
              <div className=" w-full flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <CircleAlert className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Unlimited sending
                  </h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Your copilot will send as many emails as possible within the
                    active hours each day.
                  </p>
                </div>
              </div>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  updateFlightSchedule({
                    sendLimitActive: !schedule.sendLimitActive,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${
                  schedule.sendLimitActive ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform ${
                    schedule.sendLimitActive ? "translate-x-5" : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Active days */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 border-b border-slate-100 pb-8">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Active days
            </h3>
            <p className="text-xs text-slate-500">
              Choose which days your copilot is allowed to send emails.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-wrap gap-2 flex-1 pt-1">
            {DAYS.map(({ value, label }) => {
              const isActive = schedule.activeDays.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleDay(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                    isActive
                      ? "border-blue-400 text-blue-600 bg-blue-50/30"
                      : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sending hours */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 border-b border-slate-100 pb-8">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center pr-2">
              Sending hours
              <span className="font-normal text-slate-400 text-xs ml-1">
                (your timezone)
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Set the daily time window when your copilot can send emails.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-4 flex items-start gap-4 flex-1 pt-1">
            {schedule.sendingHoursActive ? (
              <div className="flex flex-wrap items-center gap-4 flex-1 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    From
                  </span>
                  <div className="relative">
                    <select
                      value={schedule.sendingHours.start}
                      onChange={(e) =>
                        updateFlightSchedule({
                          sendingHours: {
                            ...schedule.sendingHours,
                            start: e.target.value,
                          },
                        })
                      }
                      className="appearance-none pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-700"
                    >
                      {HOURS.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">To</span>
                  <div className="relative">
                    <select
                      value={schedule.sendingHours.end}
                      onChange={(e) =>
                        updateFlightSchedule({
                          sendingHours: {
                            ...schedule.sendingHours,
                            end: e.target.value,
                          },
                        })
                      }
                      className="appearance-none pl-9 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-700"
                    >
                      {HOURS.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <CircleAlert className="w-6 h-6 text-blue-500 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Sending hours is off
                  </h3>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    Your copilot can send emails at any time, 24/7.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  updateFlightSchedule({
                    sendingHoursActive: !schedule.sendingHoursActive,
                  })
                }
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${
                  schedule.sendingHoursActive ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform ${
                    schedule.sendingHoursActive
                      ? "translate-x-5"
                      : "translate-x-1"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Default Timezone */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 pb-2">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Default Timezone
            </h3>
            <p className="text-xs text-slate-500">
              Timezone for sending and scheduling.
            </p>
          </div>

          <div className="col-span-4 flex-1 pt-1 justify-between flex">
            <div className="relative w-full max-w-md">
              <select
                value={schedule.timezone}
                onChange={(e) =>
                  updateFlightSchedule({ timezone: e.target.value })
                }
                className="appearance-none w-full px-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800 text-ellipsis"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.name} value={tz.name}>
                    {tz.name.replace("/", " - ")} (GMT
                    {tz.utcOffset >= 0 ? "+" : ""}
                    {tz.utcOffset / 60}:00)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      {/* Render ScheduleList (which updates selectedId) */}
      <div className="mb-8">{children}</div>
      <StepsActions
        onPress={handleSave}
        isLoading={loading}
        canContinue={true}
      />
    </div>
  );
}
