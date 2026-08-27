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
  sendLimit: number;
  settings: {
    schedule: {
      runAt: string; // ISO string, e.g. "2024-06-01T09:00:00Z"
      activeDays?: string[];
      fromTime?: string;
      toTime?: string;
      sendingHoursActive?: boolean;
    };
    sendLimitActive?: boolean;
    sendingSpeed: string;
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
  id: number; // serial PK — number, not string
  name: string;
  email: string;
  provider: "gmail" | "outlook" | "smtp"; // matches emailProviderEnum
  status: "active" | "inactive" | "error"; // matches emailProfileStatusEnum
  dailyLimit: number;
  sentToday: number;
}

// Matches schema: targetAudiences table
export interface ScrapeProfile {
  id: number; // serial PK — number, not string
  name: string;
  url: string; // was wrongly "category" + "location"
  selector: string; // was missing
  country: string; // was missing
  city: string; // was missing
  fields: string[]; // was missing (jsonb string[])
  status: "idle" | "running" | "done" | "error"; // matches scrapeStatusEnum
  resultsCount: number; // was wrongly "count"
  lastRun: string | null;
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
  updateSettings: (settings: Partial<CopilotData["settings"]>) => void;
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
  sendLimit: 10,
  flightScheduleId: null,
  flightSchedule: {
    name: "Default",
    sendLimit: 10,
    sendLimitActive: false,
    activeDays: [1, 2, 3, 4, 5],
    sendingHours: { start: "08:00", end: "17:00" },
    sendingHoursActive: false,
    timezone: "Europe/Brussels",
  },
  settings: {
    schedule: {
      runAt: "",
      activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      fromTime: "08:00",
      toTime: "17:00",
      sendingHoursActive: false,
    },
    sendLimitActive: false,
    sendingSpeed: "Normal (Recommended)",
    timezone: "Europe/Brussels",
  },
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

  updateSettings: (settings) =>
    set((state) => ({
      copilotData: {
        ...state.copilotData,
        settings: { ...state.copilotData.settings, ...settings },
      },
    })),

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

export const mockScrapeProfiles: ScrapeProfile[] = [
  {
    id: 1,
    name: "Dental CA - Google Maps",
    url: "https://maps.google.com/?q=dentist+california",
    selector: ".place-result",
    fields: ["name", "phone", "address", "website"],
    city: "California",
    country: "USA",
    status: "done",
    resultsCount: 2840,
    lastRun: "2024-05-01T10:00:00Z",
  },
  {
    id: 2,
    name: "Clinics - New York",
    url: "https://maps.google.com/?q=medical+clinic+new+york",
    selector: ".place-result",
    fields: ["name", "phone", "address"],
    city: "New York",
    country: "USA",
    status: "done",
    resultsCount: 1520,

    lastRun: "2024-04-28T08:30:00Z",
  },
  {
    id: 3,
    name: "Lawyers - Texas",
    url: "https://maps.google.com/?q=law+firm+texas",
    selector: ".place-result",
    fields: ["name", "phone", "email", "website"],
    city: "Austin",
    country: "USA",
    status: "idle",

    resultsCount: 3100,
    lastRun: null,
  },
];
