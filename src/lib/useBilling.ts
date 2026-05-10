"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "./api";
import { LimitsResponse } from "./types";

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
    amount: number; // cents
    currency: string;
    status: "paid" | "pending" | "failed";
    downloadUrl: string | null;
    paidAt: string | null;
    createdAt: string;
}

// ─── Query Keys ───────────────────────────────────────────────────────────────
// Centralised so invalidations are never a typo away.

export const billingKeys = {
    all: ["billing"] as const,
    plans: () => [...billingKeys.all, "plans"] as const,
    subscription: () => [...billingKeys.all, "subscription"] as const,
    invoices: () => [...billingKeys.all, "invoices"] as const,
    limits: () => [...billingKeys.all, "limits"] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBilling() {
    const queryClient = useQueryClient();

    // ── Queries ─────────────────────────────────────────────────────────────────

    const plansQuery = useQuery<Plan[]>({
        queryKey: billingKeys.plans(),
        queryFn: () => billingApi.getPlans().then((r) => r.data),
        staleTime: 5 * 60 * 1000, // plans rarely change — cache for 5 min
    });

    const subscriptionQuery = useQuery<Subscription | null>({
        queryKey: billingKeys.subscription(),
        queryFn: async () => {
            try {
                const { data } = await billingApi.getSubscription();
                return data;
            } catch (err: any) {
                if (err?.response?.status === 404) return null; // no subscription yet — not an error
                throw err;
            }
        },
    });

    const invoicesQuery = useQuery<Invoice[]>({
        queryKey: billingKeys.invoices(),
        queryFn: () => billingApi.getInvoices().then((r) => r.data),
    });

    const limitsQuery = useQuery<LimitsResponse>({
        queryKey: billingKeys.limits(),
        queryFn: () => billingApi.getLimits().then((r) => r.data),
    });

    // ── Mutations ────────────────────────────────────────────────────────────────

    // Redirects to Mollie checkout on success — page navigates away.
    const subscribeMutation = useMutation({
        mutationFn: (planId: PlanId) => billingApi.subscribe(planId).then((r) => r.data),
        onSuccess: (data) => {
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        },
    });

    const cancelMutation = useMutation({
        mutationFn: () => billingApi.cancel().then((r) => r.data),
        onSuccess: () => {
            // Refresh subscription state after cancellation
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
        },
    });

    // ── Derived state ────────────────────────────────────────────────────────────

    const subscription = subscriptionQuery.data ?? null;
    const plans = plansQuery.data ?? [];

    // Unified loading — true until all four queries have settled at least once
    const loading =
        plansQuery.isLoading ||
        subscriptionQuery.isLoading ||
        invoicesQuery.isLoading ||
        limitsQuery.isLoading;

    // Surface the first error across all queries/mutations
    const error =
        (plansQuery.error as Error)?.message ??
        (subscriptionQuery.error as Error)?.message ??
        (invoicesQuery.error as Error)?.message ??
        (limitsQuery.error as Error)?.message ??
        subscribeMutation.error?.message ??
        cancelMutation.error?.message ??
        null;

    return {
        // ── Data ──────────────────────────────────────────────────────────────────
        plans,
        subscription,
        invoices: invoicesQuery.data ?? [],
        limits: limitsQuery.data ?? null,

        // ── State ─────────────────────────────────────────────────────────────────
        loading,
        error,

        // ── Actions ───────────────────────────────────────────────────────────────
        subscribe: (planId: PlanId) => subscribeMutation.mutateAsync(planId),
        cancel: () => cancelMutation.mutateAsync(),

        // Explicit refresh for e.g. post-Mollie redirect return pages
        refresh: () =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: billingKeys.subscription() }),
                queryClient.invalidateQueries({ queryKey: billingKeys.invoices() }),
            ]),

        // Mutation loading states — useful for disabling buttons
        isSubscribing: subscribeMutation.isPending,
        isCanceling: cancelMutation.isPending,

        // ── Helpers ───────────────────────────────────────────────────────────────
        isActive: subscription?.status === "active",
        isPending: subscription?.status === "pending",
        currentPlan: plans.find((p) => p.id === subscription?.planId) ?? null,
        amountDue: (cents: number) =>
            new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
                cents / 100
            ),
    };
}