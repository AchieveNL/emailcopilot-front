"use client";

import FlightScheduleCard from "@/components/ui/flightSchedule/FlightScheduleCard";
import { useState, useEffect, useCallback } from "react";
import { flightSchedulesApi } from "@/lib/api";
import { toast } from "sonner";
import type { Schedule } from "@/components/ui/flightSchedule/FlightScheduleCard";
import { useCopilotStore } from "../../../../../store/copilotStore";

function ScheduleList() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const { copilotData, updateCopilotData } = useCopilotStore();
  const selectedId = copilotData.flightScheduleId;

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await flightSchedulesApi.getAll();
      setSchedules(res.data);
    } catch {
      toast.error("Failed to load flight schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSelect = (schedule: Schedule) => {
    if (!schedule.id) return;
    if (selectedId === schedule.id) {
      // Deselect if already selected
      updateCopilotData({ flightScheduleId: null });
    } else {
      updateCopilotData({
        flightScheduleId: schedule.id,
        flightSchedule: schedule,
      });
      console.log("Selected schedule:", copilotData.flightScheduleId);
    }
  };

  return (
    <div>
      {/* Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-semibold text-gray-800">
            Your Flight Schedules
          </span>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No flight schedules available. Create a new one below.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {schedules.map((schedule) => {
              const isSelected = selectedId === schedule.id;

              return (
                <div
                  key={schedule.id}
                  onClick={() => handleSelect(schedule)}
                  className={`relative cursor-pointer border hover:bg-primary/5  hover:border-primary/50  transition-all rounded-xl ${
                    isSelected
                      ? " border-primary bg-primary/5"
                      : " border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={
                      isSelected
                        ? "opacity-100"
                        : "opacity-80 hover:opacity-100"
                    }
                  >
                    <FlightScheduleCard schedules={schedule} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleList;
