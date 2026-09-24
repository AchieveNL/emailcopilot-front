"use client";

import { useState, useEffect, useRef } from "react";
import StepsActions from "../StepsActions";
import { useCopilotStore } from "@/store/copilotStore";
import { Clock, Minus, Plus, ChevronDown, CircleAlert } from "lucide-react";
import ct from "countries-and-timezones";
import { flightSchedulesApi } from "@/lib/api";
import { toast } from "sonner";
import ScheduleList from "./ScheduleList";

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

/** The schedule fields that determine whether the form was modified. */
type ScheduleFields = {
  name: string;
  sendLimit: number | null;
  sendLimitActive: boolean;
  activeDays: number[];
  sendingHours: { start: string; end: string };
  sendingHoursActive: boolean;
  timezone: string;
};

function pickFields(s: Partial<ScheduleFields>): ScheduleFields {
  return {
    name: s.name ?? "",
    sendLimit: s.sendLimit ?? null,
    sendLimitActive: s.sendLimitActive ?? false,
    activeDays: [...(s.activeDays ?? [])].sort((a, b) => a - b),
    sendingHours: {
      start: s.sendingHours?.start ?? "08:00",
      end: s.sendingHours?.end ?? "17:00",
    },
    sendingHoursActive: s.sendingHoursActive ?? false,
    timezone: s.timezone ?? DEFAULT_TIMEZONE,
  };
}

export default function ScheduleStep() {
  const { copilotData, updateCopilotData, updateFlightSchedule, setStep } =
    useCopilotStore();

  const schedule = copilotData.flightSchedule;
  const selectedId = copilotData.flightScheduleId;

  const [loading, setLoading] = useState(false);
  // Open by default when nothing is linked yet (edit mode hydrates later).
  const [listOpen, setListOpen] = useState(!copilotData.flightScheduleId);

  useEffect(() => {
    if (copilotData.flightScheduleId) setListOpen(false);
  }, [copilotData.flightScheduleId]);

  // Local text for the daily limit so the field can be cleared/typed freely.
  const [limitText, setLimitText] = useState(
    String(schedule.sendLimit ?? 30),
  );

  useEffect(() => {
    setLimitText(String(schedule.sendLimit ?? 30));
  }, [schedule.sendLimit]);

  // Baseline = the linked saved schedule (null = custom, nothing linked).
  // dirty = user changed the form after (or without) selecting a schedule.
  const [baseline, setBaseline] = useState<{ id: number; data: ScheduleFields } | null>(
    selectedId ? { id: selectedId, data: pickFields(schedule) } : null,
  );
  const prevSelectedIdRef = useRef(selectedId);

  useEffect(() => {
    if (prevSelectedIdRef.current === selectedId) return;
    prevSelectedIdRef.current = selectedId;
    if (selectedId) {
      setBaseline({ id: selectedId, data: pickFields(schedule) });
    } else {
      // Deselect: values stay in the form but nothing is linked anymore.
      setBaseline(null);
    }
  }, [selectedId, schedule]);

  const dirty =
    baseline !== null &&
    JSON.stringify(pickFields(schedule)) !== JSON.stringify(baseline.data);

  // Only warn about unsaved changes when the form actually differs from the
  // linked schedule (or is a filled-in custom schedule).
  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dirty]);

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
    if (schedule.activeDays.length === 0) {
      toast.error("Please select at least one active day.");
      return;
    }

    // Selected schedule, untouched → pure reuse, nothing is written.
    if (selectedId && !dirty) {
      setStep(6);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: schedule.name || "Custom Copilot Schedule",
        sendLimit: schedule.sendLimitActive ? schedule.sendLimit : null,
        sendLimitActive: schedule.sendLimitActive,
        activeDays: [...schedule.activeDays].sort((a, b) => a - b),
        sendingHours: schedule.sendingHours,
        sendingHoursActive: schedule.sendingHoursActive,
        timezone: schedule.timezone,
      };
      const res = await flightSchedulesApi.create(payload);

      // Link the copilot to the new schedule and keep the store preview in sync.
      updateCopilotData({
        flightScheduleId: res.data.id,
        flightSchedule: payload,
      });

      if (selectedId) {
        toast.success(
          "Changes saved as a new schedule — the original schedule was not changed.",
        );
      } else {
        toast.success("Flight schedule created and linked.");
      }
      setStep(6);
    } catch (error) {
      toast.error("Failed to create flight schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-transparent min-h-150 text-slate-800">
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Configure Flight Schedule
        </h1>
        <p className="text-sm text-slate-500">
          Choose when and how your copilot sends emails.
        </p>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-4xl">
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
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={limitText}
                      onChange={(e) => {
                        const raw = e.target.value;
                        setLimitText(raw);
                        const n = parseInt(raw, 10);
                        if (!Number.isNaN(n) && n >= 1) {
                          updateFlightSchedule({ sendLimit: n });
                        }
                      }}
                      onBlur={() => {
                        const n = parseInt(limitText, 10);
                        const final = Number.isNaN(n) || n < 1
                          ? schedule.sendLimit ?? 30
                          : n;
                        setLimitText(String(final));
                        if (final !== schedule.sendLimit) {
                          updateFlightSchedule({ sendLimit: final });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                      className="w-20 px-2 py-2 text-center text-sm font-medium border-x border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
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

      {/* Mode chip: makes explicit what "Save & Continue" will do */}
      {baseline === null ? (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 mt-8">
          <CircleAlert className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-gray-700 leading-relaxed">
            Custom schedule — a new schedule will be created and linked when
            you continue.
          </p>
        </div>
      ) : dirty ? (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/60 mt-8">
          <CircleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            Modified from “{baseline.data.name}” — your changes will be saved
            as a <strong>new schedule</strong>. The original schedule stays
            unchanged.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50 mt-8">
          <CircleAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Using saved schedule: {baseline.data.name} — nothing will be
            changed when you continue.
          </p>
        </div>
      )}

      {/* Saved schedules — collapsed dropdown so the form stays on top */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setListOpen((o) => !o)}
          aria-expanded={listOpen}
          className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border border-[#E2E8F0] rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <Clock size={16} className="text-[#59637C] shrink-0" />
            <span className="text-sm font-bold text-gray-900">
              Your Flight Schedules
            </span>
            {baseline !== null && (
              <span className="truncate max-w-48 text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded-full">
                Using: {baseline.data.name}
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 shrink-0 transition-transform ${
              listOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {listOpen && (
          <div className="mt-4">
            <ScheduleList onSelect={() => setListOpen(false)} />
          </div>
        )}
      </div>

      <StepsActions
        onPress={handleSave}
        isLoading={loading}
        canContinue={schedule.activeDays.length > 0}
      />
    </div>
  );
}
