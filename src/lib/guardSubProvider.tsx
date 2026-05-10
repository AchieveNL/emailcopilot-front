"use client";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileMenu from "@/components/layout/MobileMenu";
import { DashboardProviders } from "@/lib/providers";
import { useBilling } from "@/lib/useBilling";
import { useRouter, usePathname } from "next/navigation";

const BILLING_EXEMPT = ["/dashboard/billing"];

export default function GuardSubscriptionProvider({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const { subscription, loading, isActive } = useBilling();
    useEffect(() => {
        if (loading) return;
        if (BILLING_EXEMPT.includes(pathname)) return;

        const needsSubscription = !subscription || (!isActive && subscription.status !== "trialing");

        if (needsSubscription) {
            router.replace("/dashboard/billing");
        }
    }, [loading, subscription, isActive, pathname, router]);

    // Avoid flashing protected content while checking
    if (loading || (!isActive && !BILLING_EXEMPT.includes(pathname))) {
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
