"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useBilling } from "@/lib/useBilling";

// Billing and everything nested under it (e.g. the FAQ) must stay reachable
// without a subscription. Otherwise users with no plan cannot read how billing
// works or choose a plan.
const BILLING_EXEMPT = ["/dashboard/billing"];

function isBillingExempt(pathname: string) {
    return BILLING_EXEMPT.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
}

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen items-center justify-center">
            {children}
        </div>
    );
}

export default function GuardSubscriptionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { loading, hasActivePlan, limits, limitsError, refetchLimits } =
        useBilling();

    useEffect(() => {
        if (loading) return;
        if (isBillingExempt(pathname)) return;

        if (limits && !hasActivePlan) {
            router.replace("/dashboard/billing?required=plan");
        }
    }, [loading, hasActivePlan, limits, pathname, router]);

    // Avoid flashing protected content while checking.
    if (loading) {
        return (
            <Shell>
                <span className="text-muted-foreground text-sm">Loading...</span>
            </Shell>
        );
    }

    if (!isBillingExempt(pathname)) {
        // A failed limits request must not look like "no plan": retry instead of
        // redirecting, otherwise a network blip traps the user on billing.
        if (!limits && limitsError) {
            return (
                <Shell>
                    <div className="max-w-sm text-center">
                        <p className="text-sm font-medium text-gray-900">
                            Couldn&apos;t load your plan
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {limitsError}
                        </p>
                        <button
                            type="button"
                            onClick={() => refetchLimits()}
                            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                        >
                            Try again
                        </button>
                    </div>
                </Shell>
            );
        }

        if (!limits || !hasActivePlan) {
            // A redirect is in flight (or the limits query has not produced a
            // result yet); keep the shell up instead of flashing the dashboard.
            return (
                <Shell>
                    <span className="text-muted-foreground text-sm">
                        Loading...
                    </span>
                </Shell>
            );
        }
    }

    return <>{children}</>;
}
