"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { PaymentState, Plan, PlanId } from "@/lib/useBilling";
import { maxAnnualDiscountPercent } from "@/lib/helpers";
import SegmentedControl from "../SegmentedControl";
import PlanCard from "./PlanCard";
import PlanTrustStrip from "./PlanTrustStrip";

export type BillingInterval = "monthly" | "annual";

interface PlanSelectorProps {
  plans: Plan[];
  currentPlanId?: PlanId | null;
  attemptedPlanId?: PlanId | null;
  preselectedPlanId?: PlanId | null;
  paymentState?: PaymentState;
  initialInterval?: BillingInterval;
  subscribingPlanId?: PlanId | null;
  onChoose: (planId: PlanId, interval: BillingInterval) => void;
  /** Rendered only when the selector was opened from a subscription. */
  onBack?: () => void;
}

export default function PlanSelector({
  plans,
  currentPlanId,
  attemptedPlanId,
  preselectedPlanId,
  paymentState,
  initialInterval = "monthly",
  subscribingPlanId,
  onChoose,
  onBack,
}: PlanSelectorProps) {
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const annualDiscount = maxAnnualDiscountPercent(plans);
  const hasPreselection =
    preselectedPlanId != null &&
    currentPlanId == null &&
    attemptedPlanId == null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft size={16} />
          Back to billing
        </button>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {hasPreselection ? "Review your plan" : "Choose your plan"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {hasPreselection
            ? "Your plan and billing interval are ready. Continue to checkout when you are ready."
            : "Cancel anytime. No long-term commitments."}
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <SegmentedControl<BillingInterval>
          ariaLabel="Billing interval"
          value={interval}
          onChange={setInterval}
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "annual",
              label: "Annual",
              badge:
                annualDiscount > 0 ? (
                  <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                    Save up to {annualDiscount}%
                  </span>
                ) : undefined,
            },
          ]}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const attemptState =
            plan.id === attemptedPlanId &&
            (paymentState === "failed" || paymentState === "pending")
              ? paymentState
              : null;
          const isSelected =
            plan.id === preselectedPlanId &&
            currentPlanId == null &&
            attemptedPlanId == null;

          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              isCurrent={plan.id === currentPlanId}
              attemptState={attemptState}
              isSubscribing={subscribingPlanId === plan.id}
              isSelected={isSelected}
              highlighted={
                currentPlanId != null
                  ? plan.id === currentPlanId
                  : attemptedPlanId != null
                    ? plan.id === attemptedPlanId
                    : isSelected ||
                      (!hasPreselection && (plan.highlight ?? false))
              }
              onChoose={onChoose}
            />
          );
        })}
      </div>

      <div className="mt-8">
        <PlanTrustStrip />
      </div>
    </div>
  );
}
