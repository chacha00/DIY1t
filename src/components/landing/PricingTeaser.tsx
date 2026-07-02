import { Check, Sparkles } from "lucide-react";
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
    description: "Try it out",
    features: [
      "3 complete DIY projects",
      "Pattern pieces + measurements",
      "Step-by-step instructions",
      "PDF download",
      "Pet profile (1 pet)",
    ],
    cta: "Start Free",
    href: "/register",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "DIY+",
    price: "$9.99",
    period: "/ month",
    description: "For active makers",
    features: [
      "Unlimited projects",
      "All customization versions",
      "Unlimited pet profiles",
      "Project history & library",
      "Shopping links on every list",
      "Priority AI generation",
    ],
    cta: "Start DIY+",
    href: "/pricing",
    variant: "primary" as const,
    featured: true,
  },
  {
    name: "Maker Pro",
    price: "$24.99",
    period: "/ month",
    description: "For sellers & professionals",
    features: [
      "Everything in DIY+",
      "Original commercial use patterns",
      "Batch generation (5 at once)",
      "SVG pattern exports",
      "Pricing & profit calculator",
      "Etsy listing helper",
      "Affiliate revenue sharing",
    ],
    cta: "Go Pro",
    href: "/pricing",
    variant: "outline" as const,
    featured: false,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Plans for every maker"
          description="Start free, upgrade when you're ready to build without limits."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "relative border-2 border-brand-blue-500 p-8" : "p-8"}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge color="orange">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-400">{plan.description}</p>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-400">{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <LinkButton href={plan.href} variant={plan.variant} className="mt-8 w-full">
                {plan.cta}
              </LinkButton>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          All plans include unlimited pet profiles after DIY+. Credit packs also available — buy 5 projects for $7 or 10 for $12. No subscriptions required.
        </p>
      </Container>
    </section>
  );
}
