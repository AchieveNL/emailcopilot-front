"use client";

import type { Plan, PlanId } from "@/lib/useBilling";
import { formatBillingDate, handlePlanNameChange } from "@/lib/helpers";
import LimitUpgradeDialog from "./LimitUpgradeDialog";

interface EmailLimitDialogProps {
  open: boolean;
  currentPlanId: PlanId | null;
  used: number;
  max: number;
  /** End of the current billing period, when the allowance renews. */
  resetAt: string | null;
  /** Plans above the current one, cheapest first. */
  tiers: Plan[];
  onClose: () => void;
}

/** Upgrade dialog shown when the monthly email allowance is exhausted. */
export default function EmailLimitDialog({
  open,
  currentPlanId,
  used,
  max,
  resetAt,
  tiers,
  onClose,
}: EmailLimitDialogProps) {
  const planName = currentPlanId
    ? handlePlanNameChange(currentPlanId)
    : "current";
  const resetLabel = resetAt ? formatBillingDate(resetAt) : null;

  const description =
    tiers.length > 0
      ? `Your ${planName} plan includes ${max} emails per month and you have used all ${used}. Upgrade for a higher monthly allowance${
          resetLabel ? `, or wait until ${resetLabel}` : ""
        } when your allowance renews.`
      : `Your ${planName} plan includes ${max} emails per month and you have used all ${used}. You are on our highest plan, so sending resumes when your allowance renews${
          resetLabel ? ` on ${resetLabel}` : ""
        }.`;

  return (
    <LimitUpgradeDialog
      open={open}
      onClose={onClose}
      title="Monthly email allowance reached"
      description={description}
      currentPlanId={currentPlanId}
      tiers={tiers}
      reason="emails"
      featureKeyword="email"
      emptyTiersMessage="You are already on our highest plan. Your allowance renews automatically next month."
    />
  );
}
