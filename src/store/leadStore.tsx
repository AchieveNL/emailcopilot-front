"use client";

import { create } from "zustand";
import { Lead } from "@/lib/types";
import { leadsApi } from "@/lib/api";

interface LeadStore {
  leads: Lead[];
  limit: number;
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
  limit: 10,
  page: 1,
  isLoading: false,
  setLeads: (leads) => set({ leads }),
  getAllLeads: async (params?: {
    status?: string;
    page?: number;
    // limit?: number;
    copilotId?: number;
  }) => {
    set({ isLoading: true });
    try {
      const response = await leadsApi.getAll(params);
      set({
        leads: response.data.data,
        // limit: response.data.meta.limit,
        page: response.data.meta.page ?? 1,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      set({ isLoading: false });
    }
  },
}));
