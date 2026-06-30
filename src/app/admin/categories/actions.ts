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

export async function toggleCategoryActive(categoryId: string, isActive: boolean) {
  const supabase = await requireAdmin();
  await (supabase as unknown as SupabaseClient)
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", categoryId);

  revalidatePath("/admin/categories");
}

export async function createCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim();

  if (!name) return;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await (supabase as unknown as SupabaseClient).from("categories").insert({
    name,
    slug,
    emoji: emoji || null,
    is_active: true,
  });

  revalidatePath("/admin/categories");
}
