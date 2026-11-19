"use client";

import { useEffect, useState } from "react";
import { CircleHelp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardHeader from "@/components/layout/DashboardHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BillingSummaryCard from "@/components/ui/billing/BillingSummaryCard";
import CurrentPlanCard from "@/components/ui/billing/CurrentPlanCard";
import InvoicesCard from "@/components/ui/billing/InvoicesCard";
import NeedHelpCard from "@/components/ui/billing/NeedHelpCard";
import PlanSelector from "@/components/ui/billing/PlanSelector";
import PlanStatusCard from "@/components/ui/billing/PlanStatusCard";
import type { BillingInterval } from "@/components/ui/billing/PlanSelector";
import { parseBillingIntent } from "@/lib/billingIntent";
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
    refresh,
    refetchLimits,
    hasActivePlan,
    hasSubscription,
    paymentState,
    attemptedPlan,
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [requestedPlanId, setRequestedPlanId] = useState<PlanId | null>(null);
  const [requestedInterval, setRequestedInterval] =
    useState<BillingInterval | null>(null);
  const inactivePaymentStatus =
    paymentState === "failed" || paymentState === "pending"
      ? paymentState
      : null;
  const subscriptionBillingInterval: BillingInterval =
    subscription?.billingInterval === "year" ||
    subscription?.billingInterval === "annual"
      ? "annual"
      : "monthly";
  const initialBillingInterval =
    requestedInterval ?? subscriptionBillingInterval;

  // Upgrade CTAs elsewhere in the app link here with ?upgrade=<reason> so the
  // plan selector opens straight away instead of the current-plan overview.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade")) setShowPlans(true);

    const intent = parseBillingIntent(
      params.get("plan"),
      params.get("interval"),
    );
    if (intent) {
      setRequestedInterval(intent.interval === "year" ? "annual" : "monthly");
    }
  }, []);

  // Pricing links carry the selected plan through sign-up. Validate it against
  // the backend plans once they load, then consume it so a refresh does not
  // reopen the selector later.
  useEffect(() => {
    if (plans.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const intent = parseBillingIntent(
      params.get("plan"),
      params.get("interval"),
    );
    if (!intent) return;

    if (plans.some((plan) => plan.id === intent.plan)) {
      setRequestedPlanId(intent.plan as PlanId);
    }
    setShowPlans(true);
    window.history.replaceState(null, "", "/dashboard/billing");
  }, [plans]);

  async function handleSubscribe(planId: PlanId, interval: BillingInterval) {
    setSubscribingPlanId(planId);
    try {
      // Resolves by navigating away to Mollie's hosted checkout.
      await subscribe(
        planId,
        interval === "annual" ? "year" : "month",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not start checkout. Try again.",
      );
      setSubscribingPlanId(null);
    }
  }

  async function handleRetry() {
    if (!subscription) return;

    setIsRetrying(true);
    try {
      const annual =
        subscription.billingInterval === "year" ||
        subscription.billingInterval === "annual";

      await subscribe(subscription.planId, annual ? "year" : "month");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not retry payment. Try again.",
      );
    } finally {
      setIsRetrying(false);
    }
  }

  function handleRefresh() {
    refetchLimits();
    refresh();
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

      {inactivePaymentStatus && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          <span className="min-w-0 flex-1">
            {paymentState === "failed"
              ? "Payment failed. You have not been charged. Your plan is not active yet. Retry the payment below to finish setting it up."
              : "We have not received payment yet. No charge has been made. Refresh to check the latest status."}
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            className="shrink-0 rounded-lg border border-warning/30 bg-white px-3 py-1.5 text-xs font-semibold text-warning transition-colors hover:bg-warning/5"
          >
            Refresh status
          </button>
        </div>
      )}

      {!hasActivePlan && !hasSubscription && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          An active plan is required to use the dashboard. Choose a plan below
          to get started.
        </div>
      )}

      {hasActivePlan && !showPlans ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Flat grid so each right-hand card shares a row (top edge and
              height) with the card to its left. */}
          <div className="min-w-0 lg:col-span-2 *:h-full">
            <CurrentPlanCard
              plan={currentPlan}
              subscription={subscription}
              limits={limits}
              onChangePlan={() => setShowPlans(true)}
              onCancel={() => setCancelOpen(true)}
              onUpdatePaymentMethod={handleUpdatePaymentMethod}
              isUpdatingPaymentMethod={isUpdatingPaymentMethod}
            />
          </div>
          <div className="min-w-0 *:h-full">
            <BillingSummaryCard
              plan={currentPlan}
              subscription={subscription}
              mode="active"
              onUpdatePaymentMethod={handleUpdatePaymentMethod}
              isUpdatingPaymentMethod={isUpdatingPaymentMethod}
            />
          </div>
          <div className="min-w-0 lg:col-span-2 *:h-full">
            <InvoicesCard invoices={invoices} formatAmount={amountDue} />
          </div>
          <div className="min-w-0 *:h-full">
            <NeedHelpCard />
          </div>
        </div>
      ) : inactivePaymentStatus && !showPlans ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2 *:h-full">
            <PlanStatusCard
              plan={attemptedPlan}
              subscription={subscription}
              status={inactivePaymentStatus}
              onRetry={handleRetry}
              isRetrying={isRetrying}
              onRefresh={handleRefresh}
              onChangePlan={() => setShowPlans(true)}
            />
          </div>
          <div className="min-w-0 *:h-full">
            <BillingSummaryCard
              plan={attemptedPlan}
              subscription={subscription}
              mode="inactive"
              paymentState={inactivePaymentStatus}
              onUpdatePaymentMethod={handleUpdatePaymentMethod}
              isUpdatingPaymentMethod={isUpdatingPaymentMethod}
            />
          </div>
          <div className="min-w-0 lg:col-span-2 *:h-full">
            <InvoicesCard invoices={invoices} formatAmount={amountDue} />
          </div>
          <div className="min-w-0 *:h-full">
            <NeedHelpCard />
          </div>
        </div>
      ) : (
        <PlanSelector
          plans={plans}
          currentPlanId={hasActivePlan ? subscription?.planId ?? null : null}
          attemptedPlanId={
            inactivePaymentStatus ? subscription?.planId ?? null : null
          }
          preselectedPlanId={requestedPlanId}
          paymentState={paymentState}
          initialInterval={initialBillingInterval}
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
