"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiProvider } from "@/lib/ApiProvider";
import GuardSubscriptionProvider from "./guardSubProvider";

const queryClient = new QueryClient();

export function DashboardProviders({ children }: { children: ReactNode }) {
    return (
        <ApiProvider>
            <QueryClientProvider client={queryClient}>
                <GuardSubscriptionProvider>
                    {children}
                </GuardSubscriptionProvider>
            </QueryClientProvider>
        </ApiProvider>
    );
}
