"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChartSpline,
  CircleCheck,
  Clock,
  Mail,
  Plane,
  Rocket,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import ScrollFloat from "./ScrollFloat";
import { BILLING_SUPPORT_EMAIL } from "@/lib/billingFaq";

type Billing = "monthly" | "annual";

type Theme = {
  card: string;
  iconBox: string;
  title: string;
  subtitle: string;
  divider: string;
  price: string;
  period: string;
  badge: string;
  check: string;
  feature: string;
  cta: string;
};

type HomepagePlan = {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Monthly price in euros. `null` = custom pricing. */
  price: number | null;
  /** Price for 12 months when billed yearly, in euros. */
  annualPrice?: number;
  customNote?: string;
  emails: string;
  features: string[];
  cta: string;
  href: string;
  tag?: string;
  theme: Theme;
};

const PLANS: HomepagePlan[] = [
  {
    name: "Economy",
    description: "Perfect for individuals.",
    icon: Send,
    price: 19,
    annualPrice: 179,
    emails: "500 emails / month",
    features: [
      "1 Copilot",
      "1 connected email account",
      "CSV export included",
      "Email support",
    ],
    cta: "Subscribe now",
    href: "/sign-in",
    theme: {
      card: "bg-white border border-indigo-200",
      iconBox: "bg-indigo-50 text-indigo-600",
      title: "text-indigo-600",
      subtitle: "text-gray-500",
      divider: "bg-gray-100",
      price: "text-indigo-600",
      period: "text-gray-500",
      badge: "bg-indigo-50 text-indigo-600",
      check: "text-indigo-600",
      feature: "text-gray-700",
      cta: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    },
  },
  {
    name: "Business Class",
    description: "Perfect for growing businesses.",
    icon: ChartSpline,
    price: 39,
    annualPrice: 359,
    emails: "1,200 emails / month",
    features: [
      "3 Copilots",
      "3 connected email accounts",
      "CSV export included",
      "Email support",
    ],
    cta: "Subscribe now",
    href: "/sign-in",
    tag: "Most popular",
    theme: {
      card: "bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 shadow-xl shadow-blue-500/20 md:-my-3",
      iconBox: "bg-white/15 text-white",
      title: "text-white",
      subtitle: "text-indigo-100",
      divider: "bg-white/20",
      price: "text-white",
      period: "text-indigo-100",
      badge: "bg-white/20 text-white",
      check: "text-white",
      feature: "text-white",
      cta: "bg-white text-indigo-600 hover:bg-indigo-50",
    },
  },
  {
    name: "First Class",
    description: "For power users and teams",
    icon: Rocket,
    price: 79,
    annualPrice: 719,
    emails: "3000 emails / month",
    features: [
      "8 Copilots",
      "5 connected email accounts",
      "CSV export included",
      "Priority support",
    ],
    cta: "Subscribe now",
    href: "/sign-in",
    theme: {
      card: "bg-white border border-cyan-200",
      iconBox: "bg-cyan-50 text-cyan-500",
      title: "text-cyan-500",
      subtitle: "text-gray-500",
      divider: "bg-gray-100",
      price: "text-cyan-500",
      period: "text-gray-500",
      badge: "bg-cyan-50 text-cyan-600",
      check: "text-cyan-500",
      feature: "text-gray-700",
      cta: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100",
    },
  },
  {
    name: "Private Jet",
    description: "For agencies and custom needs",
    icon: Plane,
    price: null,
    customNote: "Tell us what you need and we price it with you.",
    emails: "Beyond 3000 emails / month",
    features: [
      "Negotiated Copilots",
      "Beyond 5 connected email accounts",
      "CSV export included",
      "Dedicated support",
    ],
    cta: "Contact us",
    href: `mailto:${BILLING_SUPPORT_EMAIL}?subject=Private%20Jet%20plan`,
    theme: {
      card: "bg-slate-50 border border-indigo-100",
      iconBox: "bg-white text-gray-900",
      title: "text-gray-900",
      subtitle: "text-gray-500",
      divider: "bg-gray-200",
      price: "text-gray-900",
      period: "text-gray-500",
      badge: "bg-white text-gray-900 border border-gray-200",
      check: "text-gray-700",
      feature: "text-gray-700",
      cta: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    },
  },
];

