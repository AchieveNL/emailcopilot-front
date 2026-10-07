"use client";

import { useQuery } from "@tanstack/react-query";
import { emailAccountsApi, targetAudiencesApi, templatesApi } from "./api";
import type { EmailAccount } from "./types";
import type { Template } from "./types/templates";
import type { TargetAudience } from "@/store/copilotStore";

// ─── Shared wizard option queries ───────────────────────────────────────────
// One cached fetch per entity for the whole copilot wizard. Steps read from
// cache via these hooks instead of firing their own getAll() calls, and
// steps jumped to directly (e.g. step 6 in edit mode) fetch on demand.

function asArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

export const wizardKeys = {
  all: ["wizard"] as const,
  emailAccounts: () => [...wizardKeys.all, "email-accounts"] as const,
  targetAudiences: () => [...wizardKeys.all, "target-audiences"] as const,
  templates: () => [...wizardKeys.all, "templates"] as const,
};

const STALE_TIME = 0; // always refetch on mount — step 2/3/4 writes stay visible with zero invalidation wiring

export function useWizardEmailAccounts() {
  return useQuery({
    queryKey: wizardKeys.emailAccounts(),
    queryFn: () =>
      emailAccountsApi.getAll().then((r) => asArray<EmailAccount>(r.data)),
    staleTime: STALE_TIME,
  });
}

export function useWizardTargetAudiences() {
  return useQuery({
    queryKey: wizardKeys.targetAudiences(),
    queryFn: () =>
      targetAudiencesApi.getAll().then((r) => asArray<TargetAudience>(r.data)),
    staleTime: STALE_TIME,
  });
}

export function useWizardTemplates() {
  return useQuery({
    queryKey: wizardKeys.templates(),
    queryFn: () =>
      templatesApi.getAll().then((r) => asArray<Template>(r.data)),
    staleTime: STALE_TIME,
  });
}
