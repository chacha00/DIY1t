import { createClient } from "@/lib/supabase/server";
import { MaterialsScanner } from "@/components/materials/MaterialsScanner";

export default async function MaterialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inventory } = await (supabase as any)
    .from("craft_inventory")
    .select("id, name, category, color, quantity_estimate, confidence, photo_url, created_at")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return <MaterialsScanner initialInventory={inventory ?? []} />;
}
