"use client";

import { create } from "zustand";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

// Matches schema: copilots table + settings jsonb
export interface CopilotData {
  name: string;
  description: string;
  goal: string;
  emailProfileId: number | null;
  scrapeProfileId: number | null;
  templateId: number | null;
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

// Matches schema: scrapeProfiles table
export interface ScrapeProfile {
  id: number; // serial PK — number, not string
  name: string;
  url: string; // was wrongly "category" + "location"
  selector: string; // was missing
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

  setStep: (step: Step) => void;
  updateCopilotData: (data: Partial<CopilotData>) => void;
  updateSettings: (settings: Partial<CopilotData["settings"]>) => void;
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
  emailProfileId: null,
  scrapeProfileId: null,
  templateId: null,
  sendLimit: 10,
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
    timezone: "(GMT-08:00) Pacific Time (US & Canada)",
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

  setStep: (step) => set({ currentStep: step }),

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
    }),

  resetStore: () =>
    set({
      currentStep: 1,
      copilotData: defaultCopilotData,
      launched: false,
      mode: "create",
      editingId: null,
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
    status: "idle",
    resultsCount: 3100,
    lastRun: null,
  },
];
