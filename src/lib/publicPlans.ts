export type PublicPlan = {
  id: string;
  name: string;
  price: number;
  annual?: { price?: number | null } | null;
  maxEmailsPerMonth: number;
  features: string[];
};

const FALLBACK_PLANS: PublicPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 19,
    annual: { price: 179 },
    maxEmailsPerMonth: 500,
    features: [],
  },
  {
    id: "growth",
    name: "Growth",
    price: 39,
    annual: { price: 359 },
    maxEmailsPerMonth: 1200,
    features: [],
  },
  {
    id: "scale",
    name: "Scale",
    price: 79,
    annual: { price: 719 },
    maxEmailsPerMonth: 3000,
    features: [],
  },
];

function isPublicPlan(value: unknown): value is PublicPlan {
  if (typeof value !== "object" || value === null) return false;
  const plan = value as Partial<PublicPlan>;
  return typeof plan.id === "string" && typeof plan.price === "number";
}

export async function getPublicPlans(): Promise<PublicPlan[]> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
  ).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/billing/plans`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return FALLBACK_PLANS;

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return FALLBACK_PLANS;

    const plans = data.filter(isPublicPlan);
    return plans.length > 0 ? plans : FALLBACK_PLANS;
  } catch {
    return FALLBACK_PLANS;
  }
}
