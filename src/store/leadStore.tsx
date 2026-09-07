"use client";

import { create } from "zustand";
import { Lead } from "@/lib/types";
import { leadsApi } from "@/lib/api";

interface LeadStore {
  leads: Lead[];
  limits: number;
  page: number;
  isLoading: boolean;
  setLeads: (leads: Lead[]) => void;
  getAllLeads: (params?: {
    status?: string;
    page?: number;
    limit?: number;
    copilotId?: number;
  }) => void;
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  limits: 10,
  page: 1,
  isLoading: false,
  setLeads: (leads) => set({ leads }),
  getAllLeads: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    copilotId?: number;
  }) => {
    set({ isLoading: true });
    try {
      const response = await leadsApi.getAll(params);
      set({
        leads: response.data.data,
        limits: response.data.meta.limits,
        page: response.data.meta.page ?? 1,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      set({ isLoading: false });
    }
  },
}));
