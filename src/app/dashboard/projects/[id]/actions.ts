"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavorite(projectId: string, isFavorite: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("projects")
    .update({ is_favorite: isFavorite })
    .eq("id", projectId)
    .eq("user_id", user.id);

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
}
