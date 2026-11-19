"use client";

import type { Plan, PlanId } from "@/lib/useBilling";
import { handlePlanNameChange } from "@/lib/helpers";
import LimitUpgradeDialog from "./LimitUpgradeDialog";

interface CopilotLimitDialogProps {
  open: boolean;
  currentPlanId: PlanId | null;
  used: number;
  max: number;
  /** Plans above the current one, cheapest first. */
  tiers: Plan[];
  onClose: () => void;
}

/** Upgrade dialog shown when the copilot allowance is exhausted. */
export default function CopilotLimitDialog({
  open,
  currentPlanId,
  max,
  tiers,
  onClose,
}: CopilotLimitDialogProps) {
  const planName = currentPlanId
    ? handlePlanNameChange(currentPlanId)
    : "current";

  return (
    <LimitUpgradeDialog
      open={open}
      onClose={onClose}
      title="Copilot limit reached"
      description={
        <>
          Your {planName} plan includes {max} copilot
          {max === 1 ? "" : "s"} and you are using all {max}. Delete one of your
          copilots to free a slot{tiers.length > 0 ? ", or upgrade to add more" : ""}.
        </>
      }
      currentPlanId={currentPlanId}
      tiers={tiers}
      reason="copilots"
      featureKeyword="copilot"
      emptyTiersMessage="You are already on our highest plan. Contact support if you need more copilots."
    />
  );
}
