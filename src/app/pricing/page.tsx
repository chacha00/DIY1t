import { Check, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { PLANS } from "@/lib/constants/billing-plans";

const FREE_FEATURES = [
  "3 uploads per month",
  "Pattern pieces + measurements",
  "Step-by-step instructions",
  "PDF download",
  "1 pet profile",
];

export default function PricingPage() {
  const subscriptionPlans = PLANS.filter((p) => p.mode === "subscription");
  const creditPacks = PLANS.filter((p) => p.mode === "payment");

  return (
    <>
      <Header />
      <main className="flex-1 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Plans for every maker"
            description="Start free with 3 uploads per month — no credit card required."
          />

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
            {/* Free plan */}
            <Card className="p-8">
              <h3 className="text-lg font-bold text-slate-900">Free</h3>
              <p className="text-xs text-slate-400">Try it out — no card needed</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
                <span className="text-sm text-slate-400">/ month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <LinkButton href="/register" variant="outline" className="mt-8 w-full">
                Start Free
              </LinkButton>
            </Card>

            {/* DIY+ — featured */}
            <Card className="relative border-2 border-brand-blue-500 p-8 shadow-soft-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge color="orange">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{subscriptionPlans[0].name}</h3>
              <p className="text-xs text-slate-400">{subscriptionPlans[0].description}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{subscriptionPlans[0].priceLabel}</span>
                <span className="text-sm text-slate-400">{subscriptionPlans[0].periodLabel}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {subscriptionPlans[0].features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton planId={subscriptionPlans[0].id} className="mt-8 w-full">
                Start DIY+
              </CheckoutButton>
            </Card>

            {/* Maker Pro */}
            <Card className="p-8">
              <h3 className="text-lg font-bold text-slate-900">{subscriptionPlans[1].name}</h3>
              <p className="text-xs text-slate-400">{subscriptionPlans[1].description}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{subscriptionPlans[1].priceLabel}</span>
                <span className="text-sm text-slate-400">{subscriptionPlans[1].periodLabel}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {subscriptionPlans[1].features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 shrink-0 text-brand-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton planId={subscriptionPlans[1].id} className="mt-8 w-full">
                Go Pro
              </CheckoutButton>
            </Card>
          </div>

          {/* Credit packs */}
          <div className="mx-auto mt-20 max-w-5xl">
            <SectionHeading eyebrow="Pay As You Go" title="Or buy credits — no subscription" align="center" />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {creditPacks.map((plan) => (
                <Card key={plan.id} className="p-6 text-center">
                  <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">{plan.priceLabel}</p>
                  <p className="mt-1 text-xs text-slate-400">{plan.description}</p>
                  <CheckoutButton planId={plan.id} variant="outline" className="mt-5 w-full">
                    Buy Now
                  </CheckoutButton>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ note */}
          <p className="mt-16 text-center text-xs text-slate-400">
            Free plan resets to 3 uploads on the 1st of every month. Unused free uploads do not roll over.
            Paid plans can be cancelled anytime from your billing dashboard.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
