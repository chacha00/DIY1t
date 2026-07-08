import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { generateDiyProject } from "@/lib/openai";
import { sendProjectCompleteEmail, sendThankYouEmail } from "@/lib/email";

export const maxDuration = 300;
import { BUDGET_OPTIONS, SKILL_LEVELS, TIME_AVAILABLE_OPTIONS } from "@/lib/constants/project-options";
import type { Profile, Project, Pet, Subscription, CreditTransaction } from "@/types/database";

function labelFor(options: readonly { label: string; value: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Chaining several differently-typed `.single<T>()` calls on the same Supabase
 * client in one function defeats TypeScript's overload resolution for later
 * `.insert()` calls (resolves to `never[]`). Routing inserts through an
 * untyped client view sidesteps it; the payload itself is still typed via
 * `Partial<Row>` at each call site.
 */
function insertRow(supabase: SupabaseClient, table: string, payload: Record<string, unknown>) {
  return supabase.from(table).insert(payload);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { imageId, imageUrl, buildType, budget, skillLevel, preferredMaterials, timeAvailable, petId } = body as {
    imageId: string;
    imageUrl: string;
    buildType: string;
    budget: string;
    skillLevel: string;
    preferredMaterials: string;
    timeAvailable: string;
    petId?: string;
  };

  if (!imageId || !imageUrl || !buildType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // --- Credit / subscription gate ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", user.id)
    .single<Pick<Profile, "credits_balance">>();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  const hasUnlimitedPlan =
    subscription?.plan === "monthly_unlimited" || subscription?.plan === "annual_unlimited";

  if (!hasUnlimitedPlan && (profile?.credits_balance ?? 0) <= 0) {
    return NextResponse.json(
      { error: "No credits remaining. Upgrade or purchase credits to continue." },
      { status: 402 }
    );
  }

  // --- Pet context (optional) ---
  let petContext: string | undefined;
  if (petId) {
    const { data: pet } = await supabase
      .from("pets")
      .select("name, species, breed, weight_lbs, neck_measurement_in, chest_measurement_in")
      .eq("id", petId)
      .eq("user_id", user.id)
      .maybeSingle<
        Pick<Pet, "name" | "species" | "breed" | "weight_lbs" | "neck_measurement_in" | "chest_measurement_in">
      >();

    if (pet) {
      petContext = `${pet.name}, a ${pet.breed ?? pet.species}, weight ${pet.weight_lbs ?? "unknown"} lbs, neck ${pet.neck_measurement_in ?? "unknown"}in, chest ${pet.chest_measurement_in ?? "unknown"}in.`;
    }
  }

  // --- AI generation ---
  let generated;
  try {
    generated = await generateDiyProject({
      imageUrl,
      buildType,
      budgetLabel: labelFor(BUDGET_OPTIONS, budget),
      skillLevel: labelFor(SKILL_LEVELS, skillLevel),
      preferredMaterials: preferredMaterials || "No preference",
      timeAvailableLabel: labelFor(TIME_AVAILABLE_OPTIONS, timeAvailable),
      petContext,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("AI generation failed", msg);
    return NextResponse.json({ error: `AI generation failed: ${msg}` }, { status: 502 });
  }

  // --- Normalize AI output ---
  // The prompt asks for cents, but the AI occasionally returns dollars (e.g. 8 instead of 800).
  // Heuristic: if the value is a small decimal or whole number under 150, treat as dollars and
  // multiply by 100. Values >= 150 are already cents. Cap individual materials at $150 (15000 cents).
  function toCents(val: number | null | undefined, cap = 1500000): number | null {
    if (val == null || isNaN(val)) return null;
    const cents = val < 150 ? Math.round(val * 100) : Math.round(val);
    return Math.min(cents, cap);
  }
  function materialToCents(val: number | null | undefined): number | null {
    return toCents(val, 15000); // cap single material at $150
  }

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

  // --- Persist the project ---
  // Note: AI preview image generation (gpt-image-1) removed from this synchronous
  // flow — it adds 30–60s and pushes past Vercel's function timeout. Can be added
  // back as a separate async background job once the core generation is stable.
  const previewImageId: string | null = null;
  const projectPayload = {
    user_id: user.id,
    pet_id: petId || null,
    title: generated.title,
    build_type: buildType,
    status: "complete",
    difficulty: generated.difficulty,
    source_image_id: imageId,
    preview_image_id: previewImageId,
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
    console.error("Failed to save project", projectError);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }

  // --- Deduct credit + update rollups (skip credit deduction for unlimited plans) ---
  if (!hasUnlimitedPlan) {
    const creditPayload: Partial<CreditTransaction> = {
      user_id: user.id,
      amount: -1,
      reason: "project_generation",
      related_project_id: project.id,
    };
    // Use service-role client — credit_transactions has no INSERT RLS policy
    // for the user role (to prevent self-granting credits). Service role bypasses
    // RLS safely since this code only runs server-side.
    const svc = createServiceRoleClient() as unknown as SupabaseClient;
    await svc.from("credit_transactions").insert(creditPayload);
  }

  const svc = createServiceRoleClient() as unknown as SupabaseClient;
  await svc.rpc("increment_profile_stats", {
    p_user_id: user.id,
    p_money_saved_cents: generated.money_saved_cents,
  });

  // Send project-complete email (non-blocking)
  if (user.email) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("full_name, projects_count")
      .eq("id", user.id)
      .maybeSingle<{ full_name: string | null; projects_count: number | null }>();
    const firstName = prof?.full_name?.split(" ")[0] || "there";
    sendProjectCompleteEmail(
      user.email,
      firstName,
      generated.title,
      project.id,
      generated.estimated_cost_cents,
      generated.money_saved_cents
    ).catch(() => {});
    // Send thank-you on their first completed project
    if ((prof?.projects_count ?? 0) <= 1) {
      sendThankYouEmail(user.email, firstName).catch(() => {});
    }
  }

  return NextResponse.json({ projectId: project.id });
}
