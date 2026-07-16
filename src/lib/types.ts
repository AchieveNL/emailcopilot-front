export type PlanId = "starter" | "growth" | "scale";

export type PlanLimits = {
    emailsPerMonth: number;
    copilots: number | null;        // null = unlimited (Scale plan)
    emailProfiles: number;
    hasApiAccess: boolean;
    hasUnlimitedTemplates: boolean;
};

export type PlanUsage = {
    emailsSent: number;
    emailsRemaining: number | null; // null = unlimited
    emailsPercent: number;          // 0–100

    copilotsCount: number;
    copilotsRemaining: number | null; // null = unlimited

    emailProfilesCount: number;
    emailProfilesRemaining: number;
};

// Inactive / no subscription
export type LimitsResponseInactive = {
    hasActivePlan: false;
    planId: null;
    limits: null;
    usage: null;
};

// Active subscription
export type LimitsResponseActive = {
    hasActivePlan: true;
    planId: PlanId;
    periodStart: string; // ISO date string from JSON
    periodEnd: string;
    limits: PlanLimits;
    usage: PlanUsage;
};

export type LimitsResponse = LimitsResponseActive | LimitsResponseInactive;

export type Lead = {
  id: number;
  companyName: string;
  email: string;
  address: string | null;
  phone: string | null;
  emailedAt: string;
  //will be modifie later
  copilotName?: string;
  copilotDescription?: string;
  templateName?: string;
  //this well be changed late
  templateId?: number;
};

export type PaginatedMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginatedMeta;
};