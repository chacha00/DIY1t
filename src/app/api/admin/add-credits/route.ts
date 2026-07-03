import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = createServiceRoleClient() as unknown as SupabaseClient;
  const { data, error } = await svc
    .from("profiles")
    .update({ credits_balance: 50 })
    .eq("id", user.id)
    .select("credits_balance")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ credits_balance: data.credits_balance });
}
