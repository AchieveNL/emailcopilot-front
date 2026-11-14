import { isAxiosError } from "axios";
import type { LimitsResponse } from "./types";
import type { Plan, PlanId } from "./useBilling";

/** Current copilot allowance for the signed-in user. */
export interface CopilotQuota {
  used: number;
  /** null means unlimited (First Class). */
  max: number | null;
  atLimit: boolean;
}

/**
 * Reads the copilot allowance out of `GET /billing/limits`. Returns null while
 * the limits are unknown (still loading, no active plan, or the request failed)
 * so callers can fail open instead of blocking the user.
 */
export function copilotQuota(
  limits: LimitsResponse | null | undefined,
): CopilotQuota | null {
  if (!limits || !limits.hasActivePlan || !limits.limits) return null;

  const max = limits.limits.copilots;
  const used = limits.usage.copilotsCount;

  return {
    used,
    max,
    atLimit: max != null && used >= max,
  };
}

/**
 * Backend enforcement answers copilot creation with a 4xx and
 * `{"error":"Plan limit reached: max 3 copilots on growth"}`. Used to swap the
 * generic "Failed to save" toast for the upgrade dialog.
 */
export function isCopilotLimitError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;

  const data = error.response?.data as
    | { error?: string; message?: string }
    | undefined;
  const message = data?.error || data?.message || "";

  return /plan limit reached/i.test(message) && /copilot/i.test(message);
}

/** Monthly email allowance for the signed-in user. */
export interface EmailQuota {
  used: number;
  max: number;
  remaining: number;
  /** 0–100, clamped. */
  percent: number;
  atLimit: boolean;
  /** 90% or more used but allowance left. */
  nearlyExhausted: boolean;
  /** End of the current billing period — when the allowance renews. */
  resetAt: string | null;
}

/**
 * Reads the monthly email allowance out of `GET /billing/limits`. Returns null
 * while the limits are unknown so callers can fail open.
 */
export function emailQuota(
  limits: LimitsResponse | null | undefined,
): EmailQuota | null {
  if (!limits || !limits.hasActivePlan || !limits.limits) return null;

  const max = limits.limits.emailsPerMonth;
  const used = limits.usage.emailsSent;

  // `emailsRemaining` / `emailsPercent` are convenience duplicates of
  // `used` / `max` and can disagree with them (e.g. stale or partial data).
  // Derive from the raw counters and fall back to the reported values as an
  // upper bound, so a full allowance can never be reported as "room left".
  const derivedRemaining = Math.max(0, max - used);
  const reportedRemaining = limits.usage.emailsRemaining;
  const remaining =
    reportedRemaining == null
      ? derivedRemaining
      : Math.min(derivedRemaining, reportedRemaining);

  const derivedPercent = max > 0 ? (used / max) * 100 : 0;
  const percent = Math.min(
    100,
    Math.max(derivedPercent, limits.usage.emailsPercent ?? 0),
  );

  const atLimit = used >= max || remaining <= 0;

  return {
    used,
    max,
    remaining,
    percent,
    atLimit,
    nearlyExhausted: !atLimit && percent >= 90,
    resetAt: limits.periodEnd,
  };
}

export function currentPlanId(
  limits: LimitsResponse | null | undefined,
): PlanId | null {
  return limits && limits.hasActivePlan ? limits.planId : null;
}

/** Plans above the current one, cheapest first. */
export function higherTiers(plans: Plan[], planId: PlanId | null): Plan[] {
  const currentPrice = plans.find((plan) => plan.id === planId)?.price ?? 0;

  return plans
    .filter((plan) => plan.price > currentPrice)
    .sort((a, b) => a.price - b.price);
}
