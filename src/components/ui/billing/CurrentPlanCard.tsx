"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { LimitsResponse } from "@/lib/types";
import type { Plan, Subscription } from "@/lib/useBilling";
import {
  formatBillingDate,
  handlePlanNameChange,
  PLAN_ICONS,
} from "@/lib/helpers";
import ActionMenu from "../ActionMenu";
import ProgressBar from "../ProgressBar";

interface CurrentPlanCardProps {
  plan: Plan | null;
  subscription: Subscription | null;
  limits: LimitsResponse | null;
  onChangePlan: () => void;
  onCancel: () => void;
  onUpdatePaymentMethod: () => void;
  isUpdatingPaymentMethod: boolean;
}

export default function CurrentPlanCard({
  plan,
  subscription,
  limits,
  onChangePlan,
  onCancel,
  onUpdatePaymentMethod,
  isUpdatingPaymentMethod,
}: CurrentPlanCardProps) {
  const PlanIcon = PLAN_ICONS[plan?.id ?? "starter"] ?? PLAN_ICONS.starter;
  const emailsSent = limits?.usage?.emailsSent ?? 0;
  const emailsLimit = limits?.limits?.emailsPerMonth ?? 0;
  const emailsPercent = limits?.usage?.emailsPercent ?? 0;
  const isCanceling = Boolean(subscription?.cancelAtPeriodEnd);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Current Plan</h2>
        {!isCanceling && (
          <ActionMenu
            ariaLabel="Subscription actions"
            items={[
              {
                label: "Cancel plan",
                icon: XCircle,
                variant: "danger",
                onSelect: onCancel,
              },
            ]}
          />
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plan details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/5">
              <PlanIcon size={22} className="text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">
                {handlePlanNameChange(plan?.name ?? "")}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  €{plan?.price ?? 0}
                </span>{" "}
                / {plan?.interval ?? "month"}
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-3">
            {(plan?.features ?? []).map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="shrink-0 fill-primary text-white"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onChangePlan}
            className="btn-cta mt-6 w-full rounded-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-white sm:w-auto sm:self-start sm:px-6"
          >
            Change plan
          </button>
        </div>

        {/* Usage */}
        <div className="rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-bold text-gray-900">Email credits usage</p>

          <p className="mt-3 text-2xl font-bold text-primary">
            {emailsSent}{" "}
            <span className="text-gray-900">/ {emailsLimit}</span>
          </p>
          <p className="text-xs text-gray-500">Emails used</p>

          <div className="mt-4">
            <ProgressBar percent={emailsPercent} />
            <p className="mt-2 text-right text-xs text-gray-500">
              {Math.round(emailsPercent)} % used
            </p>
          </div>

          <hr className="my-4 border-gray-100" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-gray-900">
              Plan renews on
            </span>
            <span className="text-xs text-gray-500">
              {formatBillingDate(subscription?.currentPeriodEnd)}
            </span>
          </div>

          <hr className="my-4 border-gray-100" />

          {/* Omar note: The design shows the saved card as "Visa •••• 4242", but no API
              endpoint returns the card brand or its last four digits — GET /billing/subscription
              only exposes the internal mollieCustomerId / mollieSubscriptionId. Rather than
              invent digits, this renders a neutral "Card on file" label. Once the backend
              returns the brand and last4 (ideally on GET /billing/subscription), replace the
              literal below with those values. */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-gray-900">
              Payment method
            </span>
            <span className="flex items-center gap-2 text-xs text-gray-500">
              Card on file
              <button
                type="button"
                onClick={onUpdatePaymentMethod}
                disabled={isUpdatingPaymentMethod}
                className="flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-hover disabled:opacity-50"
              >
                {isUpdatingPaymentMethod && (
                  <Loader2 size={12} className="animate-spin" />
                )}
                Update
              </button>
            </span>
          </div>
        </div>
      </div>

      {isCanceling && (
        <p className="mt-5 rounded-lg bg-warning/10 px-4 py-3 text-sm text-warning">
          Your plan is canceled and stays active until{" "}
          {formatBillingDate(subscription?.currentPeriodEnd)}.
        </p>
      )}
    </div>
  );
}
