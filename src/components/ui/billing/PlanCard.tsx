"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import type { Plan, PlanId } from "@/lib/useBilling";
import {
  formatPlanFeature,
  handlePlanNameChange,
  planAnnualPrice,
  planTagline,
} from "@/lib/helpers";
import type { BillingInterval } from "./PlanSelector";

interface PlanCardProps {
  plan: Plan;
  interval: BillingInterval;
  isCurrent: boolean;
  attemptState?: "failed" | "pending" | null;
  isSubscribing: boolean;
  highlighted: boolean;
  onChoose: (planId: PlanId, interval: BillingInterval) => void;
}

export default function PlanCard({
  plan,
  interval,
  isCurrent,
  attemptState = null,
  isSubscribing,
  highlighted,
  onChoose,
}: PlanCardProps) {
  const isAnnual = interval === "annual";
  const price = isAnnual ? planAnnualPrice(plan) : plan.price;
  const period = isAnnual ? "/ year" : "/ month";
  const badgeLabel = isCurrent
    ? "Current plan"
    : attemptState === "failed"
      ? "Payment failed"
      : attemptState === "pending"
        ? "Awaiting payment"
        : highlighted
          ? "Most Popular"
          : null;
  const badgeClass =
    isCurrent || (!attemptState && highlighted)
      ? "bg-primary"
      : attemptState === "failed"
        ? "bg-error"
        : "bg-warning";
  const borderClass =
    attemptState === "failed"
      ? "border-error"
      : attemptState === "pending"
        ? "border-warning"
        : isCurrent || highlighted
          ? "border-primary"
          : "border-gray-200";
  const isEmphasized = badgeLabel !== null;
  const isDisabled =
    isCurrent || isSubscribing || attemptState === "pending";
  const buttonLabel = isCurrent
    ? "Current plan"
    : attemptState === "pending"
      ? "Awaiting payment"
      : isSubscribing
        ? "Starting checkout"
        : attemptState === "failed"
          ? "Retry payment"
          : "Choose plan";
  const buttonClass = isCurrent
    ? "cursor-default bg-gray-100 text-gray-400"
    : attemptState === "pending"
      ? "cursor-default bg-warning/10 text-warning"
      : attemptState === "failed"
        ? "bg-primary text-white hover:bg-primary-hover"
        : "bg-primary/5 text-primary hover:bg-primary/10";

  return (
    <div
      className={`relative flex flex-col rounded-xl bg-white p-6 transition-all ${
        isEmphasized ? "border-2 pt-12" : "border"
      } ${borderClass}`}
    >
      {badgeLabel && (
        <span
          className={`absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-b-lg px-6 py-1.5 text-sm font-semibold text-white ${badgeClass}`}
        >
          {badgeLabel}
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900">
        {handlePlanNameChange(plan.name)}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{planTagline(plan.id)}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-gray-900">
          €{isAnnual ? Math.floor(price) : price}
        </span>
        <span className="text-sm text-gray-500">{period}</span>
      </div>

      <button
        type="button"
        onClick={() => onChoose(plan.id, interval)}
        disabled={isDisabled}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${buttonClass} disabled:opacity-60`}
      >
        {isSubscribing && <Loader2 size={14} className="animate-spin" />}
        {buttonLabel}
      </button>

      <p className="mt-6 text-sm font-bold text-gray-900">Included:</p>
      <ul className="mt-4 space-y-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckCircle2
              size={18}
              className="shrink-0 fill-primary text-white"
            />
            <span className="text-sm text-gray-700">
              {formatPlanFeature(feature)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
