"use client";

import { useState, useEffect, useCallback } from "react";
import { billingApi } from "./api";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = "starter" | "growth" | "scale";

export interface Plan {
    id: PlanId;
    name: string;
    price: number;
    amount: string;
    interval: string;
    currency: string;
    features: string[];
    highlight?: boolean;
}

export interface Subscription {
    id: number;
    userId: number;
    planId: PlanId;
    status: "active" | "canceled" | "past_due" | "trialing" | "pending" | "suspended";
    mollieCustomerId: string | null;
    mollieSubscriptionId: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Invoice {
    id: number;
    molliePaymentId: string | null;
    amount: number;         // cents
    currency: string;
    status: "paid" | "pending" | "failed";
    downloadUrl: string | null;
    paidAt: string | null;
    createdAt: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBilling() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch helpers ───────────────────────────────────────────────────────────
    const fetchPlans = useCallback(async () => {
        const { data } = await billingApi.getPlans();
        setPlans(data);
    }, []);

    const fetchSubscription = useCallback(async () => {
        try {
            const { data } = await billingApi.getSubscription();
            setSubscription(data);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setSubscription(null);
            } else {
                throw err;
            }
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        const { data } = await billingApi.getInvoices();
        setInvoices(data);
    }, []);

    // ── Load all on mount ───────────────────────────────────────────────────────
    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([fetchPlans(), fetchSubscription(), fetchInvoices()])
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // ── Subscribe ───────────────────────────────────────────────────────────────
    // Redirects to Mollie checkout. The page will navigate away.
    async function subscribe(planId: PlanId) {
        setError(null);
        try {
            const { data } = await billingApi.subscribe(planId);
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl; // redirect to Mollie
            }
        } catch (err: any) {
            const message = err?.response?.data?.error ?? err.message ?? "Subscribe failed";
            setError(message);
            throw err;
        }
    }

    // ── Cancel ──────────────────────────────────────────────────────────────────
    async function cancel() {
        setError(null);
        try {
            const { data } = await billingApi.cancel();
            await fetchSubscription(); // refresh local state
            return data;
        } catch (err: any) {
            const message = err?.response?.data?.error ?? err.message ?? "Cancel failed";
            setError(message);
            throw err;
        }
    }

    // ── Refresh ──────────────────────────────────────────────────────────────────
    async function refresh() {
        await Promise.all([fetchSubscription(), fetchInvoices()]);
    }

    return {
        plans,
        subscription,
        invoices,
        loading,
        error,
        subscribe,
        cancel,
        refresh,
        // helpers
        isActive: subscription?.status === "active",
        isPending: subscription?.status === "pending",
        currentPlan: plans.find((p) => p.id === subscription?.planId) ?? null,
        amountDue: (cents: number) =>
            new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(cents / 100),
    };
}