const TRUST_ITEMS: { icon: LucideIcon; title: string; description: string }[] =
  [
    {
      icon: CalendarDays,
      title: "Monthly or yearly",
      description:
        "Monthly cancels anytime. Yearly is billed once for 12 months.",
    },
    {
      icon: Mail,
      title: "Your own email",
      description:
        "Every email is sent from your own connected account, so replies come back to you.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & reliable",
      description:
        "Connected over OAuth. Your data is encrypted and never shared.",
    },
    {
      icon: Clock,
      title: "Sent at a safe pace.",
      description:
        "We spread your sends across the month so your messages land in the inbox, not in spam.",
    },
  ];

function formatEuro(value: number) {
  return `€${Math.round(value)}`;
}

function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const isAnnual = billing === "annual";

  return (
    <section
      id="pricing"
      className="py-20 px-4 z-0 max-w-315 w-full mx-auto"
    >
      <div className="text-center mb-8 flex flex-col items-center justify-center">
        <ScrollFloat
          as="h2"
          containerClassName="text-5xl md:text-6xl text-gray-900 leading-tight flex justify-center w-full"
          textClassName="text-5xl md:text-6xl leading-tight text-gray-900"
          highlightWords={["flying"]}
          style={{ fontFamily: "DM Serif Display", fontWeight: "normal" }}
        >
          Start flying today!
        </ScrollFloat>
        <p className="mt-3 text-gray-500 text-base md:text-lg">
          Start as low as €19 / month. Cancel your monthly plan anytime.
        </p>
      </div>

      {/* Monthly / Annual toggle */}
      <div className="flex justify-center mb-12">
        <div
          role="tablist"
          aria-label="Billing interval"
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={!isAnnual}
            onClick={() => setBilling("monthly")}
            className={`rounded-lg px-8 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              !isAnnual
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isAnnual}
            onClick={() => setBilling("annual")}
            className={`flex items-center gap-3 rounded-lg px-6 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              isAnnual
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            Annual
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
              Save over 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const t = plan.theme;
          const yearly =
            isAnnual && plan.price !== null && plan.annualPrice !== undefined
              ? {
                  full: plan.price * 12,
                  price: plan.annualPrice,
                  perMonth: plan.annualPrice / 12,
                  saved: plan.price * 12 - plan.annualPrice,
                }
              : null;
          const price = yearly ? yearly.price : plan.price;

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-5 ${t.card}`}
            >
              {plan.tag && (
                <span className="absolute -top-3 right-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-indigo-600 shadow-sm">
                  {plan.tag}
                </span>
              )}

              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className={`text-[15px] font-bold ${t.title}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs ${t.subtitle}`}>{plan.description}</p>
                </div>
              </div>

              <div className={`my-4 h-px ${t.divider}`} />

              {/* Price */}
              {price === null ? (
                <div>
                  <p className={`text-3xl font-bold ${t.price}`}>Custom</p>
                  {plan.customNote && (
                    <p className={`mt-1 text-xs ${t.subtitle}`}>
                      {plan.customNote}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {yearly && (
                    <p className={`text-xs line-through ${t.period}`}>
                      {formatEuro(yearly.full)}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-5xl font-bold tracking-tight ${t.price}`}
                    >
                      {formatEuro(price)}
                    </span>
                    <span className={`text-sm ${t.period}`}>
                      {yearly ? "/ year" : "/ month"}
                    </span>
                  </div>
                  {yearly && (
                    <p className={`mt-1 text-xs ${t.subtitle}`}>
                      Billed once for 12 months. About{" "}
                      {formatEuro(yearly.perMonth)} a month, you save{" "}
                      {formatEuro(yearly.saved)}.
                    </p>
                  )}
                </div>
              )}

              {/* Email volume */}
              <div className="mt-4">
                <span
                  className={`inline-flex rounded-lg px-4 py-1.5 text-xs font-medium ${t.badge}`}
                >
                  {plan.emails}
                </span>
              </div>

              {/* Features */}
              <ul className="mt-5 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CircleCheck size={16} className={`shrink-0 ${t.check}`} />
                    <span className={`text-xs ${t.feature}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-colors ${t.cta}`}
              >
                {plan.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Trust strip */}
      <div className="mt-10 grid grid-cols-1 gap-6 rounded-2xl bg-slate-50 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map(({ icon: TrustIcon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <TrustIcon size={16} className="mt-0.5 shrink-0 text-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
