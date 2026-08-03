"use client";

import React from "react";
import { Mail, Calendar, Clock, ShieldCheck, Globe } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

const DEFAULT_TIMEZONE = "Europe/Brussels";

export default function ScheduleSideBar() {
  const { copilotData } = useCopilotStore();
  const sendLimit = copilotData?.sendLimit || 30;
  const timezone = copilotData?.settings?.timezone || DEFAULT_TIMEZONE;
  const activeDays = copilotData?.settings?.schedule?.activeDays || [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ];
  const fromTime = copilotData?.settings?.schedule?.fromTime || "08:00";
  const toTime = copilotData?.settings?.schedule?.toTime || "17:00";

  const sendLimitActive = copilotData?.settings?.sendLimitActive ?? false;
  const sendingHoursActive =
    copilotData?.settings?.schedule?.sendingHoursActive ?? false;

  // Since timezone string can be long, let's extract just the relevant part
  const formattedTimezone = timezone.replace("Timezone: ", "");

  const isWeekday =
    activeDays.length === 5 &&
    activeDays.every((d) => ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(d));
  const isWeekend =
    activeDays.length === 2 &&
    activeDays.every((d) => ["Sat", "Sun"].includes(d));
  const formattedDays = isWeekday
    ? "Monday - Friday"
    : isWeekend
      ? "Weekend only"
      : activeDays.length === 7
        ? "Every day"
        : activeDays.join(", ");

  const activeDaysPerMonth = activeDays.length * 4;
  const monthlyVolume = sendLimitActive
    ? `~${sendLimit * activeDaysPerMonth}`
    : "Unlimited";

  return (
    <div className="col-span-1 border border-slate-200 bg-white rounded-xl overflow-hidden h-fit sticky top-6">
      <div className="p-6">
        <h3 className="font-bold text-slate-900 mb-1 leading-tight">
          Schedule Summary
        </h3>
        <p className="text-xs text-slate-500 mb-8">
          Here's how your copilot will send.
        </p>

        <div className="flex flex-col gap-6 mb-8">
          {/* Daily limit */}
          <div className="flex items-start gap-4">
            <div className="p-2 border border-slate-200 rounded-lg shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Daily send limit
              </h4>
              <p className="text-xs text-slate-500">
                {sendLimitActive
                  ? `${sendLimit} emails per day`
                  : "Unlimited emails"}
              </p>
            </div>
          </div>

          {/* Active days */}
          <div className="flex items-start gap-4">
            <div className="p-2 border border-slate-200 rounded-lg shrink-0 mt-0.5">
              <Calendar className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Active days
              </h4>
              <p className="text-xs text-slate-500">{formattedDays}</p>
            </div>
          </div>

          {/* Sending hours */}
          <div className="flex items-start gap-4">
            <div className="p-2 border border-slate-200 rounded-lg shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Sending hours
              </h4>
              <p className="text-xs text-slate-500">
                {sendingHoursActive
                  ? `${fromTime} - ${toTime}`
                  : "24/7 (Any time)"}
              </p>
            </div>
          </div>

          {/* Timezone */}
          <div className="flex items-start gap-4">
            <div className="p-2 border border-slate-200 rounded-lg shrink-0 mt-0.5">
              <Globe className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Timezone
              </h4>
              <p
                className="text-xs text-slate-500 line-clamp-1 pr-2"
                title={formattedTimezone}
              >
                {formattedTimezone}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-100 mb-6"></div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-900 mb-2">
            Est. monthly volume
          </h4>
          <p className="text-xs text-slate-500">
            {monthlyVolume} emails <br />
            Based on {activeDaysPerMonth} active days/month
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
          <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            These settings help maximize deliverability and keep your account
            safe.
          </p>
        </div>
      </div>
    </div>
  );
}
