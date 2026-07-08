import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * GET /r/[code]
 * Logs the referral click and redirects to /register?ref=[code].
 * Sets a 30-day cookie so conversion is attributed even if signup happens later.
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const svc = createServiceRoleClient() as unknown as SupabaseClient;

  // Verify the code exists
  const { data: codeRow } = await svc
    .from("referral_codes")
    .select("user_id, code")
    .eq("code", code)
    .maybeSingle<{ user_id: string; code: string }>();

  if (codeRow) {
    // Log the click as a new referral row (signed_up_at remains null until they register)
    await svc.from("referrals").insert({
      referrer_id: codeRow.user_id,
      code,
    });
  }

  const registerUrl = new URL("/register", appUrl);
  registerUrl.searchParams.set("ref", code);

  const response = NextResponse.redirect(registerUrl.toString());

  // 30-day attribution cookie
  response.cookies.set("diy1t_ref", code, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
