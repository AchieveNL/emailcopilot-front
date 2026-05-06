"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, Download, Zap, Shield, Users } from "lucide-react";
import { billingApi } from "@/lib/api";

type Plan = {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  highlight?: boolean;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  downloadUrl: string;
};

type Subscription = {
  planId: string;
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

const PLAN_ICONS: Record<string, React.ElementType> = {
  starter: Zap,
  pro: Shield,
  team: Users,
};

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [interval, setIntervalMode] = useState<"month" | "year">("month");

  useEffect(() => { fetchBillingData(); }, []);

  async function fetchBillingData() {
    try {
      setLoading(true);
      const [plansRes, subRes, invoicesRes] = await Promise.all([
        billingApi.getPlans(),
        billingApi.getSubscription(),
        billingApi.getInvoices(),
      ]);
      setPlans(plansRes.data);
      setSubscription(subRes.data);
      setInvoices(invoicesRes.data);
    } catch {
      setPlans([
        { id: "starter", name: "Starter", price: 29, interval: "month", features: ["3 Copilots", "1 Email Profile", "500 emails/mo", "Basic templates", "Email support"] },
        { id: "pro", name: "Pro", price: 79, interval: "month", features: ["15 Copilots", "5 Email Profiles", "5,000 emails/mo", "Unlimited templates", "Priority support", "API access"], highlight: true },
        { id: "team", name: "Team", price: 199, interval: "month", features: ["Unlimited Copilots", "20 Email Profiles", "25,000 emails/mo", "Custom templates", "Dedicated support", "API access", "Team seats"] },
      ]);
      setInvoices([]);
    } finally { setLoading(false); }
  }

  async function handleSubscribe(planId: string) {
    try {
      setSwitching(planId);
      await billingApi.subscribe(planId);
      fetchBillingData();
    } catch { alert("Failed to switch plan."); } finally { setSwitching(null); }
  }

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll retain access until the end of the billing period.")) return;
    try {
      setCanceling(true);
      await billingApi.cancel();
      fetchBillingData();
    } catch { alert("Failed to cancel."); } finally { setCanceling(false); }
  }

  const statusColors: Record<string, string> = {
    paid: "text-emerald-600 bg-emerald-50",
    pending: "text-amber-600 bg-amber-50",
    failed: "text-red-600 bg-red-50",
  };

  if (loading) return <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current subscription */}
      {subscription && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <CreditCard size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {plans.find(p => p.id === subscription.planId)?.name ?? subscription.planId} Plan
                <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${subscription.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {subscription.status}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                  : `Renews on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Update Payment
            </button>
            {!subscription.cancelAtPeriodEnd && (
              <button onClick={handleCancel} disabled={canceling} className="text-sm px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50">
                {canceling ? "Canceling..." : "Cancel Plan"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interval toggle */}
      <div className="flex items-center justify-center mb-6 gap-3">
        <span className="text-sm text-gray-500">Monthly</span>
        <button
          onClick={() => setIntervalMode(interval === "month" ? "year" : "month")}
          className={`relative w-12 h-6 rounded-full transition-colors ${interval === "year" ? "bg-gray-900" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${interval === "year" ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
        <span className="text-sm text-gray-500">Yearly <span className="text-emerald-600 font-medium">–20%</span></span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {plans.map(plan => {
          const isCurrentPlan = subscription?.planId === plan.id;
          const Icon = PLAN_ICONS[plan.id] || Zap;
          const price = interval === "year" ? Math.round(plan.price * 0.8) : plan.price;
          return (
            <div key={plan.id} className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${plan.highlight ? "border-gray-900" : "border-gray-200"} relative`}>
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">Most Popular</span>
              )}
              <div className="mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${plan.highlight ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"}`}>
                  <Icon size={16} />
                </div>
                <h3 className="font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-gray-900">€{price}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                {interval === "year" && <p className="text-xs text-emerald-600 mt-0.5">Billed yearly (€{price * 12}/yr)</p>}
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrentPlan && handleSubscribe(plan.id)}
                disabled={isCurrentPlan || switching === plan.id}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${isCurrentPlan ? "bg-gray-100 text-gray-400 cursor-default" : plan.highlight ? "bg-gray-900 text-white hover:bg-gray-700" : "border border-gray-200 text-gray-700 hover:bg-gray-50"} disabled:opacity-50`}
              >
                {isCurrentPlan ? "Current Plan" : switching === plan.id ? "Switching..." : "Switch to " + plan.name}
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
          <div className="p-8 text-center text-gray-400 text-sm">No invoices yet.</div>
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
                <tr key={inv.id} className={`text-sm ${idx < invoices.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <td className="px-6 py-4 text-gray-900">{new Date(inv.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">€{(inv.amount / 100).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a href={inv.downloadUrl} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                      <Download size={12} /> PDF
                    </a>
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
