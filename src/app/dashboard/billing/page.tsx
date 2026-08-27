"use client";

import React from "react";
import { useBilling, Plan } from "@/lib/useBilling";
import { CreditCard, Check, Download } from "lucide-react";
import { handlePlanNameChange } from "@/lib/helpers";
export default function BillingPage() {
  const {
    plans,
    subscription,
    invoices,
    loading,
    error,
    subscribe,
    cancel,
    isActive,
    isPending,
    currentPlan,
    amountDue,
  } = useBilling();

  const [subscribing, setSubscribing] = React.useState(false);
  const [canceling, setCanceling] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  async function handleSubscribe(planId: Plan["id"]) {
    setActionError(null);
    setSubscribing(true);
    try {
      await subscribe(planId);
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setSubscribing(false);
    }
  }

  async function handleCancel() {
    if (
      !confirm(
        "Cancel your subscription? You'll keep access until the end of your billing period.",
      )
    )
      return;
    setActionError(null);
    setCanceling(true);
    try {
      await cancel();
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setCanceling(false);
    }
  }

  const statusColors: Record<string, string> = {
    paid: "text-emerald-600 bg-emerald-50",
    pending: "text-amber-600 bg-amber-50",
    failed: "text-red-600 bg-red-50",
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Error state */}
      {(error || actionError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700 text-sm">
          {error ?? actionError}
        </div>
      )}

      {/* Current subscription */}
      {isActive && currentPlan && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <CreditCard size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {handlePlanNameChange(currentPlan.name)} Plan
                <span
                  className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isActive ? "Active" : isPending ? "Pending" : "Inactive"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {subscription?.currentPeriodEnd
                  ? `Renews on ${new Date(
                      subscription.currentPeriodEnd,
                    ).toLocaleDateString()}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!subscription?.cancelAtPeriodEnd && (
              <button
                onClick={handleCancel}
                disabled={canceling}
                className="text-sm px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
              >
                {canceling ? "Canceling..." : "Cancel Plan"}
              </button>
            )}
            {subscription?.cancelAtPeriodEnd && (
              <span className="text-xs text-amber-600 font-medium">
                Cancels at period end
              </span>
            )}
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.planId === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                plan.highlight ? "border-emerald-500" : "border-gray-200"
              } relative`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Most Popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {handlePlanNameChange(plan.name)}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    €{plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check
                      size={14}
                      className="text-emerald-500 flex-shrink-0"
                    />{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrentPlan && handleSubscribe(plan.id)}
                disabled={isCurrentPlan || subscribing}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrentPlan
                    ? "bg-gray-100 text-gray-400 cursor-default"
                    : plan.highlight
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                {isCurrentPlan
                  ? "Current Plan"
                  : subscribing
                    ? "Switching..."
                    : "Switch to " + plan.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Billing History</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No invoices yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium">Date</th>
                <th className="text-left px-6 py-3 font-medium">Amount</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-right px-6 py-3 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr
                  key={inv.id}
                  className={`text-sm ${
                    idx < invoices.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 text-gray-900">
                    {new Date(inv.paidAt || inv.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {amountDue(inv.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        statusColors[inv.status]
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.downloadUrl ? (
                      <a
                        href={inv.downloadUrl}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        <Download size={12} /> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
