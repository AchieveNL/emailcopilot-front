// ─── Shared types for the Templates feature ───────────────────────────────────
// Import these in page.tsx, TemplateModal, TemplateTable, TemplateRow, api.ts
// Never duplicate these locally — update here and all consumers pick it up.

export type TemplateStatus = "in_flight" | "draft";

export type TemplateStep = {
  id: number;
  /** "initial" for the first email, "followup" for subsequent ones */
  type: string;
  title: string;
  description: string;
  delayDays: number;
};

/** Matches the backend `templates` table row */
export type Template = {
  id: number;
  name: string;
  subject?: string;
  body?: string;
  category?: string;
  variables?: string[];
  usageCount?: number;
  createdAt?: string;
  steps?: TemplateStep[];
  lastUpdated?: string;
  usedIn?: number;
  replyRate?: number;
  trend?: "up" | "down";
  status?: TemplateStatus;
};

/** Payload sent to POST /templates */
export type CreateTemplatePayload = {
  name: string;
  category: string;
  subject?: string;
  body?: string;
  variables?: string[];
  steps?: TemplateStep[];
};

/** Payload sent to PUT /templates/:id — all fields optional except those required by the backend */
export type UpdateTemplatePayload = Partial<CreateTemplatePayload> & {
  usageCount?: number;
  createdAt?: string;
};

/** The controlled form state used inside TemplateModal */
export type TemplateForm = {
  name: string;
  subject: string;
  body: string;
  category: string;
};
