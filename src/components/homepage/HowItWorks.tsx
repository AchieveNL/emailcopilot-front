// components/HowItWorks.tsx
// Requires: DM Sans + DM Mono from Google Fonts (add to your layout or globals.css)
// Tailwind CSS v4 with the globals.css variables provided

import { Send } from "lucide-react";
import React from "react";

const avatars = [
    { initials: "A", bg: "bg-indigo-500" },
    { initials: "B", bg: "bg-blue-600" },
    { initials: "C", bg: "bg-cyan-500" },
    { initials: "D", bg: "bg-violet-600" },
];

function StepBadge({ number, color }: { number: number; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border border-${color} flex items-center justify-center text-xs font-semibold text-${color} flex-shrink-0`}>
                {number}
            </div>
        </div>
    );
}

// ─── Card 1: Pricing ────────────────────────────────────────────────
function PricingCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 py-6 flex flex-col gap-5 min-h-[220px]">
            <div className="flex items-center gap-2">
                <StepBadge number={1} color="primary" />
                <span className="text-[13.5px] font-bold text-primary">
                    Starting at €9/month
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-primary leading-none">
                        <sup className="text-xl font-semibold align-top mt-2 inline-block">
                            €
                        </sup>
                        9
                    </span>
                    <span className="text-sm text-gray-500 font-normal">/ month</span>
                </div>

                <ul className="mt-3 flex flex-col gap-2">
                    {[
                        { label: "Grow as you go", icon: "check" },
                        { label: "Cancel anytime", icon: "x" },
                        { label: "No credit card required", icon: "lock" },
                    ].map(({ label, icon }) => (
                        <li key={label} className="flex items-center gap-2 text-[12.5px] text-gray-700">
                            <span className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center flex-shrink-0">
                                {icon === "check" && (
                                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                                        <path d="M2 5l2 2 4-4" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                {icon === "x" && (
                                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                                        <path d="M3 3l4 4M7 3l-4 4" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" />
                                    </svg>
                                )}
                                {icon === "lock" && (
                                    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                                        <rect x="1.5" y="4" width="7" height="5" rx="1" stroke="#4f46e5" strokeWidth="1.1" />
                                        <path d="M3 4V3a2 2 0 014 0v1" stroke="#4f46e5" strokeWidth="1.1" strokeLinecap="round" />
                                    </svg>
                                )}
                            </span>
                            {label}
                        </li>
                    ))}
                </ul>

                <button className="mt-4 w-full py-2.5 rounded-xl border-[1.5px] border-indigo-200 bg-indigo-50 text-indigo-600 text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors">
                    Subscribe now →
                </button>
            </div>
        </div>
    );
}

// ─── Card 2: Define Customer ─────────────────────────────────────────
function DefineCustomerCard() {
    const rows = [
        {
            label: "Companies in the Netherlands,\n10–50 employees",
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
                    <path
                        d="M9 2C6.24 2 4 4.24 4 7c0 3.94 5 9 5 9s5-5.06 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                        stroke="#4f46e5"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            label: "Amsterdam, 25km radius",
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
                    <circle cx="9" cy="9" r="6.5" stroke="#4f46e5" strokeWidth="1.2" />
                    <path d="M9 2.5v6.5l4 2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            label: "AI found 1,842 matching companies",
            icon: (
                <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
                    <circle cx="8" cy="8" r="5" stroke="#4f46e5" strokeWidth="1.2" />
                    <path d="M12 12l3 3" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M6 8h4M8 6v4" stroke="#4f46e5" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-8 min-h-[220px]">
            <div className="flex items-center gap-2">
                <StepBadge number={2} color="secondary" />
                <span className="text-[13.5px] font-bold text-secondary">
                    Define your ideal customer
                </span>
            </div>
            <div className="flex flex-col gap-8">
                {rows.map(({ label, icon }) => (
                    <div key={label} className="flex items-start gap-6">
                        <div className="mt-0.5 flex-shrink-0">{icon}</div>
                        <p className="text-[12.5px] text-gray-700 leading-snug whitespace-pre-line">
                            {label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Card 3: Automatic Outbound ──────────────────────────────────────
function AutoOutboundCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-8 min-h-[220px]">
            <div className="flex items-center gap-2">
                <StepBadge number={3} color="secondary" />
                <span className="text-[13.5px] font-bold text-secondary">
                    Automatic outbound
                </span>
            </div>

            <div className="flex-1">
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden text-[11.5px]">
                    {/* From */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 text-[11px] min-w-[36px]">From</span>
                        <span className="text-gray-700">you@yourdomain.com</span>
                    </div>

                    {/* To */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 text-[11px] min-w-[36px]">To</span>
                        <div className="flex items-center">
                            {avatars.map((av, i) => (
                                <div
                                    key={av.initials}
                                    className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${av.bg} ${i > 0 ? "-ml-1" : ""}`}
                                >
                                    {av.initials}
                                </div>
                            ))}
                            <div className="-ml-1 w-5 h-5 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[9px] font-semibold text-gray-600">
                                +82
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 text-[11px] min-w-[36px]">Subject</span>
                        <span className="text-gray-400 italic">Quick idea for {"{{company}}"}</span>
                    </div>

                    {/* Body lines */}
                    <div className="px-3 py-3 flex flex-col gap-1.5">
                        <div className="h-1.5 bg-gray-200 rounded-full w-full" />
                        <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
                    </div>

                    {/* Send button */}
                    <div className="mx-3 mb-3 rounded-lg px-3 py-2.5 flex items-center justify-between text-white text-[12px] font-semibold" style={{ background: "linear-gradient(86.91deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)" }}>
                        Send email
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <Send size={12} className="text-white" strokeWidth={2} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Card 4: Straight to Inbox ───────────────────────────────────────
function InboxCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-8 min-h-[220px]">
            <div className="flex items-center gap-2">
                <StepBadge number={4} color="light" />
                <span className="text-[13.5px] font-bold text-light">
                    Straight to your inbox
                </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-2xl border border-gray-200 flex items-center justify-center">
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.3335 35.4167C8.3335 20.8334 16.6668 14.5834 29.1668 14.5834H70.8335C83.3335 14.5834 91.6668 20.8334 91.6668 35.4167V64.5834C91.6668 79.1667 83.3335 85.4167 70.8335 85.4167H29.1668" stroke="#06B6D4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M70.8332 37.5L57.7915 47.9167C53.4998 51.3333 46.4582 51.3333 42.1665 47.9167L29.1665 37.5" stroke="#06B6D4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.3335 68.75H33.3335" stroke="#06B6D4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.3335 52.0834H20.8335" stroke="#06B6D4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                </div>
                <div className="text-center">
                    <p className="text-[13px] font-bold text-gray-900">You stay in control</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed mt-1">
                        Manage your email.<br />
                        Build relationships.<br />
                        Close replies.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ─── Section Wrapper ─────────────────────────────────────────────────
export default function HowItWorks() {
    return (
        <section className="relative py-16 px-4 bg-gray-50 overflow-hidden">
            {/* Decorative dot grid (top-left) */}
            <div
                aria-hidden
                className="absolute top-0 left-0 w-48 h-48 opacity-30"
                style={{
                    backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                }}
            />

            {/* Decorative dot grid (bottom-right) */}
            <div
                aria-hidden
                className="absolute bottom-0 right-0 w-48 h-48 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                }}
            />

            <div className="relative mx-auto">
                {/* Heading */}
                <div className="text-center mb-10">
                    <h2 className="text-6xl text-gray-900  leading-tight" style={{ fontFamily: 'DM Serif Display' }}>
                        Sit back, let your{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage:
                                    "linear-gradient(86.91deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)",
                            }}
                        >
                            Copilot
                        </span>{" "}
                        take over
                    </h2>
                    <p className="mt-2 text-gray-500 text-base font-bold">
                        Set it. Forget it.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <PricingCard />
                    <DefineCustomerCard />
                    <AutoOutboundCard />
                    <InboxCard />
                </div>
            </div>
        </section>
    );
}