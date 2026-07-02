import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const svc = createServiceRoleClient();
    // Upsert so duplicate signups don't error
    const payload: { email: string; source: string } = { email: email.toLowerCase().trim(), source: "landing_page" };
    await (svc as unknown as import("@supabase/supabase-js").SupabaseClient)
      .from("email_leads")
      .upsert(payload, { onConflict: "email" });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
