"use client";

import { useState } from "react";
// Omar note: TEMP - `Lock` is only used by the locked "Annual" option, remove it with the lock.
import { ChevronLeft, Lock } from "lucide-react";
import type { Plan, PlanId } from "@/lib/useBilling";
// Omar note: TEMP - re-import ANNUAL_DISCOUNT_PERCENT from "@/lib/helpers" when the
// "Save 20%" badge comes back on the Annual option.
import SegmentedControl from "../SegmentedControl";
import PlanCard from "./PlanCard";
import PlanTrustStrip from "./PlanTrustStrip";

export type BillingInterval = "monthly" | "annual";

interface PlanSelectorProps {
  plans: Plan[];
  currentPlanId?: PlanId | null;
  subscribingPlanId?: PlanId | null;
  onChoose: (planId: PlanId) => void;
  /** Rendered only when the selector was opened from an active subscription. */
  onBack?: () => void;
}

export default function PlanSelector({
  plans,
  currentPlanId,
  subscribingPlanId,
  onChoose,
  onBack,
}: PlanSelectorProps) {
  // Omar note (see `annualPriceFromMonthly` in src/lib/helpers.ts): this interval only
  // changes the displayed price — checkout is still monthly until the backend ships
  // annual plans.
  const [interval, setInterval] = useState<BillingInterval>("monthly");

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
        <h2 className="text-2xl font-bold text-gray-900">Choose your plan</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cancel anytime. No long-term commitments.
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
              // Omar note: TEMP - annual plans don't exist on the backend yet, so this
              // option is locked with a "Coming soon" chip. When annual checkout works,
              // remove `disabled` and the Lock import, and put back the original badge:
              // <span className="rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              //   Save {ANNUAL_DISCOUNT_PERCENT}%
              // </span>
              disabled: true,
              badge: (
                <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  <Lock size={11} />
                  Coming soon
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            interval={interval}
            isCurrent={plan.id === currentPlanId}
            isSubscribing={subscribingPlanId === plan.id}
            onChoose={onChoose}
          />
        ))}
      </div>

      <div className="mt-8">
        <PlanTrustStrip />
      </div>
    </div>
  );
}
