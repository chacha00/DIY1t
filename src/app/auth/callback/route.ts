import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      // Attribution: if a referral cookie is present, link this signup to the referrer
      const refCookie = request.headers.get("cookie")
        ?.split(";")
        .map(c => c.trim())
        .find(c => c.startsWith("diy1t_ref="))
        ?.split("=")[1];

      if (refCookie) {
        const svc = createServiceRoleClient() as unknown as SupabaseClient;
        // Update the most recent click row for this code that hasn't been signed up yet
        await svc
          .from("referrals")
          .update({ referred_id: user.id, signed_up_at: new Date().toISOString() })
          .eq("code", refCookie)
          .is("referred_id", null)
          .order("clicked_at", { ascending: false })
          .limit(1);
      }

      const response = NextResponse.redirect(`${origin}${next}`);
      // Clear the referral cookie after attribution
      if (refCookie) {
        response.cookies.set("diy1t_ref", "", { path: "/", maxAge: 0 });
      }
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
