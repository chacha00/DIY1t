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
    name: "Unlimited Monthly",
    description: "Unlimited AI-generated DIY projects, billed monthly.",
    priceLabel: "$19",
    periodLabel: "/ month",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_MONTHLY_UNLIMITED",
    features: ["Unlimited projects", "Premium AI models", "Printable PDFs", "Priority support"],
  },
  {
    id: "annual_unlimited",
    name: "Unlimited Annual",
    description: "Unlimited AI-generated DIY projects, billed yearly — 2 months free.",
    priceLabel: "$190",
    periodLabel: "/ year",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_ANNUAL_UNLIMITED",
    features: ["Unlimited projects", "Premium AI models", "Printable PDFs", "Priority support", "2 months free"],
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
    priceLabel: "$12",
    periodLabel: "one-time",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_CREDIT_PACK_5",
    creditsGranted: 5,
    features: ["5 project credits", "Never expires", "20% cheaper per project"],
  },
  {
    id: "credit_pack_10",
    name: "10 Projects",
    description: "Ten DIY project credits.",
    priceLabel: "$20",
    periodLabel: "one-time",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_CREDIT_PACK_10",
    creditsGranted: 10,
    features: ["10 project credits", "Never expires", "33% cheaper per project"],
  },
];

export function getPlan(id: PlanId): PlanDefinition {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}
