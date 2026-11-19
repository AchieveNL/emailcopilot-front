export type BillingIntent = {
  plan: string;
  interval: "month" | "year";
};

const PLAN_ID_PATTERN = /^[a-z0-9-]{1,32}$/;

type SearchParamValue = string | string[] | null | undefined;

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseBillingIntent(
  planParam: SearchParamValue,
  intervalParam: SearchParamValue,
): BillingIntent | null {
  const plan = firstValue(planParam)?.trim().toLowerCase();
  if (!plan || !PLAN_ID_PATTERN.test(plan)) return null;

  const interval = firstValue(intervalParam)?.trim().toLowerCase();
  return {
    plan,
    interval:
      interval === "annual" || interval === "year" ? "year" : "month",
  };
}

export function billingRedirectFromSearchParams(
  planParam: SearchParamValue,
  intervalParam: SearchParamValue,
) {
  const intent = parseBillingIntent(planParam, intervalParam);
  if (!intent) return null;

  return `/dashboard/billing?plan=${encodeURIComponent(intent.plan)}&interval=${intent.interval}`;
}
