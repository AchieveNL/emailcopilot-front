"use client";

import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import api from "./api";

export function ApiProvider({ children }: { children: React.ReactNode }) {
    const { getToken, isLoaded, isSignedIn, sessionId } = useAuth();
    const [authentication, setAuthentication] = useState<{
        getToken: typeof getToken;
        sessionId: string;
    } | null>(null);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        const id = api.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                if (!token) {
                    throw new Error("Your session has expired. Please sign in again.");
                }
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
        );
        setAuthentication({ getToken, sessionId });

        return () => {
            api.interceptors.request.eject(id);
        };
    }, [getToken, isLoaded, isSignedIn, sessionId]);

    if (isLoaded && !isSignedIn) return <RedirectToSignIn />;

    // Descendants can fetch on mount, so install authentication first.
    if (!isLoaded || authentication?.getToken !== getToken || authentication?.sessionId !== sessionId) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="text-sm text-gray-500">Loading…</span>
            </div>
        );
    }

    return <>{children}</>;
}
