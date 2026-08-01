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
      "3 complete DIY projects per month",
      "Printable patterns sized to your pet",
      "Full materials list with cost estimates",
      "Step-by-step build instructions",
      "Downloadable PDF guide",
    ],
  },
  {
    id: "monthly_unlimited",
    name: "DIY+",
    description: "Build unlimited pet products and never pay retail again.",
    priceLabel: "$9.99",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_MONTHLY_UNLIMITED",
    features: [
      "Unlimited projects — build as much as you want",
      "Stop overpaying: 8 cost-cutting variations per project",
      "Profiles for every pet you own",
      "Full project history so you can rebuild anything",
      "Direct shopping links so you buy exactly what you need",
      "Priority analysis — results in seconds, not minutes",
    ],
  },
  {
    id: "annual_unlimited",
    name: "Maker Pro",
    description: "Turn your DIY skills into a business.",
    priceLabel: "$24.99",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_ANNUAL_UNLIMITED",
    features: [
      "Everything in DIY+",
      "Commercial-use patterns you can sell",
      "Generate 5 project variations at once",
      "SVG exports for cutting machines",
      "Know exactly what to charge with the profit calculator",
      "List on Etsy in minutes with the listing helper",
      "Earn commissions when members buy through your links",
    ],
  },
];

export function getPlan(id: PlanId): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}
