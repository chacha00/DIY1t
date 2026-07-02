import { Check, Sparkles, Zap } from "lucide-react";
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
    description: "Try it — no card needed",
    features: [
      "3 complete DIY projects",
      "Pattern pieces + measurements",
      "Step-by-step instructions",
      "PDF download",
      "1 pet profile",
    ],
    cta: "Start Free",
    href: "/register",
    variant: "outline" as const,
    featured: false,
    badge: null,
    highlight: null,
  },
  {
    name: "DIY+",
    price: "$9.99",
    period: "/ month",
    description: "For active makers",
    valueLine: "Unlimited projects for less than a coffee",
    features: [
      "Unlimited projects",
      "All 8 customization versions",
      "Unlimited pet profiles",
      "Project history & library",
      "Shopping links on every list",
      "Priority AI generation",
    ],
    cta: "Start DIY+",
    href: "/pricing",
    variant: "primary" as const,
    featured: true,
    badge: "⭐ Most Popular",
    highlight: "Save 84% vs buying all plans separately",
  },
  {
    name: "Maker Pro",
    price: "$24.99",
    period: "/ month",
    description: "For sellers & professionals",
    features: [
      "Everything in DIY+",
      "Original commercial-use patterns",
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
    badge: null,
    highlight: null,
  },
];

export function PricingTeaser() {
  return (
    <section id="pricing" className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Plans for every maker"
          description="Start free. Upgrade when you're ready to build without limits."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.featured
                  ? "relative border-2 border-brand-blue-500 p-8 shadow-soft-lg"
                  : "p-8"
              }
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge color="orange">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
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

              {plan.highlight && (
                <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-brand-orange-50 px-3 py-2">
                  <Zap className="h-3.5 w-3.5 shrink-0 text-brand-orange-500" />
                  <p className="text-xs font-semibold text-brand-orange-600">{plan.highlight}</p>
                </div>
              )}

              {plan.valueLine && (
                <p className="mt-2 text-xs text-slate-500 italic">{plan.valueLine}</p>
              )}

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
          Credit packs also available — 5 projects for $7 or 10 for $12. No subscription required.
        </p>
      </Container>
    </section>
  );
}
