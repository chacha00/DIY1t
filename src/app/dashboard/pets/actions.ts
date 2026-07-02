"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Pet } from "@/types/database";
import { redirect } from "next/navigation";

export async function addPet(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload: Partial<Pet> = {
    user_id: user.id,
    name: String(formData.get("name") ?? "").trim(),
    species: (formData.get("species") as Pet["species"]) || "dog",
    breed: String(formData.get("breed") ?? "").trim() || null,
    weight_lbs: formData.get("weight_lbs") ? Number(formData.get("weight_lbs")) : null,
    age_years: formData.get("age_years") ? Number(formData.get("age_years")) : null,
    gender: String(formData.get("gender") ?? "").trim() || null,
    neck_measurement_in: formData.get("neck_measurement_in") ? Number(formData.get("neck_measurement_in")) : null,
    chest_measurement_in: formData.get("chest_measurement_in") ? Number(formData.get("chest_measurement_in")) : null,
    back_length_in: formData.get("back_length_in") ? Number(formData.get("back_length_in")) : null,
    leg_length_in: formData.get("leg_length_in") ? Number(formData.get("leg_length_in")) : null,
    special_needs: String(formData.get("special_needs") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  if (!payload.name) return;

  await (supabase as unknown as SupabaseClient).from("pets").insert(payload);
  revalidatePath("/dashboard/pets");
  redirect("/dashboard/pets");
}

export async function deletePet(petId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("pets")
    .delete()
    .eq("id", petId)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/pets");
}
