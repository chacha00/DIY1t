import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  // Top up credits
  const svc = createServiceRoleClient() as unknown as SupabaseClient;
  await svc.from("profiles").update({ credits_balance: 50 }).eq("id", user.id);

  // Get last project - select all columns
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return new Response(`ERROR: ${error.message}`, { status: 500, headers: { "Content-Type": "text/plain" } });
  if (!data) return new Response("No projects found yet", { status: 200, headers: { "Content-Type": "text/plain" } });

  const summary = `
CREDITS: topped up to 50

PROJECT: ${data.title}
estimated_cost_cents: ${data.estimated_cost_cents}
retail_price_cents: ${data.retail_price_cents}
money_saved_cents: ${data.money_saved_cents}
diy_score keys: ${Object.keys(data.diy_score ?? {}).join(", ") || "EMPTY {}"}
measurements count: ${(data.measurements ?? []).length}
materials count: ${(data.materials ?? []).length}
assembly_overview: ${data.assembly_overview ? "present" : "NULL/MISSING"}
size_chart count: ${(data.size_chart ?? []).length}

FULL diy_score: ${JSON.stringify(data.diy_score)}
FIRST material: ${JSON.stringify((data.materials ?? [])[0])}
FIRST measurement: ${JSON.stringify((data.measurements ?? [])[0])}
`.trim();

  return new Response(summary, { status: 200, headers: { "Content-Type": "text/plain" } });
}
