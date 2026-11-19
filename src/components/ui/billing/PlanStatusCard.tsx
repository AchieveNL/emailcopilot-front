"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import type { Plan, Subscription } from "@/lib/useBilling";
import {
  formatPlanFeature,
  handlePlanNameChange,
  planAnnualPrice,
  PLAN_ICONS,
} from "@/lib/helpers";

interface PlanStatusCardProps {
  plan: Plan | null;
  subscription: Subscription | null;
  status: "failed" | "pending";
  onRetry: () => void;
  isRetrying: boolean;
  onRefresh: () => void;
  onChangePlan: () => void;
}

export default function PlanStatusCard({
  plan,
  subscription,
  status,
  onRetry,
  isRetrying,
  onRefresh,
  onChangePlan,
}: PlanStatusCardProps) {
  const PlanIcon = PLAN_ICONS[plan?.id ?? "starter"] ?? PLAN_ICONS.starter;
  const rawInterval = subscription?.billingInterval ?? plan?.interval;
  const billingPeriod =
    rawInterval === "year" || rawInterval === "annual"
      ? "Annual"
      : "Monthly";
  const displayPrice =
    plan == null
      ? "0"
      : billingPeriod === "Annual"
        ? `${Math.floor(planAnnualPrice(plan))}`
        : `${plan.price}`;
  const failed = status === "failed";
  const StatusIcon = failed ? AlertCircle : Clock;

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {failed ? "Payment failed" : "Payment pending"}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            {failed
              ? "This plan is not active yet and you have not been charged. Retry the payment to activate it."
              : "We have not received payment yet. Your plan stays inactive until the payment is confirmed."}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            failed
              ? "bg-error/10 text-error"
              : "bg-warning/10 text-warning"
          }`}
        >
          <StatusIcon size={13} />
          {failed ? "Failed" : "Awaiting payment"}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/5">
          <PlanIcon size={22} className="text-primary" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">
            {handlePlanNameChange(plan?.name ?? "")}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              €{displayPrice}
            </span>{" "}
            / {billingPeriod}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-gray-900">Included after payment</p>
        <ul className="mt-3 space-y-2.5">
          {(plan?.features ?? []).map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="shrink-0 text-gray-300" />
              <span className="text-sm text-gray-500">
                {formatPlanFeature(feature)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        {failed ? (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="btn-cta flex items-center justify-center gap-2 rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isRetrying && <Loader2 size={14} className="animate-spin" />}
            {isRetrying ? "Starting checkout" : "Retry payment"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-warning/30 bg-white px-4 py-2.5 text-sm font-semibold text-warning transition-colors hover:bg-warning/5"
          >
            Refresh status
          </button>
        )}
        <button
          type="button"
          onClick={onChangePlan}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
        >
          Choose another plan
        </button>
      </div>
    </div>
  );
}
