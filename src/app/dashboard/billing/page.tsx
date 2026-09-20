"use client";

import { useState } from "react";
import { CircleHelp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardHeader from "@/components/layout/DashboardHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BillingSummaryCard from "@/components/ui/billing/BillingSummaryCard";
import CurrentPlanCard from "@/components/ui/billing/CurrentPlanCard";
import InvoicesCard from "@/components/ui/billing/InvoicesCard";
import NeedHelpCard from "@/components/ui/billing/NeedHelpCard";
import PlanSelector from "@/components/ui/billing/PlanSelector";
import { useBilling, type PlanId } from "@/lib/useBilling";

export default function BillingPage() {
  const {
    plans,
    subscription,
    invoices,
    limits,
    loading,
    error,
    subscribe,
    cancel,
    updatePaymentMethod,
    isActive,
    isPending,
    isCanceling,
    isUpdatingPaymentMethod,
    currentPlan,
    amountDue,
  } = useBilling();

  const [showPlans, setShowPlans] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [subscribingPlanId, setSubscribingPlanId] = useState<PlanId | null>(
    null,
  );

  const hasSubscription = isActive || subscription?.status === "trialing";

  async function handleSubscribe(planId: PlanId) {
    setSubscribingPlanId(planId);
    try {
      // Resolves by navigating away to Mollie's hosted checkout.
      await subscribe(planId);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not start checkout. Try again.",
      );
      setSubscribingPlanId(null);
    }
  }

  async function handleCancel() {
    try {
      await cancel();
      setCancelOpen(false);
      toast.success(
        "Subscription canceled. You keep access until the end of your billing period.",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not cancel your subscription.",
      );
    }
  }

  async function handleUpdatePaymentMethod() {
    try {
      await updatePaymentMethod();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update your payment method. Try again.",
      );
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 w-full max-w-6xl mx-auto">
      <DashboardHeader
        title="Billing"
        description="Manage your subscription, payment method and invoices."
        actionLabel="Billing FAQ"
        mobileActionLabel="FAQ"
        actionIcon={CircleHelp}
        actionVariant="outline"
        actionHref="/dashboard/billing/faq"
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isPending && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          Your payment is still being processed. This page updates as soon as
          it&apos;s confirmed.
        </div>
      )}

      {hasSubscription && !showPlans ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <CurrentPlanCard
              plan={currentPlan}
              subscription={subscription}
              limits={limits}
              onChangePlan={() => setShowPlans(true)}
              onCancel={() => setCancelOpen(true)}
              onUpdatePaymentMethod={handleUpdatePaymentMethod}
              isUpdatingPaymentMethod={isUpdatingPaymentMethod}
            />
            <InvoicesCard invoices={invoices} formatAmount={amountDue} />
          </div>

          <div className="min-w-0 space-y-6">
            <BillingSummaryCard
              plan={currentPlan}
              subscription={subscription}
              onUpdatePaymentMethod={handleUpdatePaymentMethod}
              isUpdatingPaymentMethod={isUpdatingPaymentMethod}
            />
            <NeedHelpCard />
          </div>
        </div>
      ) : (
        <PlanSelector
          plans={plans}
          currentPlanId={subscription?.planId ?? null}
          subscribingPlanId={subscribingPlanId}
          onChoose={handleSubscribe}
          onBack={
            hasSubscription && showPlans ? () => setShowPlans(false) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={cancelOpen}
        title="Cancel your subscription?"
        description="You'll keep access to your current plan until the end of your billing period. Your Copilots and data stay untouched."
        confirmLabel={isCanceling ? "Canceling..." : "Cancel plan"}
        cancelLabel="Keep plan"
        tone="danger"
        loading={isCanceling}
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}
