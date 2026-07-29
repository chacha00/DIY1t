"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { FabricStashItem, MakerShoppingListItem, PlannerEntry } from "@/types/database";

const PLANNER_PATH = "/dashboard/planner";

function toCents(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const dollars = Number(value);
  if (isNaN(dollars)) return null;
  return Math.round(dollars * 100);
}

// ── Fabric Stash ──────────────────────────────────────────────────────────

export async function addFabricStashItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload: Partial<FabricStashItem> = {
    user_id: user.id,
    fabric_name: String(formData.get("fabric_name") ?? "").trim(),
    fiber_content: String(formData.get("fiber_content") ?? "").trim() || null,
    color: String(formData.get("color") ?? "").trim() || null,
    yardage: formData.get("yardage") ? Number(formData.get("yardage")) : null,
    width_in: formData.get("width_in") ? Number(formData.get("width_in")) : null,
    cost_cents: toCents(formData.get("cost_dollars")),
    shop: String(formData.get("shop") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  if (!payload.fabric_name) return;

  await (supabase as unknown as SupabaseClient).from("fabric_stash").insert(payload);
  revalidatePath(PLANNER_PATH);
}

export async function deleteFabricStashItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("fabric_stash")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  revalidatePath(PLANNER_PATH);
}

// ── Shopping List ──────────────────────────────────────────────────────────

export async function addShoppingListItem(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload: Partial<MakerShoppingListItem> = {
    user_id: user.id,
    item_name: String(formData.get("item_name") ?? "").trim(),
    shop: String(formData.get("shop") ?? "").trim() || null,
    budget_cents: toCents(formData.get("budget_dollars")),
    price_cents: toCents(formData.get("price_dollars")),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  if (!payload.item_name) return;

  await (supabase as unknown as SupabaseClient).from("maker_shopping_list_items").insert(payload);
  revalidatePath(PLANNER_PATH);
}

export async function deleteShoppingListItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("maker_shopping_list_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  revalidatePath(PLANNER_PATH);
}

export async function toggleShoppingListBought(itemId: string, isBought: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("maker_shopping_list_items")
    .update({ is_bought: isBought })
    .eq("id", itemId)
    .eq("user_id", user.id);

  revalidatePath(PLANNER_PATH);
}

// ── Project Planner ────────────────────────────────────────────────────────

export async function addPlannerEntry(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload: Partial<PlannerEntry> = {
    user_id: user.id,
    project_id: String(formData.get("project_id") ?? "").trim() || null,
    entry_date: String(formData.get("entry_date") ?? "").trim() || new Date().toISOString().slice(0, 10),
    title: String(formData.get("title") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  if (!payload.title) return;

  await (supabase as unknown as SupabaseClient).from("planner_entries").insert(payload);
  revalidatePath(PLANNER_PATH);
}

export async function deletePlannerEntry(entryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("planner_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  revalidatePath(PLANNER_PATH);
}

export async function togglePlannerEntryDone(entryId: string, isDone: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as unknown as SupabaseClient)
    .from("planner_entries")
    .update({ is_done: isDone })
    .eq("id", entryId)
    .eq("user_id", user.id);

  revalidatePath(PLANNER_PATH);
}
