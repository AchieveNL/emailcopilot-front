// /lib/api/provider.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import api from "./api";

export function ApiProvider({ children }: { children: React.ReactNode }) {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    console.log("Auth loaded:", isLoaded, "Signed in:", isSignedIn); // Debugging line to check auth state
    const interceptorRef = useRef<number | null>(null);

    useEffect(() => {
        interceptorRef.current = api.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                console.log("Attaching token to request:", token); // Debugging line to check token value
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            if (interceptorRef.current !== null) {
                api.interceptors.request.eject(interceptorRef.current);
                interceptorRef.current = null; // ← reset so it re-registers next mount
            }
        };
    }, [getToken]); // ← also re-run if getToken identity changes

    return <>{children}</>;
}