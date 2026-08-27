export type PlanId = "starter" | "growth" | "scale";

export type PlanLimits = {
  emailsPerMonth: number;
  copilots: number | null; // null = unlimited (Scale plan)
  emailProfiles: number;
  hasApiAccess: boolean;
  hasUnlimitedTemplates: boolean;
};

export type PlanUsage = {
  emailsSent: number;
  emailsRemaining: number | null; // null = unlimited
  emailsPercent: number; // 0–100

  copilotsCount: number;
  copilotsRemaining: number | null; // null = unlimited

  emailAccountsCount: number;
  emailAccountsRemaining: number;
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
  copilotName: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  companyName: string;
  email: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  sourceQuery: string | null;
  sentAt: string | null;
  templateId: number | null;
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
