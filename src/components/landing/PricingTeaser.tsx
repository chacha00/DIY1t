import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["3 free projects", "Basic instructions", "Standard support"],
    cta: "Start Free",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Unlimited Monthly",
    price: "$19",
    period: "/ month",
    features: [
      "Unlimited projects",
      "Premium AI models",
      "Printable PDFs",
      "Priority support",
    ],
    cta: "Go Unlimited",
    variant: "primary" as const,
    featured: true,
  },
  {
    name: "Credit Pack",
    price: "$9",
    period: "/ 5 projects",
    features: ["Pay as you go", "No subscription", "Credits never expire"],
    cta: "Buy Credits",
    variant: "outline" as const,
    featured: false,
  },
];

export function PricingTeaser() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Plans for every builder"
          description="Start free, upgrade when you're ready to build without limits."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.featured
                  ? "relative border-2 border-brand-blue-500 p-8"
                  : "p-8"
              }
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge color="orange">Most Popular</Badge>
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <LinkButton
                href="/pricing"
                variant={plan.variant}
                className="mt-8 w-full"
              >
                {plan.cta}
              </LinkButton>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
