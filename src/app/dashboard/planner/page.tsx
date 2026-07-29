import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlannerHub } from "@/components/planner/PlannerHub";
import type { FabricStashItem, MakerShoppingListItem, PlannerEntry, Project, Subscription } from "@/types/database";

export default async function PlannerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  const isPaidPlan = subscription?.plan === "monthly_unlimited" || subscription?.plan === "annual_unlimited";
  if (!isPaidPlan) {
    redirect("/pricing?feature=planner");
  }

  const [{ data: fabricStash }, { data: shoppingList }, { data: plannerEntries }, { data: projects }] = await Promise.all([
    supabase.from("fabric_stash").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).returns<FabricStashItem[]>(),
    supabase.from("maker_shopping_list_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).returns<MakerShoppingListItem[]>(),
    supabase.from("planner_entries").select("*").eq("user_id", user.id).order("entry_date", { ascending: true }).returns<PlannerEntry[]>(),
    supabase.from("projects").select("id, title").eq("user_id", user.id).order("created_at", { ascending: false }).returns<Pick<Project, "id" | "title">[]>(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Maker&apos;s Planner</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track your fabric stash, shopping list, and project planning — plus quick reference guides for beginners.
        </p>
      </div>

      <PlannerHub
        fabricStash={fabricStash ?? []}
        shoppingList={shoppingList ?? []}
        plannerEntries={plannerEntries ?? []}
        projects={(projects ?? []).map((p) => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
