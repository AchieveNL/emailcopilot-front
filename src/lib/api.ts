import axios from "axios";
import type {
    Lead,
    LeadStatus,
    LeadStats,
    EmailLog,
    EmailTemplate,
    ScrapeJob,
    Settings,
    PaginatedResponse,
} from "./types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
        "x-api-key": process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || "",
        "Content-Type": "application/json",
    },
});

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leadsApi = {
    list: (params?: { status?: LeadStatus; page?: number; limit?: number }) =>
        api.get<PaginatedResponse<Lead>>("/leads", { params }).then((r) => r.data),

    get: (id: number) =>
        api.get<Lead>(`/leads/${id}`).then((r) => r.data),

    update: (id: number, data: { status?: LeadStatus; notes?: string }) =>
        api.patch<Lead>(`/leads/${id}`, data).then((r) => r.data),

    delete: (id: number) =>
        api.delete(`/leads/${id}`).then((r) => r.data),

    stats: () =>
        api.get<LeadStats>("/leads/stats/summary").then((r) => r.data),
};

// ─── Emails ───────────────────────────────────────────────────────────────────

export const emailsApi = {
    logs: (params?: { page?: number; limit?: number }) =>
        api.get<PaginatedResponse<EmailLog>>("/emails/logs", { params }).then((r) => r.data),

    templates: () =>
        api.get<EmailTemplate[]>("/emails/templates").then((r) => r.data),

    createTemplate: (data: { name: string; subject: string; body: string }) =>
        api.post<EmailTemplate>("/emails/templates", data).then((r) => r.data),

    updateTemplate: (
        id: number,
        data: Partial<{ name: string; subject: string; body: string; isActive: boolean }>
    ) =>
        api.patch<EmailTemplate>(`/emails/templates/${id}`, data).then((r) => r.data),

    deleteTemplate: (id: number) =>
        api.delete(`/emails/templates/${id}`).then((r) => r.data),
};

// ─── Scraper ──────────────────────────────────────────────────────────────────

export const scraperApi = {
    jobs: (params?: { page?: number; limit?: number }) =>
        api.get<PaginatedResponse<ScrapeJob>>("/scraper/jobs", { params }).then((r) => r.data),

    trigger: (query?: string) =>
        api.post("/scraper/trigger", { query }).then((r) => r.data),

    job: (id: number) =>
        api.get<ScrapeJob>(`/scraper/jobs/${id}`).then((r) => r.data),
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsApi = {
    get: () =>
        api.get<Settings>("/settings").then((r) => r.data),

    update: (data: Partial<Settings> & Record<string, string>) =>
        api.patch("/settings", data).then((r) => r.data),

    testSmtp: () =>
        api.post<{ success: boolean; message?: string; error?: string }>(
            "/settings/test-smtp"
        ).then((r) => r.data),
};

// ─── Scheduler ────────────────────────────────────────────────────────────────

export const schedulerApi = {
    status: () =>
        api.get<{
            sendJob: { active: boolean };
            scrapeJobAM: { active: boolean };
            scrapeJobPM: { active: boolean };
        }>("/scheduler/status").then((r) => r.data),

    sendNow: () =>
        api.post("/send-now").then((r) => r.data),
};