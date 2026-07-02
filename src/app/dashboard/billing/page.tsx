import { Coins, CreditCard, Receipt, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { PLANS } from "@/lib/constants/billing-plans";
import type { Profile, Subscription, Payment } from "@/types/database";

const PLAN_LABELS: Record<string, string> = {
  free: "Free Plan (3 uploads/month)",
  monthly_unlimited: "DIY+ — $9.99/month",
  annual_unlimited: "Maker Pro — $24.99/month",
};

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }, { data: payments }] = await Promise.all([
    supabase
      .from("profiles")
      .select("credits_balance, stripe_customer_id")
      .eq("id", user!.id)
      .single<Pick<Profile, "credits_balance" | "stripe_customer_id">>(),
    supabase
      .from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user!.id)
      .eq("status", "active")
      .maybeSingle<Pick<Subscription, "plan" | "status" | "current_period_end" | "cancel_at_period_end">>(),
    supabase
      .from("payments")
      .select("id, kind, status, amount_cents, description, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<Pick<Payment, "id" | "kind" | "status" | "amount_cents" | "description" | "created_at">[]>(),
  ]);

  const planLabel = PLAN_LABELS[subscription?.plan ?? "free"];
  const subscriptionPlans = PLANS.filter((p) => p.mode === "subscription");
  const creditPacks = PLANS.filter((p) => p.mode === "payment");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Billing</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your plan, credits, and payment history.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-50">
              <Crown className="h-6 w-6 text-brand-blue-500" />
            </span>
            <div>
              <p className="text-base font-bold text-slate-900">{planLabel}</p>
              {subscription?.current_period_end && (
                <p className="text-xs text-slate-400">
                  {subscription.cancel_at_period_end ? "Cancels" : "Renews"} on{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand-orange-600">
                <Coins className="h-3.5 w-3.5" />
                {profile?.credits_balance ?? 0} credits remaining
              </p>
            </div>
          </div>
          {profile?.stripe_customer_id && <ManageSubscriptionButton />}
        </div>
      </Card>

      <div>
        <h2 className="text-base font-bold text-slate-900">Upgrade Your Plan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {subscriptionPlans.map((plan) => (
            <Card key={plan.id} className="p-5">
              <p className="text-sm font-bold text-slate-900">{plan.name}</p>
              <p className="mt-1 text-xs text-slate-400">{plan.description}</p>
              <p className="mt-3 text-2xl font-extrabold text-slate-900">
                {plan.priceLabel}
                <span className="text-sm font-medium text-slate-400"> {plan.periodLabel}</span>
              </p>
              <CheckoutButton planId={plan.id} className="mt-4 w-full">
                Subscribe
              </CheckoutButton>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">Buy Credits</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {creditPacks.map((plan) => (
            <Card key={plan.id} className="p-5 text-center">
              <p className="text-sm font-bold text-slate-900">{plan.name}</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{plan.priceLabel}</p>
              <CheckoutButton planId={plan.id} variant="outline" className="mt-4 w-full">
                Buy Now
              </CheckoutButton>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Receipt className="h-4.5 w-4.5 text-slate-400" />
          Purchase History
        </h2>
        <Card className="mt-4 divide-y divide-slate-100 p-2">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {payment.description ?? payment.kind}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={payment.status === "succeeded" ? "teal" : "slate"}>{payment.status}</Badge>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatCents(payment.amount_cents)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <CreditCard className="h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-400">No purchases yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
