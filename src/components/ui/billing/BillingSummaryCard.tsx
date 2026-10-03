"use client";

import { Loader2 } from "lucide-react";
import type { Plan, Subscription } from "@/lib/useBilling";
import { formatBillingDate, handlePlanNameChange } from "@/lib/helpers";

interface BillingSummaryCardProps {
  plan: Plan | null;
  subscription: Subscription | null;
  onUpdatePaymentMethod: () => void;
  isUpdatingPaymentMethod: boolean;
}

export default function BillingSummaryCard({
  plan,
  subscription,
  onUpdatePaymentMethod,
  isUpdatingPaymentMethod,
}: BillingSummaryCardProps) {
  const price = plan ? `€${plan.price.toFixed(2)}` : "—";
  const billingPeriod = plan?.interval === "year" ? "Annual" : "Monthly";

  const rows: { label: string; value: string }[] = [
    { label: "Plan", value: handlePlanNameChange(plan?.name ?? "") },
    { label: "Price", value: price },
    { label: "Billing period", value: billingPeriod },
    {
      label: "Next billing date",
      value: subscription?.cancelAtPeriodEnd
        ? "—"
        : formatBillingDate(subscription?.currentPeriodEnd),
    },
    {
      label: "Amount due",
      value: subscription?.cancelAtPeriodEnd ? "€0.00" : price,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Billing summary</h2>

      <dl className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <dt className="text-sm font-bold text-gray-900">{row.label}</dt>
            <dd className="text-sm text-gray-500">{row.value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={onUpdatePaymentMethod}
        disabled={isUpdatingPaymentMethod}
        className="btn-cta mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isUpdatingPaymentMethod && (
          <Loader2 size={14} className="animate-spin" />
        )}
        Update payment method
      </button>
    </div>
  );
}
