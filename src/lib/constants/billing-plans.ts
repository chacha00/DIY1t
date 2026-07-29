export type PlanId =
  | "free"
  | "monthly_unlimited"
  | "annual_unlimited";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  priceLabel: string;
  periodLabel: string;
  mode: "subscription" | "payment";
  /** Env var name holding the Stripe Price ID for this plan. */
  priceEnvVar: string;
  creditsGranted?: number;
  features: string[];
}

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    description: "Try DIY1T with a few projects.",
    priceLabel: "$0",
    periodLabel: "forever",
    mode: "subscription",
    priceEnvVar: "",
    features: [
      "3 projects per month",
      "Pattern, measurements & step-by-step instructions",
      "Downloadable PDF",
      "1 pet profile",
    ],
  },
  {
    id: "monthly_unlimited",
    name: "DIY+",
    description: "For active makers who build regularly.",
    priceLabel: "$9.99",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_MONTHLY_UNLIMITED",
    features: [
      "Everything in Free",
      "Unlimited projects",
      "All 8 AI customizations (cheaper, beginner, eco, premium, durable, alt, quick build, kid-friendly)",
      "Unlimited pet profiles",
      "Project history & library",
      "Shopping links on every list",
      "Priority AI generation",
    ],
  },
  {
    id: "annual_unlimited",
    name: "Maker Pro",
    description: "For sellers, professionals, and serious makers.",
    priceLabel: "$24.99",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_ANNUAL_UNLIMITED",
    features: [
      "Everything in DIY+",
      "Original commercial-use patterns",
      "Batch generation (5 at once)",
      "SVG pattern exports",
      "Pricing & profit calculator",
      "Etsy listing helper",
      "Affiliate revenue sharing",
    ],
  },
];

export function getPlan(id: PlanId): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}
