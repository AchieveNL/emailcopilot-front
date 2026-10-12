"use client";

import { useQuery } from "@tanstack/react-query";
import { copilotsApi } from "./api";
import { useCopilotStore } from "@/store/copilotStore";
import type { TemplateStep } from "./types/templates";

export interface TakeoffEmailAccount {
  id: number;
  profileName?: string | null;
  email?: string | null;
}

export interface TakeoffTargetAudience {
  id: number;
  name?: string | null;
  country?: string | null;
  city?: string | null;
  resultsCount?: number | null;
}

export interface TakeoffTemplate {
  id: number;
  name?: string | null;
  steps?: TemplateStep[] | null;
}

export interface TakeoffFlightSchedule {
  name?: string | null;
  sendLimit?: number | null;
  sendLimitActive?: boolean | null;
  activeDays?: number[] | null;
  sendingHours?: { start: string; end: string } | null;
  sendingHoursActive?: boolean | null;
  timezone?: string | null;
}

export interface TakeoffCopilot {
  id: number;
  name?: string | null;
  description?: string | null;
  goal?: string | null;
  emailAccountId?: number | null;
  targetAudienceId?: number | null;
  templateId?: number | null;
  flightScheduleId?: number | null;
  emailAccount?: TakeoffEmailAccount | null;
  targetAudience?: TakeoffTargetAudience | null;
  template?: TakeoffTemplate | null;
  flightSchedule?: TakeoffFlightSchedule | null;
  targetProfile?: {
    industries?: string[];
    countries?: string[];
    cities?: string[];
  } | null;
}

export function useTakeoffCopilot() {
  const draftId = useCopilotStore((s) => s.draftId);
  return useQuery({
    queryKey: ["takeoff-copilot", draftId],
    queryFn: () =>
      copilotsApi
        .getById(draftId as number)
        .then((r) => r.data as TakeoffCopilot),
    enabled: draftId != null,
    staleTime: 0,
  });
}
