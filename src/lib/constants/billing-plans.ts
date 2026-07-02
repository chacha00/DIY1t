export type PlanId =
  | "monthly_unlimited"
  | "annual_unlimited"
  | "credit_pack_1"
  | "credit_pack_5"
  | "credit_pack_10";

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
    id: "monthly_unlimited",
    name: "DIY+",
    description: "For active makers who build regularly.",
    priceLabel: "$9.99",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_MONTHLY_UNLIMITED",
    features: [
      "Unlimited projects per month",
      "All 8 customization versions",
      "Unlimited pet profiles",
      "Project history & library",
      "Shopping links on every list",
      "Priority AI generation",
      "Printable PDFs",
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
  {
    id: "credit_pack_1",
    name: "1 Project",
    description: "A single DIY project credit.",
    priceLabel: "$3",
    periodLabel: "one-time",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_CREDIT_PACK_1",
    creditsGranted: 1,
    features: ["1 project credit", "Never expires"],
  },
  {
    id: "credit_pack_5",
    name: "5 Projects",
    description: "Five DIY project credits.",
    priceLabel: "$7",
    periodLabel: "one-time",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_CREDIT_PACK_5",
    creditsGranted: 5,
    features: ["5 project credits", "Never expires", "Save 53%"],
  },
  {
    id: "credit_pack_10",
    name: "10 Projects",
    description: "Ten DIY project credits.",
    priceLabel: "$12",
    periodLabel: "one-time",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_CREDIT_PACK_10",
    creditsGranted: 10,
    features: ["10 project credits", "Never expires", "Save 60%"],
  },
];

export function getPlan(id: PlanId): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}
