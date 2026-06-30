"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function toggleLike(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to like a project.");

  const db = supabase as unknown as SupabaseClient;

  const { data: existing } = await db
    .from("project_likes")
    .select("project_id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await db.from("project_likes").delete().eq("project_id", projectId).eq("user_id", user.id);
  } else {
    await db.from("project_likes").insert({ project_id: projectId, user_id: user.id });
  }

  revalidatePath(`/community/${projectId}`);
}

export async function addComment(projectId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to comment.");

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const db = supabase as unknown as SupabaseClient;
  await db.from("project_comments").insert({ project_id: projectId, user_id: user.id, body });

  revalidatePath(`/community/${projectId}`);
}

export async function togglePublish(projectId: string, isPublic: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const db = supabase as unknown as SupabaseClient;
  await db.from("projects").update({ is_public: isPublic }).eq("id", projectId).eq("user_id", user.id);

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/community/${projectId}`);
  revalidatePath("/community");
}
