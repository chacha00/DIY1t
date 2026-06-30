"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<Pick<Profile, "role">>();

  if (profile?.role !== "admin" && profile?.role !== "moderator") {
    throw new Error("Forbidden");
  }

  return supabase;
}

export async function toggleUserSuspension(userId: string, suspend: boolean) {
  const supabase = await requireAdmin();

  await (supabase as unknown as SupabaseClient)
    .from("profiles")
    .update({ is_suspended: suspend })
    .eq("id", userId);

  revalidatePath("/admin/users");
}
