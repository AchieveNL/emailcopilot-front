"use client";

import { create } from "zustand";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

// Matches schema: copilots table + settings jsonb
export interface CopilotData {
  name: string;
  description: string;
  goal: string;
  emailAccountId: number | null;
  targetAudienceId: number | null;
  templateId: number | null;
  flightScheduleId: number | null;
  flightSchedule: {
    name: string;
    sendLimit: number | null;
    sendLimitActive: boolean;
    activeDays: number[];
    sendingHours: { start: string; end: string };
    sendingHoursActive: boolean;
    timezone: string;
  };


  targetProfile: {
    industries: string[];
    countries: string[];
    cities: string[];
  };
}

// Matches schema: emailProfiles table
export interface EmailProfile {
  id: number; 
  name: string;
  email: string;
  provider: "gmail" | "outlook" | "smtp"; 
  status: "active" | "inactive" | "error"; 
  dailyLimit: number;
  sentToday: number;
}

// Matches schema: targetAudiences table
export interface TargetAudience {
  id: number; 
  name: string;

  country: string; 
  city: string; 
  searchQuery: string[]; 
  status: "idle" | "running" | "done" | "error"; 
  resultsCount: number; 
  lastRun: string | null;
  updatedAt: string;
  createdAt: string;
  userId: number;
}

export type CopilotMode = "create" | "edit" | "duplicate";

interface CopilotStore {
  currentStep: Step;
  copilotData: CopilotData;
  launched: boolean;
  mode: CopilotMode;
  editingId: number | null;
  highestStep: Step;

  setStep: (step: Step) => void;
  updateCopilotData: (data: Partial<CopilotData>) => void;
  // updateSettings: (settings: Partial<CopilotData["settings"]>) => void;
  updateFlightSchedule: (
    schedule: Partial<CopilotData["flightSchedule"]>,
  ) => void;
  updateTargetProfile: (profile: Partial<CopilotData["targetProfile"]>) => void;
  setLaunched: (launched: boolean) => void;
  setMode: (mode: CopilotMode) => void;
  setEditingId: (id: number | null) => void;
  loadCopilot: (data: CopilotData, id?: number, mode?: CopilotMode) => void;
  resetStore: () => void;
}

const defaultCopilotData: CopilotData = {
  name: "",
  description: "",
  goal: "",
  emailAccountId: null,
  targetAudienceId: null,
  templateId: null,

  flightScheduleId: null,
  flightSchedule: {
    name: "",
    sendLimit: 10,
    sendLimitActive: false,
    activeDays: [1, 2, 3, 4, 5],
    sendingHours: { start: "08:00", end: "17:00" },
    sendingHoursActive: false,
    timezone: "Europe/Brussels",
  },
  // settings: {
  //   schedule: {
  //     runAt: "",
  //     activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  //     fromTime: "08:00",
  //     toTime: "17:00",
  //     sendingHoursActive: false,
  //   },
  //   sendLimitActive: false,
  //   sendingSpeed: "Normal (Recommended)",
  //   timezone: "Europe/Brussels",
  // },
  targetProfile: {
    industries: [],
    countries: [],
    cities: [],
  },
};

export const useCopilotStore = create<CopilotStore>((set) => ({
  currentStep: 1,
  copilotData: defaultCopilotData,
  launched: false,
  mode: "create",
  editingId: null,
  highestStep: 1,

  setStep: (step) =>
    set((state) => ({
      currentStep: step,
      highestStep: Math.max(state.highestStep, step) as Step,
    })),

  updateCopilotData: (data) =>
    set((state) => ({
      copilotData: { ...state.copilotData, ...data },
    })),

  // updateSettings: (settings) =>
  //   set((state) => ({
  //     copilotData: {
  //       ...state.copilotData,
  //       settings: { ...state.copilotData.settings, ...settings },
  //     },
  //   })),

  updateFlightSchedule: (schedule) =>
    set((state) => ({
      copilotData: {
        ...state.copilotData,
        flightSchedule: { ...state.copilotData.flightSchedule, ...schedule },
      },
    })),

  updateTargetProfile: (targetProfile) =>
    set((state) => ({
      copilotData: {
        ...state.copilotData,
        targetProfile: { ...state.copilotData.targetProfile, ...targetProfile },
      },
    })),

  setLaunched: (launched) => set({ launched }),

  setMode: (mode) => set({ mode }),

  setEditingId: (id) => set({ editingId: id }),

  loadCopilot: (data, id, mode = "edit") =>
    set({
      copilotData: data,
      editingId: id ?? null,
      mode,
      highestStep: 6,
    }),

  resetStore: () =>
    set({
      currentStep: 1,
      copilotData: defaultCopilotData,
      launched: false,
      mode: "create",
      editingId: null,
      highestStep: 1,
    }),
}));

// ─── Mock data (aligned with schema types) ───────────────────────────────────

export const mockEmailProfiles: EmailProfile[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    provider: "gmail",
    status: "active",
    dailyLimit: 100,
    sentToday: 12,
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@company.com",
    provider: "outlook",
    status: "active",
    dailyLimit: 150,
    sentToday: 0,
  },
  {
    id: 3,
    name: "Marketing Team",
    email: "marketing@company.com",
    provider: "gmail",
    status: "inactive",
    dailyLimit: 200,
    sentToday: 0,
  },
];
