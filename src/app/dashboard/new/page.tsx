import { createClient } from "@/lib/supabase/server";
import { NewProjectWizard } from "@/components/upload/NewProjectWizard";
import type { Pet, Subscription } from "@/types/database";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ vision_product?: string; vision_category?: string }>;
}) {
  const { vision_product, vision_category } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: pets }, { data: subscription }] = await Promise.all([
    supabase
      .from("pets")
      .select("id, name, species")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .returns<Pick<Pet, "id" | "name" | "species">[]>(),
    supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user!.id)
      .eq("status", "active")
      .maybeSingle<Pick<Subscription, "plan">>(),
  ]);

  const hasUnlimited = subscription?.plan === "monthly_unlimited" || subscription?.plan === "annual_unlimited";

  return (
    <div className="mx-auto max-w-3xl space-y-2">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">New DIY Project</h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a photo and let AI generate your build plan.
        </p>
      </div>

      <div className="pt-4">
        <NewProjectWizard
          pets={pets ?? []}
          hasUnlimited={hasUnlimited}
          visionProduct={vision_product}
          visionCategory={vision_category}
        />
      </div>
    </div>
  );
}
