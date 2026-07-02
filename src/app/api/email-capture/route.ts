import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

async function addToMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !server) return;

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      tags: ["landing-page", "free-pdf"],
    }),
  });
  // We intentionally ignore errors here — if they're already subscribed Mailchimp
  // returns 400, which is fine. Supabase still captures the lead.
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Save to Supabase
    const svc = createServiceRoleClient();
    const payload: { email: string; source: string } = { email: cleanEmail, source: "landing_page" };
    await (svc as unknown as import("@supabase/supabase-js").SupabaseClient)
      .from("email_leads")
      .upsert(payload, { onConflict: "email" });

    // Add to Mailchimp (fire-and-forget, non-blocking)
    await addToMailchimp(cleanEmail);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
