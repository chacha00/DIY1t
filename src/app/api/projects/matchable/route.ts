import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get user's inventory
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inventory } = await (supabase as any)
    .from("craft_inventory")
    .select("name, category")
    .eq("user_id", user.id);

  if (!inventory?.length) return NextResponse.json({ projects: [], inventoryCount: 0 });

  const inventoryNames = inventory.map((i: { name: string; category: string }) => i.name.toLowerCase());

  // Get user's projects with materials
  type ProjectRow = { id: string; title: string; difficulty: string | null; estimated_cost_cents: number | null; estimated_time_minutes: number | null; materials: unknown; build_type: string | null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: projects } = await (supabase as any)
    .from("projects")
    .select("id, title, difficulty, estimated_cost_cents, estimated_time_minutes, materials, build_type")
    .eq("user_id", user.id)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .returns<ProjectRow[]>();

  if (!projects?.length) return NextResponse.json({ projects: [], inventoryCount: inventory.length });

  // Score each project by how many materials the user already has
  const scored = projects.map((p) => {
    const mats: { name: string }[] = Array.isArray(p.materials) ? p.materials : [];
    if (!mats.length) return null;

    const matched = mats.filter((m) => {
      const mName = m.name.toLowerCase();
      return inventoryNames.some((inv) => {
        // fuzzy: check if any word in inventory name appears in material name or vice versa
        const invWords = inv.split(/\s+/).filter((w) => w.length > 3);
        const mWords = mName.split(/\s+/).filter((w) => w.length > 3);
        return invWords.some((w) => mName.includes(w)) || mWords.some((w) => inv.includes(w));
      });
    });

    const matchPct = Math.round((matched.length / mats.length) * 100);
    return { ...p, matchPct, matchedCount: matched.length, totalMaterials: mats.length };
  }).filter((p): p is NonNullable<typeof p> => p !== null && p.matchPct >= 30);

  scored.sort((a, b) => b.matchPct - a.matchPct);

  return NextResponse.json({ projects: scored.slice(0, 12), inventoryCount: inventory.length });
}
