import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { generateDiyProject } from "@/lib/openai";
import { BUDGET_OPTIONS, SKILL_LEVELS, TIME_AVAILABLE_OPTIONS } from "@/lib/constants/project-options";
import type { Profile, Project, Subscription } from "@/types/database";

export const maxDuration = 300;

const MAX_BATCH = 5;

function labelFor(options: readonly { label: string; value: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

function insertRow(supabase: SupabaseClient, table: string, payload: Record<string, unknown>) {
  return supabase.from(table).insert(payload);
}

function toCents(val: number | null | undefined, cap = 1500000): number | null {
  if (val == null || isNaN(val)) return null;
  const cents = val < 150 ? Math.round(val * 100) : Math.round(val);
  return Math.min(cents, cap);
}

function materialToCents(val: number | null | undefined): number | null {
  return toCents(val, 15000);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Batch generation is a Maker Pro (annual_unlimited) exclusive feature.
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  if (subscription?.plan !== "annual_unlimited") {
    return NextResponse.json(
      { error: "Batch generation requires a Maker Pro subscription." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { images, buildType, budget, skillLevel, preferredMaterials, timeAvailable, petId } = body as {
    images: { imageId: string; imageUrl: string }[];
    buildType: string;
    budget: string;
    skillLevel: string;
    preferredMaterials: string;
    timeAvailable: string;
    petId?: string;
  };

  if (!images?.length || !buildType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (images.length > MAX_BATCH) {
    return NextResponse.json({ error: `Maximum ${MAX_BATCH} images per batch` }, { status: 400 });
  }

  // Pet context
  let petContext: string | undefined;
  if (petId) {
    const { data: pet } = await supabase
      .from("pets")
      .select("name, species, breed, weight_lbs, neck_measurement_in, chest_measurement_in")
      .eq("id", petId)
      .eq("user_id", user.id)
      .maybeSingle<{ name: string; species: string; breed: string | null; weight_lbs: number | null; neck_measurement_in: number | null; chest_measurement_in: number | null }>();
    if (pet) {
      petContext = `${pet.name}, a ${pet.breed ?? pet.species}, weight ${pet.weight_lbs ?? "unknown"} lbs, neck ${pet.neck_measurement_in ?? "unknown"}in, chest ${pet.chest_measurement_in ?? "unknown"}in.`;
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance, full_name")
    .eq("id", user.id)
    .single<Pick<Profile, "credits_balance" | "full_name">>();

  const svc = createServiceRoleClient() as unknown as SupabaseClient;

  const results: { imageId: string; projectId?: string; error?: string }[] = [];

  // Generate sequentially to avoid hammering OpenAI rate limits
  for (const { imageId, imageUrl } of images) {
    try {
      const generated = await generateDiyProject({
        imageUrl,
        buildType,
        budgetLabel: labelFor(BUDGET_OPTIONS, budget),
        skillLevel: labelFor(SKILL_LEVELS, skillLevel),
        preferredMaterials: preferredMaterials || "No preference",
        timeAvailableLabel: labelFor(TIME_AVAILABLE_OPTIONS, timeAvailable),
        petContext,
      });

      // Normalize cents
      generated.estimated_cost_cents = toCents(generated.estimated_cost_cents) ?? 0;
      generated.retail_price_cents = toCents(generated.retail_price_cents) ?? 0;
      generated.money_saved_cents = toCents(generated.money_saved_cents) ?? 0;
      generated.materials = (generated.materials ?? []).map(m => ({
        ...m,
        cost_cents: materialToCents(m.cost_cents) ?? 0,
        alt_options: (m.alt_options ?? []).map(a => ({ ...a, cost_cents: materialToCents(a.cost_cents) ?? 0 })),
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generated.measurements = (generated.measurements ?? []).map((m: any) => ({
        ...m,
        category: m.category ?? "other",
      }));

      const projectPayload = {
        user_id: user.id,
        pet_id: petId || null,
        title: generated.title,
        build_type: buildType,
        status: "complete",
        difficulty: generated.difficulty,
        source_image_id: imageId,
        preview_image_id: null,
        budget_cents: null,
        skill_level: skillLevel,
        preferred_materials: preferredMaterials,
        time_available: timeAvailable,
        assembly_overview: generated.assembly_overview ?? null,
        size_chart: generated.size_chart ?? [],
        estimated_cost_cents: generated.estimated_cost_cents,
        estimated_time_minutes: generated.estimated_time_minutes,
        retail_price_cents: generated.retail_price_cents,
        money_saved_cents: generated.money_saved_cents,
        materials: generated.materials,
        tools: generated.tools,
        steps: generated.steps,
        safety_warnings: generated.safety_warnings,
        pattern_pieces: generated.pattern_pieces ?? [],
        measurements: generated.measurements ?? [],
        diy_score: generated.diy_score,
        tags: generated.tags,
        ai_model: "gpt-4o",
        ai_generation_meta: {
          construction_notes: generated.construction_notes ?? null,
          design_improvements: generated.design_improvements ?? [],
          cost_tiers: generated.cost_tiers ?? [],
          variants: generated.variants ?? [],
          fabric_requirements: generated.fabric_requirements ?? [],
          fit_checklist: generated.fit_checklist ?? [],
          beginner_tips: generated.beginner_tips ?? [],
          abbreviations: generated.abbreviations ?? [],
          finishing_recommendations: generated.finishing_recommendations ?? [],
          maintenance_guide: generated.maintenance_guide ?? [],
          repair_guide: generated.repair_guide ?? [],
        },
      };

      const { data: project, error: projectError } = await insertRow(supabase, "projects", projectPayload)
        .select("id")
        .single<Pick<Project, "id">>();

      if (projectError || !project) {
        results.push({ imageId, error: "Failed to save project" });
        continue;
      }

      // Update rollup stats
      await svc.rpc("increment_profile_stats", {
        p_user_id: user.id,
        p_money_saved_cents: generated.money_saved_cents,
      });

      results.push({ imageId, projectId: project.id });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ imageId, error: msg });
    }
  }

  const succeeded = results.filter(r => r.projectId);
  const failed = results.filter(r => r.error);

  return NextResponse.json({
    results,
    summary: { total: images.length, succeeded: succeeded.length, failed: failed.length },
    projectIds: succeeded.map(r => r.projectId),
  });
}
