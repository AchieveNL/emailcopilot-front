"use client";

import React, { useState } from "react";
import { X, Clock, Minus, Plus, ChevronDown, CircleAlert } from "lucide-react";
import ct from "countries-and-timezones";
import type { Schedule } from "./FlightScheduleCard";

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Payload type (what we send to the API — no id) ──────────────────────────

export type SchedulePayload = Omit<Schedule, "id">;

// ─── Props ────────────────────────────────────────────────────────────────────

interface FlightScheduleFormModalProps {
  schedule: Schedule | null;
  onClose: () => void;
  onSave: (data: SchedulePayload) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FlightScheduleFormModal({
  schedule,
  onClose,
  onSave,
}: FlightScheduleFormModalProps) {
  const isEditing = !!schedule;

  // ── Form state (pre-populated when editing) ────────────────────────────────

  const [name, setName] = useState(schedule?.name ?? "Default");
  const [sendLimit, setSendLimit] = useState(schedule?.sendLimit ?? 30);
  const [sendLimitActive, setSendLimitActive] = useState(
    schedule?.sendLimitActive ?? false,
  );
  const [activeDays, setActiveDays] = useState<number[]>(
    schedule?.activeDays ?? [1, 2, 3, 4, 5],
  );
  const [sendingHoursStart, setSendingHoursStart] = useState(
    schedule?.sendingHours?.start ?? "09:00",
  );
  const [sendingHoursEnd, setSendingHoursEnd] = useState(
    schedule?.sendingHours?.end ?? "17:00",
  );
  const [sendingHoursActive, setSendingHoursActive] = useState(
    schedule?.sendingHoursActive ?? false,
  );
  const [timezone, setTimezone] = useState(
    schedule?.timezone ??
      TIMEZONES.find((tz) => tz.name === DEFAULT_TIMEZONE)?.name ??
      DEFAULT_TIMEZONE,
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Day toggle ─────────────────────────────────────────────────────────────

  const toggleDay = (day: number) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeDays.length === 0) {
      setError("Please select at least one active day.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name,
        sendLimit: sendLimitActive ? sendLimit : null,
        sendLimitActive,
        activeDays: [...activeDays].sort(),
        sendingHours: { start: sendingHoursStart, end: sendingHoursEnd },
        sendingHoursActive,
        timezone,
      });
    } catch {
      setError("Failed to save flight schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-white rounded-2xl shadow-2xl z-120 flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Flight Schedule" : "New Flight Schedule"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure when and how emails are sent.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-8 pb-8"
        >
          <div className="flex flex-col gap-6">
            {/* ── Schedule name ─────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Schedule Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mornings, Afternoons, Weekend…"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-slate-800"
              />
            </div>

            {/* ── Daily send limit ──────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-900">
                  Daily Send Limit
                </label>
                <button
                  type="button"
                  onClick={() => setSendLimitActive(!sendLimitActive)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${
                    sendLimitActive ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform ${
                      sendLimitActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Maximum number of new emails to send per day.
              </p>

              {sendLimitActive ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setSendLimit(Math.max(1, sendLimit - 1))}
                      className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={sendLimit}
                      onChange={(e) =>
                        setSendLimit(Math.max(1, Number(e.target.value)))
                      }
                      className="w-16 text-center text-sm font-medium border-x border-slate-200 py-2 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSendLimit(sendLimit + 1)}
                      className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Recommended: 20–50 per day
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <CircleAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">
                      Unlimited sending
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Your copilot will send as many emails as possible within
                      the active hours each day.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Active days ───────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Active Days
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Choose which days emails can be sent.
              </p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(({ value, label }) => {
                  const isActive = activeDays.includes(value);
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

            {/* ── Sending hours ─────────────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-900">
                  Sending Hours
                </label>
                <button
                  type="button"
                  onClick={() => setSendingHoursActive(!sendingHoursActive)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${
                    sendingHoursActive ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute shadow-sm transition-transform ${
                      sendingHoursActive ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Set the daily time window for sending emails.
              </p>

              {sendingHoursActive ? (
                <div className="flex flex-wrap items-center gap-4">
                  {/* From */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      From
                    </span>
                    <div className="relative">
                      <select
                        value={sendingHoursStart}
                        onChange={(e) => setSendingHoursStart(e.target.value)}
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

                  {/* To */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      To
                    </span>
                    <div className="relative">
                      <select
                        value={sendingHoursEnd}
                        onChange={(e) => setSendingHoursEnd(e.target.value)}
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
                <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <CircleAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">
                      Sending hours is off
                    </h4>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Your copilot can send emails at any time, 24/7.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Timezone ──────────────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Timezone
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Timezone for sending and scheduling.
              </p>
              <div className="relative w-full max-w-md">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
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

            {/* ── Error ─────────────────────────────────────────────────── */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {error}
              </p>
            )}
          </div>

          {/* ── Actions ───────────────────────────────────────────────── */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
