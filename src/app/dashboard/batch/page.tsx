import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BatchGenerateWizard } from "@/components/projects/BatchGenerateWizard";
import type { Pet, Subscription } from "@/types/database";

export default async function BatchGeneratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  if (subscription?.plan !== "annual_unlimited") {
    redirect("/pricing?feature=batch");
  }

  const { data: pets } = await supabase
    .from("pets")
    .select("id, name, species")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Pick<Pet, "id" | "name" | "species">[]>();

  return (
    <div className="mx-auto max-w-4xl space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Batch Generate</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload up to 5 photos and get a full DIY plan for each — all at once.
        </p>
      </div>
      <div className="pt-4">
        <BatchGenerateWizard pets={pets ?? []} />
      </div>
    </div>
  );
}
