import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;

// ─── Email Profiles ───────────────────────────────────────────────────────────
// Schema: emailProfiles — provider: "gmail"|"outlook"|"smtp", status: "active"|"inactive"|"error"

export const emailProfilesApi = {
  getAll: () => api.get("/email-profiles"),
  getById: (id: number) => api.get(`/email-profiles/${id}`),
  create: (data: Record<string, unknown>) => api.post("/email-profiles", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/email-profiles/${id}`, data),
  delete: (id: number) => api.delete(`/email-profiles/${id}`),
  verify: (id: number) => api.post(`/email-profiles/${id}/verify`),
};

// ─── Scrape Profiles ──────────────────────────────────────────────────────────
// Schema: scrapeProfiles — status: "idle"|"running"|"done"|"error"

export const scrapeProfilesApi = {
  getAll: () => api.get("/scrape-profiles"),
  getById: (id: number) => api.get(`/scrape-profiles/${id}`),
  create: (data: Record<string, unknown>) => api.post("/scrape-profiles", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/scrape-profiles/${id}`, data),
  delete: (id: number) => api.delete(`/scrape-profiles/${id}`),
  run: (id: number) => api.post(`/scrape-profiles/${id}/run`),
};

// ─── Templates ────────────────────────────────────────────────────────────────
// Schema: templates — category: "Cold Outreach"|"Follow-up"|"Re-engagement"|"Partnership"|"Other"

export const templatesApi = {
  getAll: () => api.get("/templates"),
  getById: (id: number) => api.get(`/templates/${id}`),
  create: (data: Record<string, unknown>) => api.post("/templates", data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/templates/${id}`, data),
  delete: (id: number) => api.delete(`/templates/${id}`),
  duplicate: (id: number) => api.post(`/templates/${id}/duplicate`),
};

// ─── Copilots ─────────────────────────────────────────────────────────────────
// Schema: copilots — status: "draft"|"active"|"paused"|"archived"
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
    status: "draft" | "active" | "paused" | "archived" // matches copilotStatusEnum
  ) => api.patch(`/copilots/${id}/status`, { status }),
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

export const usersApi = {
  create: (data: Record<string, unknown>) => api.post("/users", data),
  getById: (id: number) => api.get(`/users/${id}`),
  delete: (id: number) => api.delete(`/users/${id}`),
  getCurrent: () => api.get("/users"),
  updateUser: (
    id: number,
    data: Record<string, unknown>
  ) => api.put(`/users/${id}`, data),
};