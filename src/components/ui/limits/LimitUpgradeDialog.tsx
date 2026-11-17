"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import type { Plan, PlanId } from "@/lib/useBilling";
import {
  formatPlanFeature,
  handlePlanNameChange,
  planAnnualPrice,
  planTagline,
} from "@/lib/helpers";

type Interval = "month" | "year";

interface LimitUpgradeDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  currentPlanId: PlanId | null;
  /** Plans above the current one, cheapest first. */
  tiers: Plan[];
  /** Query param handed to billing so the plan selector opens. */
  reason: string;
  /** Feature to highlight on each tier, e.g. "copilot" or "email". */
  featureKeyword: string;
  /** Shown instead of the tier list when there is nothing to upgrade to. */
  emptyTiersMessage: string;
  onClose: () => void;
}

function planFeature(plan: Plan, keyword: string): string | null {
  const feature = plan.features.find((item) =>
    item.toLowerCase().includes(keyword.toLowerCase()),
  );
  return feature ? formatPlanFeature(feature) : null;
}

/** Compact plan-upgrade dialog shared by every limit surface. */
export default function LimitUpgradeDialog({
  open,
  title,
  description,
  currentPlanId,
  tiers,
  reason,
  featureKeyword,
  emptyTiersMessage,
  onClose,
}: LimitUpgradeDialogProps) {
  const [interval, setInterval] = useState<Interval>("month");

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const canUpgrade = tiers.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 z-100 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="limit-dialog-title"
        className="fixed left-1/2 top-1/2 z-120 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="px-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Rocket size={18} />
            </div>
            <div>
              <h2
                id="limit-dialog-title"
                className="text-lg font-bold text-gray-900"
              >
                {title}
              </h2>
              <div className="mt-1 text-sm text-gray-500">{description}</div>
            </div>
          </div>

          {canUpgrade && (
            <div className="mt-5 inline-flex rounded-lg bg-gray-100 p-1">
              {(["month", "year"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setInterval(option)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    interval === option
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {option === "month" ? "Monthly" : "Yearly (save 20%)"}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto px-6">
          {!canUpgrade && (
            <li className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500">
              {emptyTiersMessage}
            </li>
          )}
          {tiers.map((plan) => {
            const price =
              interval === "month" ? plan.price : planAnnualPrice(plan);
            const feature = planFeature(plan, featureKeyword);

            return (
              <li
                key={plan.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {handlePlanNameChange(plan.name)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {planTagline(plan.id)}
                  </p>
                  {feature && (
                    <p className="mt-1 text-xs font-medium text-primary">
                      {feature}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-gray-900">
                    €{Math.round(price)}
                  </p>
                  <p className="text-[11px] text-gray-400">/ {interval}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          {canUpgrade ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Maybe later
              </button>
              <Link
                href={`/dashboard/billing?upgrade=${reason}`}
                onClick={onClose}
                className="btn-cta inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-white"
              >
                Go to Billing <ArrowRight size={15} />
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="btn-cta ml-auto rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-white"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </>
  );
}
