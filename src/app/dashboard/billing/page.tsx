import { CreditCard, Receipt, Crown, CheckCircle2, Zap, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { PLANS } from "@/lib/constants/billing-plans";
import type { Profile, Subscription, Payment } from "@/types/database";

const PLAN_META: Record<string, { label: string; color: string; icon: typeof Crown }> = {
  free:               { label: "Free Plan",   color: "text-slate-500",        icon: Star },
  monthly_unlimited:  { label: "DIY+",        color: "text-brand-blue-600",   icon: Zap },
  annual_unlimited:   { label: "Maker Pro",   color: "text-brand-orange-500", icon: Crown },
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }, { data: payments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user!.id)
      .single<Pick<Profile, "stripe_customer_id">>(),
    supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user!.id)
      .eq("status", "active")
      .maybeSingle<Pick<Subscription, "plan" | "status" | "current_period_end" | "cancel_at_period_end">>(),
    supabase
      .from("payments")
      .select("id, kind, status, amount_cents, description, created_at, stripe_invoice_id")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<Pick<Payment, "id" | "kind" | "status" | "amount_cents" | "description" | "created_at" | "stripe_invoice_id">[]>(),
  ]);

  const currentPlan = subscription?.plan ?? "free";
  const meta = PLAN_META[currentPlan];
  const PlanIcon = meta.icon;
  const isSubscribed = currentPlan !== "free";
  const subscriptionPlans = PLANS.filter((p) => p.mode === "subscription");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Subscription & Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your plan, payment method, and billing history.</p>
      </div>

      {/* Current plan card */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Plan</p>
        </div>
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 ${meta.color}`}>
              <PlanIcon className="h-7 w-7" />
            </span>
            <div>
              <p className={`text-xl font-extrabold ${meta.color}`}>{meta.label}</p>
              {isSubscribed && subscription?.current_period_end ? (
                <p className="mt-0.5 text-sm text-slate-500">
                  {subscription.cancel_at_period_end
                    ? `Cancels on ${formatDate(subscription.current_period_end)}`
                    : `Renews on ${formatDate(subscription.current_period_end)}`}
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-slate-500">3 projects per month · Upgrade anytime</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {isSubscribed && profile?.stripe_customer_id ? (
              <ManageSubscriptionButton />
            ) : null}
            {subscription?.cancel_at_period_end && (
              <Badge color="orange">Canceling</Badge>
            )}
            {isSubscribed && !subscription?.cancel_at_period_end && (
              <Badge color="teal">Active</Badge>
            )}
          </div>
        </div>

        {/* What's included */}
        {isSubscribed && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Your plan includes</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(PLANS.find((p) => p.id === currentPlan)?.features ?? []).map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-teal-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Upgrade options — only show plans above current */}
      {(() => {
        const planOrder = ["free", "monthly_unlimited", "annual_unlimited"];
        const currentIndex = planOrder.indexOf(currentPlan);
        const upgradePlans = subscriptionPlans.filter(
          (p) => planOrder.indexOf(p.id) > currentIndex
        );
        if (upgradePlans.length === 0) return null;
        return (
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {currentPlan === "free" ? "Choose a Plan" : "Upgrade Your Plan"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Unlock more features by upgrading.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {upgradePlans.map((plan, i) => (
                <Card key={plan.id} className={`relative p-6 ${i === upgradePlans.length - 1 ? "border-brand-orange-200 bg-brand-orange-50/30" : ""}`}>
                  {i === upgradePlans.length - 1 && upgradePlans.length > 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange-500 px-3 py-0.5 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-slate-900">{plan.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-900">{plan.priceLabel}</p>
                      <p className="text-xs text-slate-400">{plan.periodLabel}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-teal-500" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <CheckoutButton planId={plan.id} className="mt-5 w-full">
                    Upgrade to {plan.name}
                  </CheckoutButton>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Payment method — only shown if subscribed */}
      {isSubscribed && profile?.stripe_customer_id && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-bold text-slate-900">Payment Method</p>
                <p className="text-xs text-slate-400">Update your card or billing details</p>
              </div>
            </div>
            <ManageSubscriptionButton />
          </div>
        </Card>
      )}

      {/* Payment history */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Receipt className="h-4.5 w-4.5 text-slate-400" />
          Billing History
        </h2>
        <Card className="mt-4 divide-y divide-slate-100 p-2">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Receipt className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {payment.description ?? (payment.kind === "subscription" ? "Subscription" : "Purchase")}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(payment.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={payment.status === "succeeded" ? "teal" : "slate"}>
                    {payment.status === "succeeded" ? "Paid" : payment.status}
                  </Badge>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCents(payment.amount_cents)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <Receipt className="h-10 w-10 text-slate-200" />
              <p className="mt-3 text-sm font-semibold text-slate-500">No billing history yet</p>
              <p className="mt-1 text-xs text-slate-400">Your invoices will appear here after your first payment.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
