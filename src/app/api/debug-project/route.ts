import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Not logged in", { status: 401 });

  const svc = createServiceRoleClient() as unknown as SupabaseClient;
  await svc.from("profiles").update({ credits_balance: 50 }).eq("id", user.id);

  const { data, error } = await (supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle() as Promise<{ data: AnyRow | null; error: { message: string } | null }>);

  if (error) return new Response(`ERROR: ${error.message}`, { headers: { "Content-Type": "text/plain" } });
  if (!data) return new Response("No projects found yet", { headers: { "Content-Type": "text/plain" } });

  const diy = data.diy_score ?? {};
  const mats: AnyRow[] = data.materials ?? [];
  const meas: AnyRow[] = data.measurements ?? [];
  const sc: AnyRow[] = data.size_chart ?? [];

  const out = [
    `CREDITS: topped up to 50`,
    `PROJECT: ${data.title}`,
    `estimated_cost_cents: ${data.estimated_cost_cents}`,
    `retail_price_cents: ${data.retail_price_cents}`,
    `money_saved_cents: ${data.money_saved_cents}`,
    `diy_score keys: ${Object.keys(diy).join(", ") || "EMPTY"}`,
    `measurements count: ${meas.length}`,
    `materials count: ${mats.length}`,
    `size_chart count: ${sc.length}`,
    `assembly_overview: ${data.assembly_overview ? "present" : "NULL"}`,
    ``,
    `diy_score: ${JSON.stringify(diy)}`,
    `first material: ${JSON.stringify(mats[0])}`,
    `first measurement: ${JSON.stringify(meas[0])}`,
  ].join("\n");

  return new Response(out, { headers: { "Content-Type": "text/plain" } });
}
