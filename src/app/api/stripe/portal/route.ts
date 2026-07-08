import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import type { Profile } from "@/types/database";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single<Pick<Profile, "stripe_customer_id">>();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found yet" }, { status: 400 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Portal configuration: create once, update on every session to keep URLs current.
  const portalFeatures = {
    customer_update: {
      enabled: true,
      allowed_updates: ["email", "name"] as ("email" | "name")[],
    },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: {
      enabled: true,
      mode: "at_period_end" as const,
      cancellation_reason: {
        enabled: true,
        options: ["too_expensive", "missing_features", "switched_service", "unused", "other"] as (
          | "too_expensive"
          | "missing_features"
          | "switched_service"
          | "unused"
          | "other"
        )[],
      },
    },
    subscription_update: { enabled: false, default_allowed_updates: [] as never[], proration_behavior: "none" as const },
  };

  const portalBusinessProfile = {
    privacy_policy_url: `${appUrl}/privacy`,
    terms_of_service_url: `${appUrl}/terms`,
  };

  let configurationId = process.env.STRIPE_PORTAL_CONFIGURATION_ID as string | undefined;

  if (configurationId) {
    await stripe.billingPortal.configurations.update(configurationId, {
      business_profile: portalBusinessProfile,
      default_return_url: `${appUrl}/dashboard/billing`,
      features: portalFeatures,
    });
  } else {
    // Check for an existing active configuration before creating a new one.
    const existing = await stripe.billingPortal.configurations.list({ active: true, limit: 1 });
    if (existing.data.length > 0) {
      configurationId = existing.data[0].id;
      await stripe.billingPortal.configurations.update(configurationId, {
        business_profile: portalBusinessProfile,
        default_return_url: `${appUrl}/dashboard/billing`,
        features: portalFeatures,
      });
      console.info(`[stripe] Reusing portal configuration ${configurationId} — set STRIPE_PORTAL_CONFIGURATION_ID in .env.local to skip this lookup`);
    } else {
      const config = await stripe.billingPortal.configurations.create({
        name: "DIY1T Portal",
        business_profile: portalBusinessProfile,
        default_return_url: `${appUrl}/dashboard/billing`,
        features: portalFeatures,
      });
      configurationId = config.id;
      console.info(`[stripe] Created portal configuration ${configurationId} — set STRIPE_PORTAL_CONFIGURATION_ID in .env.local to reuse it`);
    }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    configuration: configurationId,
    return_url: `${appUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
