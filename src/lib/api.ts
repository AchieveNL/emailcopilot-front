import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "@clerk/nextjs";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  async (response) => {
    const token = await getToken();

    if (token) {
      response.headers.Authorization = `Bearer ${token}`;
    }

    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;

// ─── Email Profiles ───────────────────────────────────────────────────────────
// Schema: emailProfiles — provider: "gmail"|"outlook"|"smtp", status: "active"|"inactive"|"error"

export const emailAccountsApi = {
  getAll: () => api.get("/email-accounts"),
  getById: (id: number) => api.get(`/email-accounts/${id}`),
  create: (data: Record<string, unknown>) => api.post("/email-accounts", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/email-accounts/${id}`, data),
  delete: (id: number) => api.delete(`/email-accounts/${id}`),
  verify: (id: number) => api.post(`/email-accounts/${id}/verify`),
};

// ─── Scrape Profiles ──────────────────────────────────────────────────────────
// Schema: targetAudiences — status: "idle"|"running"|"done"|"error"

export const targetAudiencesApi = {
  getAll: () => api.get("/target-audiences"),
  getById: (id: number) => api.get(`/target-audiences/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/target-audiences", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/target-audiences/${id}`, data),
  delete: (id: number) => api.delete(`/target-audiences/${id}`),
  run: (id: number) => api.post(`/target-audiences/${id}/run`),
};

// ─── Templates ────────────────────────────────────────────────────────────────
// Schema: templates — category: "Cold Outreach"|"Follow-up"|"Re-engagement"|"Partnership"|"Other"

export const templatesApi = {
  getAll: () => api.get("/templates"),
  //getById: (id: number) => api.get(`/templates/${id}`),
  getById: (id: number, config?: AxiosRequestConfig) =>
    api.get(`/templates/${id}`, config),
  create: (data: Record<string, unknown>) => api.post("/templates", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/templates/${id}`, data),
  delete: (id: number) => api.delete(`/templates/${id}`),
  duplicate: (id: number) => api.post(`/templates/${id}/duplicate`),
};

// ─── Copilots ─────────────────────────────────────────────────────────────────
// Schema: copilots — status: "draft"|"active"|"paused"|"archived"|"running"
// Was missing entirely — page.tsx calls copilotsApi.create / update / updateStatus

export const copilotsApi = {
  getAll: () => api.get("/copilots"),
  getById: (id: number) => api.get(`/copilots/${id}`),
  create: (data: Record<string, unknown>) => api.post("/copilots", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/copilots/${id}`, data),
  delete: (id: number) => api.delete(`/copilots/${id}`),
  updateStatus: (
    id: number,
    status: "draft" | "active" | "paused" | "archived" | "running", // matches copilotStatusEnum
  ) => api.patch(`/copilots/${id}/status`, { status }),
  run: (id: number) => api.post(`/copilots/${id}/run`),
  duplicate: (id: number) => api.post(`/copilots/${id}/duplicate`),
};

//____ flight-schedules ________________________________________________________
export const flightSchedulesApi = {
  getAll: () => api.get("/flight-schedules"),
  getById: (id: number) => api.get(`/flight-schedules/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/flight-schedules", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/flight-schedules/${id}`, data),
  delete: (id: number) => api.delete(`/flight-schedules/${id}`),
};

// ─── Settings ─────────────────────────────────────────────────────────────────
// Schema: users table (theme: "light"|"dark"|"system", notifyOnReply, notifyOnBounce, notifyWeeklyReport)

export const settingsApi = {
  get: () => api.get("/settings"),
  update: (data: Record<string, unknown>) => api.put("/settings", data),
  updatePassword: (data: Record<string, unknown>) =>
    api.put("/settings/password", data),
  deleteAccount: () => api.delete("/settings/account"),
};

// ─── Integrations ─────────────────────────────────────────────────────────────
// Schema: integrations — provider enum: "google"|"microsoft"|"sendgrid"|"hunter"|
//         "apollo"|"clearbit"|"hubspot"|"salesforce"|"slack"|"webhook"

export type IntegrationProvider =
  | "google"
  | "microsoft"
  | "sendgrid"
  | "hunter"
  | "apollo"
  | "clearbit"
  | "hubspot"
  | "salesforce"
  | "slack"
  | "webhook";

export const integrationsApi = {
  getAll: () => api.get("/integrations"),
  connect: (provider: IntegrationProvider, data: Record<string, unknown>) =>
    api.post(`/integrations/${provider}/connect`, data),
  disconnect: (provider: IntegrationProvider) =>
    api.delete(`/integrations/${provider}`),
  getStatus: (provider: IntegrationProvider) =>
    api.get(`/integrations/${provider}/status`),
};

// ─── Billing ──────────────────────────────────────────────────────────────────
// Schema: subscriptions — status: "active"|"canceled"|"past_due"|"trialing"
//         invoices — status: "paid"|"pending"|"failed", amount in cents

export const billingApi = {
  getSubscription: () => api.get("/billing/subscription"),
  getInvoices: () => api.get("/billing/invoices"),
  getPlans: () => api.get("/billing/plans"),
  getLimits: () => api.get("/billing/limits"),
  subscribe: (planId: string) => api.post("/billing/subscribe", { planId }),
  cancel: () => api.post("/billing/cancel"),
  updatePaymentMethod: (data: Record<string, unknown>) =>
    api.put("/billing/payment-method", data),
};

// ─── Leads ────────────────────────────────────────────────────────────────────
// Schema: leads — status: "sent"|"opened"|"replied"|"bounced"
// GET /leads?status=sent&page=1&limit=20 → { data: Lead[], meta: PaginatedMeta }

export const leadsApi = {
  getAll: (params?: {
    status?: string;
    page?: number;
    limit?: number;
    copilotId?: number;
  }) => api.get("/leads", { params }),

  getById: (id: number) => api.get(`/leads/${id}`),
};

// ─── Email Logs ───────────────────────────────────────────────────────────────
export const emailLogsApi = {
  getAll: (params?: { leadId?: number; page?: number; limit?: number }) =>
    api.get("/emails/logs", { params }),
};

export const usersApi = {
  create: (data: Record<string, unknown>) => api.post("/users", data),
  getById: (id: number) => api.get(`/users/${id}`),
  delete: (id: number) => api.delete(`/users/${id}`),
  getCurrent: () => api.get("/users"),
  updateUser: (id: number, data: Record<string, unknown>) =>
    api.put(`/users/${id}`, data),
};
