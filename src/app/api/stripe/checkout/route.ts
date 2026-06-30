import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { PLANS, type PlanId } from "@/lib/constants/billing-plans";
import type { Profile } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planId } = (await request.json()) as { planId: PlanId };
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  const priceId = process.env[plan.priceEnvVar];
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price not configured for ${plan.id} (missing ${plan.priceEnvVar})` },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", user.id)
    .single<Pick<Profile, "stripe_customer_id" | "email">>();

  let customerId = profile?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await (supabase as unknown as SupabaseClient)
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: plan.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { supabase_user_id: user.id, plan_id: plan.id },
    subscription_data:
      plan.mode === "subscription" ? { metadata: { supabase_user_id: user.id, plan_id: plan.id } } : undefined,
  });

  return NextResponse.json({ url: session.url });
}
