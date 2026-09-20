"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import type { Plan, PlanId } from "@/lib/useBilling";
import {
  annualPriceFromMonthly,
  handlePlanNameChange,
  planTagline,
} from "@/lib/helpers";
import type { BillingInterval } from "./PlanSelector";

interface PlanCardProps {
  plan: Plan;
  interval: BillingInterval;
  isCurrent: boolean;
  isSubscribing: boolean;
  onChoose: (planId: PlanId) => void;
}

export default function PlanCard({
  plan,
  interval,
  isCurrent,
  isSubscribing,
  onChoose,
}: PlanCardProps) {
  const isAnnual = interval === "annual";
  const price = isAnnual ? annualPriceFromMonthly(plan.price) : plan.price;
  const period = isAnnual ? "/ year" : "/ month";

  return (
    <div
      className={`relative flex flex-col rounded-xl bg-white p-6 transition-all ${
        plan.highlight ? "pt-12 " : ""
      }${
        plan.highlight
          ? "border-2 border-primary shadow-sm"
          : "border border-gray-200"
      }`}
    >
      {plan.highlight && (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-b-lg bg-primary px-6 py-1.5 text-sm font-semibold text-white">
          Most Popular
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900">
        {handlePlanNameChange(plan.name)}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{planTagline(plan.id)}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">€{price}</span>
        <span className="text-sm text-gray-500">{period}</span>
      </div>

      <button
        type="button"
        onClick={() => onChoose(plan.id)}
        disabled={isCurrent || isSubscribing}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${
          isCurrent
            ? "cursor-default bg-gray-100 text-gray-400"
            : "bg-primary/5 text-primary hover:bg-primary/10"
        } disabled:opacity-60`}
      >
        {isSubscribing && <Loader2 size={14} className="animate-spin" />}
        {isCurrent ? "Current plan" : "Choose plan"}
      </button>

      <p className="mt-6 text-sm font-bold text-gray-900">Included:</p>
      <ul className="mt-4 space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckCircle2
              size={18}
              className="shrink-0 fill-primary text-white"
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
