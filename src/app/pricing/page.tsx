import { Check, Sparkles, TrendingDown, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { PLANS } from "@/lib/constants/billing-plans";

// Savings math per plan
const PLAN_SAVINGS = {
  free: {
    savingsLabel: "Saved $141",
    savingsNote: "3 projects × avg $47 savings",
    breakeven: null,
    accent: "text-ds-emerald-600",
    bg: "bg-ds-emerald-50",
  },
  monthly_unlimited: {
    savingsLabel: "Saved $564",
    savingsNote: "Per year — 12 projects × avg $47",
    breakeven: "Break even after your very first project",
    accent: "text-ds-emerald-600",
    bg: "bg-ds-emerald-50",
  },
  annual_unlimited: {
    savingsLabel: "Saved $2,820",
    savingsNote: "60 projects × avg $47 — plus what you sell",
    breakeven: "Pays for itself the day you list your first pattern",
    accent: "text-yellow-600",
    bg: "bg-yellow-50",
  },
};

const FREE_FEATURES = [
  "3 complete DIY plans per month",
  "Printable patterns sized to your pet",
  "Full materials list with cost estimates",
  "Step-by-step build instructions",
  "Downloadable PDF guide",
];

export default function PricingPage() {
  const subscriptionPlans = PLANS.filter((p) => p.mode === "subscription" && p.id !== "free");

  return (
    <>
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-ds-emerald-50 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">
          <Container>
            <div className="inline-flex items-center gap-2 rounded-full border border-ds-emerald-200 bg-ds-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ds-emerald-700 mb-5">
              <TrendingDown className="h-3.5 w-3.5" />
              Stop Paying Retail
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              How much will you save?
            </h1>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
              DIY1T members save an average of <strong className="text-slate-700">$47 per project</strong> vs. buying retail.
              Most recoup their subscription cost on the very first build.
            </p>

            {/* Social proof strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span><strong className="text-slate-700">$184,000+</strong> saved by members</span>
              <span className="h-4 w-px bg-slate-200" />
              <span><strong className="text-slate-700">12,000+</strong> projects built</span>
              <span className="h-4 w-px bg-slate-200" />
              <span><strong className="text-slate-700">79%</strong> average cost reduction</span>
            </div>
          </Container>
        </div>

        {/* Plans */}
        <div className="py-16 sm:py-20 bg-white">
          <Container>
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">

              {/* Free */}
              <Card className="flex flex-col p-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Free</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Try it — no card needed</p>
                </div>

                {/* Savings hero */}
                <div className="mt-5 rounded-2xl bg-ds-emerald-50 px-5 py-4">
                  <p className="text-3xl font-extrabold text-ds-emerald-700">Saved $141</p>
                  <p className="text-xs text-ds-emerald-600 mt-1">3 projects × avg $47 savings</p>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ds-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <LinkButton href="/register" variant="outline" className="mt-8 w-full">
                  Start Free
                </LinkButton>
              </Card>

              {/* DIY+ — featured */}
              <Card className="relative flex flex-col border-2 border-brand-blue-500 p-8 shadow-soft-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge color="orange">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{subscriptionPlans[0].name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{subscriptionPlans[0].description}</p>
                </div>

                {/* Savings hero */}
                <div className="mt-5 rounded-2xl bg-ds-emerald-50 px-5 py-4">
                  <p className="text-3xl font-extrabold text-ds-emerald-700">Saved $564</p>
                  <p className="text-xs text-ds-emerald-600 mt-1">Per year — 12 projects × avg $47</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-ds-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-ds-emerald-500" />
                    Break even after your very first project
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{subscriptionPlans[0].priceLabel}</span>
                  <span className="text-sm text-slate-400">{subscriptionPlans[0].periodLabel}</span>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {subscriptionPlans[0].features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ds-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <CheckoutButton planId={subscriptionPlans[0].id} className="mt-8 w-full">
                  Start DIY+
                </CheckoutButton>

                <p className="mt-3 text-center text-[11px] text-slate-400">
                  Cancel anytime · No contracts
                </p>
              </Card>

              {/* Maker Pro */}
              <Card className="flex flex-col p-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{subscriptionPlans[1].name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{subscriptionPlans[1].description}</p>
                </div>

                {/* Savings hero */}
                <div className="mt-5 rounded-2xl bg-yellow-50 px-5 py-4">
                  <p className="text-3xl font-extrabold text-yellow-700">Saved $2,820+</p>
                  <p className="text-xs text-yellow-600 mt-1">60 projects/yr × avg $47 — plus pattern sales</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-yellow-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    Pays for itself the day you sell your first pattern
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{subscriptionPlans[1].priceLabel}</span>
                  <span className="text-sm text-slate-400">{subscriptionPlans[1].periodLabel}</span>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {subscriptionPlans[1].features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ds-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <CheckoutButton planId={subscriptionPlans[1].id} className="mt-8 w-full">
                  Go Pro
                </CheckoutButton>

                <p className="mt-3 text-center text-[11px] text-slate-400">
                  Cancel anytime · No contracts
                </p>
              </Card>
            </div>

            {/* Bottom note */}
            <p className="mt-12 text-center text-xs text-slate-400">
              Free plan resets to 3 projects on the 1st of every month.
              Paid plans cancel anytime from your billing dashboard.
            </p>
          </Container>
        </div>

        {/* Savings proof strip */}
        <div className="bg-slate-50 py-14">
          <Container>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Real savings from real projects</p>
            <div className="mx-auto max-w-4xl grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { product: "Dog Harness", retail: "$65", diy: "$14", saved: "$51" },
                { product: "Pet Bed", retail: "$95", diy: "$22", saved: "$73" },
                { product: "Cat Sweater", retail: "$42", diy: "$9", saved: "$33" },
                { product: "Leash & Collar", retail: "$38", diy: "$8", saved: "$30" },
              ].map(({ product, retail, diy, saved }) => (
                <div key={product} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-soft">
                  <p className="text-xs font-semibold text-slate-500 mb-3">{product}</p>
                  <p className="text-2xl font-extrabold text-ds-emerald-600">Saved {saved}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="line-through">{retail}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="font-semibold text-slate-700">{diy} DIY</span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>

      </main>
      <Footer />
    </>
  );
}
