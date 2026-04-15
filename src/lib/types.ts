// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeadStatus =
    | "new"
    | "queued"
    | "sent"
    | "replied"
    | "disqualified";

export type ScrapeJobStatus = "running" | "done" | "failed";
export type EmailLogStatus = "sent" | "failed";

// ─── Models ───────────────────────────────────────────────────────────────────

export interface Lead {
    id: number;
    companyName: string;
    email: string;
    website?: string;
    phone?: string;
    address?: string;
    sourceQuery?: string;
    status: LeadStatus;
    notes?: string;
    scrapedAt: string;
    emailedAt?: string;
    repliedAt?: string;
    emailLogs?: EmailLog[];
}

export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EmailLog {
    id: number;
    leadId: number;
    templateId?: number;
    subject: string;
    status: EmailLogStatus;
    errorMessage?: string;
    sentAt: string;
    lead?: Pick<Lead, "id" | "companyName" | "email">;
    template?: Pick<EmailTemplate, "id" | "name">;
}

export interface ScrapeJob {
    id: number;
    query: string;
    status: ScrapeJobStatus;
    leadsFound: number;
    errorMessage?: string;
    ranAt: string;
    finishedAt?: string;
    _count?: { leads: number };
}

export interface Settings {
    daily_send_limit: string;
    scrape_query: string;
    scrape_results_per_run: string;
    send_hour: string;
    scrape_hours: string;
    smtp_host: string;
    smtp_port: string;
    smtp_user: string;
    smtp_from_name: string;
}

export interface LeadStats {
    new: number;
    queued: number;
    sent: number;
    replied: number;
    disqualified: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}