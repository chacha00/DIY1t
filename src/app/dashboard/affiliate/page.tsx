import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AffiliateDashboard } from "@/components/affiliate/AffiliateDashboard";
import type { Subscription } from "@/types/database";

export default async function AffiliatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  if (subscription?.plan !== "annual_unlimited") {
    redirect("/pricing?feature=affiliate");
  }

  const svc = createServiceRoleClient() as unknown as SupabaseClient;

  // Get or create referral code
  const { data: codeRow } = await svc
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id)
    .maybeSingle<{ code: string }>();

  let code = codeRow?.code ?? null;
  if (!code) {
    const { data: generated } = await svc.rpc("get_or_create_referral_code", { p_user_id: user.id });
    code = generated as string;
  }

  // Stats
  const { data: stats } = await svc
    .from("referral_stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<{
      total_clicks: number;
      total_signups: number;
      total_conversions: number;
      total_earned_cents: number;
      pending_cents: number;
      this_month_cents: number;
      this_month_conversions: number;
    }>();

  // Recent referrals
  const { data: recent } = await svc
    .from("referrals")
    .select("id, clicked_at, signed_up_at, converted_at, plan, commission_cents, paid_at")
    .eq("referrer_id", user.id)
    .order("clicked_at", { ascending: false })
    .limit(20)
    .returns<{
      id: string;
      clicked_at: string;
      signed_up_at: string | null;
      converted_at: string | null;
      plan: string | null;
      commission_cents: number | null;
      paid_at: string | null;
    }[]>();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-4xl space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Affiliate earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your link and earn 20–30% commission on every subscriber you refer.
        </p>
      </div>
      <div className="pt-4">
        <AffiliateDashboard
          code={code ?? ""}
          referralUrl={`${appUrl}/r/${code}`}
          stats={stats ?? {
            total_clicks: 0, total_signups: 0, total_conversions: 0,
            total_earned_cents: 0, pending_cents: 0,
            this_month_cents: 0, this_month_conversions: 0,
          }}
          recent={recent ?? []}
        />
      </div>
    </div>
  );
}
