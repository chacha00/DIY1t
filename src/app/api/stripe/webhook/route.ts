import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/constants/billing-plans";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/database";
import { sendReceiptEmail } from "@/lib/email";

function planForPriceId(priceId: string | null | undefined) {
  if (!priceId) return null;
  return PLANS.find((p) => process.env[p.priceEnvVar] === priceId) ?? null;
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "trialing":
      return "trialing";
    case "incomplete":
    case "incomplete_expired":
      return "incomplete";
    default:
      return "canceled";
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature/secret" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Routed as an untyped client: chaining several differently-shaped
  // .insert()/.update()/.upsert() calls in one function defeats TS's
  // overload resolution for Supabase's generated Database generic.
  const supabase = createServiceRoleClient() as unknown as SupabaseClient;

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const planId = session.metadata?.plan_id;
      if (!userId) break;

      const plan = PLANS.find((p) => p.id === planId);

      // One-time credit pack purchase.
      if (session.mode === "payment" && plan?.creditsGranted) {
        await supabase.from("payments").insert({
          user_id: userId,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          kind: "credit_pack",
          status: "succeeded",
          amount_cents: session.amount_total ?? 0,
          credits_granted: plan.creditsGranted,
          description: plan.name,
        });

        await supabase.from("credit_transactions").insert({
          user_id: userId,
          amount: plan.creditsGranted,
          reason: "purchase",
        });
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id;
      const plan = planForPriceId(priceId);
      const planEnumValue: SubscriptionPlan = (plan?.id as SubscriptionPlan) ?? "free";

      const item = subscription.items.data[0];

      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id:
            typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
          stripe_subscription_id: subscription.id,
          plan: planEnumValue,
          status: mapStripeStatus(subscription.status),
          current_period_start: item ? new Date(item.current_period_start * 1000).toISOString() : null,
          current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
        },
        { onConflict: "stripe_subscription_id" }
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (!customerId) break;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("stripe_customer_id", customerId)
        .maybeSingle<{ id: string; full_name: string | null; email: string | null }>();
      if (!profile) break;

      await supabase.from("payments").insert({
        user_id: profile.id,
        stripe_invoice_id: invoice.id,
        kind: "subscription",
        status: "succeeded",
        amount_cents: invoice.amount_paid,
        description: "Subscription renewal",
      });

      // Send receipt email
      if (profile.email) {
        const firstName = profile.full_name?.split(" ")[0] || "there";
        const planName = invoice.lines?.data?.[0]?.description ?? "DIY1T Subscription";
        sendReceiptEmail(
          profile.email,
          firstName,
          planName,
          invoice.amount_paid,
          invoice.id,
          new Date(invoice.created * 1000)
        ).catch(() => {});
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
