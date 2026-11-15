"use client";
import { useEffect } from "react";
import { useBilling } from "@/lib/useBilling";
import { useRouter, usePathname } from "next/navigation";

// Billing and everything nested under it (e.g. the FAQ) must stay reachable without
// a subscription — otherwise users with no plan cannot read how billing works.
const BILLING_EXEMPT = ["/dashboard/billing"];

function isBillingExempt(pathname: string) {
    return BILLING_EXEMPT.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
}

export default function GuardSubscriptionProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const { subscriptionLoading, subscriptionFetching, subscriptionError, retrySubscription, hasSubscription } = useBilling();
    useEffect(() => {
        if (subscriptionLoading || subscriptionError) return;
        if (isBillingExempt(pathname)) return;

        if (!hasSubscription) {
            router.replace("/dashboard/billing");
        }
    }, [subscriptionLoading, subscriptionError, hasSubscription, pathname, router]);

    // Keep billing (including its FAQ) mounted even if the API is unavailable.
    // Unmounting a failed query's consumer can trigger another fetch on remount.
    if (isBillingExempt(pathname)) return <>{children}</>;

    if (subscriptionError) {
        return (
            <div className="flex h-screen items-center justify-center p-6">
                <div role="alert" className="text-center">
                    <p className="text-sm text-gray-700">
                        We couldn&apos;t check your subscription. Please try again.
                    </p>
                    <button
                        type="button"
                        onClick={() => void retrySubscription()}
                        disabled={subscriptionFetching}
                        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                        {subscriptionFetching ? "Retrying…" : "Try again"}
                    </button>
                </div>
            </div>
        );
    }

    // Avoid flashing protected content while checking
    if (subscriptionLoading || !hasSubscription) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="text-muted-foreground text-sm">Loading…</span>
            </div>
        );
    }
    return (
        <>
            {children}
        </>
    );
}
